#!/usr/bin/env python3 -I
"""Завантаження файлу в сховище ассетів Webflow за даними з create_asset (S3 multipart).

Порядок: 1) create_asset (site_id, file_name, md5 файлу) → у відповіді id, дата (xAmzDate), підпис (xAmzSignature),
contentType; 2) цей скрипт; 3) звірити з CDN: curl hostedUrl → md5 і sha384 мають збігтися з локальним файлом.

Політику підпису відтворюємо з дати, ключа й типу (вона детермінована), тож передавати треба лише підпис.

Файл з рядками:  <шлях> <asset_id> <ім'я у Webflow> <xAmzDate> <xAmzSignature> <contentType>
  WEBFLOW_SITE_ID=<id сайту> python3 -I wfup.py upload.txt
Перевірка політики:  python3 -I wfup.py policy <xAmzDate> <key> <contentType>
"""
import base64
import datetime
import json
import os
import subprocess
import sys

SITE = os.environ.get("WEBFLOW_SITE_ID", "")
# ідентифікатор ключа Webflow у S3 (приходить у uploadDetails.xAmzCredential; змінюється рідко)
CRED = os.environ.get("WEBFLOW_S3_CRED", "AKIAQLLHWD6MEJGETLST") + "/%s/us-east-1/s3/aws4_request"


def policy(date, key, ctype):
    # термін дії = xAmzDate + 1 година (через datetime, щоб 23:xx коректно переходило на наступну добу)
    t = datetime.datetime.strptime(date, "%Y%m%dT%H%M%SZ") + datetime.timedelta(hours=1)
    exp = t.strftime("%Y-%m-%dT%H:%M:%SZ")
    obj = {"expiration": exp, "conditions": [["starts-with", "$key", SITE + "/"], {"cache-control": "max-age=31536000"},
           {"Content-Type": ctype}, {"success_action_status": "201"}, ["starts-with", "$Content-Type", ctype],
           ["content-length-range", 0, 31457280], {"acl": "public-read"}, {"bucket": "webflow-prod-assets"},
           {"X-Amz-Algorithm": "AWS4-HMAC-SHA256"}, {"X-Amz-Credential": CRED % date[:8]}, {"X-Amz-Date": date}, {"key": key}]}
    return base64.b64encode(json.dumps(obj, separators=(",", ":")).encode()).decode()


def upload(path, asset_id, name, date, sig, ctype):
    key = "%s/%s_%s" % (SITE, asset_id, name)
    f = ["acl=public-read", "bucket=webflow-prod-assets", "X-Amz-Algorithm=AWS4-HMAC-SHA256", "X-Amz-Credential=" + CRED % date[:8],
         "X-Amz-Date=" + date, "key=" + key, "Policy=" + policy(date, key, ctype), "X-Amz-Signature=" + sig,
         "success_action_status=201", "Content-Type=" + ctype, "Cache-Control=max-age=31536000", "file=@" + path]
    cmd = ["curl", "-sS", "-m", "120", "-o", "/dev/null", "-w", "%{http_code}", "https://webflow-prod-assets.s3.amazonaws.com/"]
    for x in f:
        cmd += ["-F", x]
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(name, r.stdout, r.stderr[:200])  # 201 = успіх


if __name__ == "__main__":
    if not SITE:
        sys.exit("Задайте WEBFLOW_SITE_ID (id сайту Webflow)")
    if len(sys.argv) == 5 and sys.argv[1] == "policy":
        print(policy(*sys.argv[2:5]))
    elif len(sys.argv) == 2 and sys.argv[1] != "policy":
        for n, line in enumerate(open(sys.argv[1], encoding="utf-8"), 1):
            if not line.strip():
                continue
            parts = line.split()
            if len(parts) != 6:
                sys.exit("Рядок %d: потрібно 6 полів (шлях asset_id ім'я xAmzDate xAmzSignature contentType), є %d" % (n, len(parts)))
            upload(*parts)
    else:
        sys.exit(__doc__)
