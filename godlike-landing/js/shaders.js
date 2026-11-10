/* Fragment shader for the 3D figures (WebGL2). app.js prepends "#define S <scene id>" and compiles one program per scene. */
window.__FIGS_GLSL__ = `
uniform vec2 R;uniform vec2 O;uniform vec4 P;uniform vec4 U;uniform vec3 M;uniform sampler2D tex;uniform vec4 RP[4];uniform vec4 Q;uniform vec2 L;uniform sampler2D msk;uniform vec2 MK;out vec4 o;
#define T U.x
float G1=0.;float POP=0.;
mat2 RYm=mat2(1.),RXm=mat2(1.),ENVR=mat2(1.);vec3 MRO=vec3(0),MRD=vec3(0,0,1);float SCL=1.,YOFF=0.;
float A0=0.,A1=0.,A2=0.,A3=0.,A4=0.;vec3 B0=vec3(0);mat2 K1=mat2(1.),K2=mat2(1.);
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdRB(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float sdCylZ(vec3 p,float r,float h){vec2 d=vec2(length(p.xy)-r,abs(p.z)-h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
float sdBox2(vec2 p,vec2 b){vec2 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,q.y),0.);}
float sdRC(vec3 p,float r,float h,float rr){vec2 d=vec2(length(p.xz)-r+rr,abs(p.y)-h+rr);return min(max(d.x,d.y),0.)+length(max(d,0.))-rr;}
float sdRoundCone(vec3 p,float r1,float r2,float h){float b=(r1-r2)/h;float a=sqrt(1.-b*b);vec2 q=vec2(length(p.xz),p.y);float k=dot(q,vec2(-b,a));if(k<0.)return length(q)-r1;if(k>a*h)return length(q-vec2(0,h))-r2;return dot(q,vec2(a,b))-r1;}
float sdSeg2(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}
float sdTorusY(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
float ext(float d2,float z,float h,float r){vec2 w=vec2(d2+r,abs(z)-h+r);return min(max(w.x,w.y),0.)+length(max(w,0.))-r;}
float dot2(vec2 v){return dot(v,v);}
float sdHeart(vec2 p){p.x=abs(p.x);if(p.y+p.x>1.)return sqrt(dot2(p-vec2(.25,.75)))-sqrt(2.)/4.;return sqrt(min(dot2(p-vec2(0.,1.)),dot2(p-.5*max(p.x+p.y,0.))))*sign(p.x-p.y);}
float gear(vec3 p,float R,float tr,int N,float th,float hole){
 float seg=6.28318/float(N);float a=atan(p.y,p.x);float aa=mod(a+seg*.5,seg)-seg*.5;float rl=length(p.xy);
 vec3 q=vec3(rl*cos(aa),rl*sin(aa),p.z);
 vec2 w=vec2(rl-R+.06,abs(p.z)-th+.06);float disc=min(max(w.x,w.y),0.)+length(max(w,0.))-.06;
 float tooth=sdRB(q-vec3(R+tr*.35,0,0),vec3(tr*.65,tr*.42,th-.05),.05);
 float d=min(disc,tooth);
 return max(d,-(rl-hole));
}
// d, id (0 chrome, 1 lime, 2 cyan)
vec2 map0(vec3 p){
 if(S==0){ // server rack, drawers slide out
  float d=1e9;
  for(int i=0;i<5;i++){float off=(i==0)?A0:(i==1)?A1:(i==2)?A2:(i==3)?A3:A4;vec3 q=p-vec3(0,float(i)*.44-.88,-off);d=min(d,sdRB(q,vec3(1.28,.17,.78),.035));}
  float posts=min(sdRB(p-vec3(1.52,0,0),vec3(.09,1.25,.85),.03),sdRB(p-vec3(-1.52,0,0),vec3(.09,1.25,.85),.03));
  float tb=min(sdRB(p-vec3(0,1.3,0),vec3(1.6,.06,.88),.03),sdRB(p-vec3(0,-1.3,0),vec3(1.6,.06,.88),.03));
  return vec2(min(d,min(posts,tb)),0.);
 }
 if(S==1){ // extruded logo; body in tex.r, eyes in tex.g (signed distance, uv units); right eye winks
  vec2 uv=p.xy/3.4+.5;uv.y=1.-uv.y;
  float sq=A0;
  float sb=texture(tex,uv).r;
  vec2 ue=uv;float fz=1.;
  if(uv.x>.5){ue.y=.5017+(uv.y-.5017)/sq;fz=.3+.7*sq;}
  float se=texture(tex,ue).g*fz;
  vec2 oo=max(abs(uv-.5)-.5,0.);float pad=length(oo)*.9;
  float sd=min(sb,se)+pad;
  float d2=sd*3.4;
  vec2 w=vec2(d2+.05,abs(p.z)-.28);
  return vec2(length(max(w,0.))+min(max(w.x,w.y),0.)-.05,se<sb?1.:0.);
 }
 if(S==2){ // minibus
  float body=sdRB(p-vec3(0,.12,0),vec3(2.15,.78,.92),.14);
  float nose=dot(p-vec3(2.2,0,0),normalize(vec3(.9,.42,0)));
  body=max(body,nose-.05+.15);
  float wheels=1e9;
  for(int i=0;i<4;i++){float sx=(i<2)?1.35:-1.15;float sz=(i%2==0)?.9:-.9;wheels=min(wheels,sdCylZ(p-vec3(sx,-.78,sz),.42,.16));}
  for(int i=0;i<4;i++){float sx=(i<2)?1.35:-1.15;float sz=(i%2==0)?.9:-.9;body=max(body,-(sdCylZ(p-vec3(sx,-.78,sz),.5,.3)));}
  return wheels<body?vec2(wheels,1.):vec2(body,0.);
 }
 if(S==4){ // people hop
  float d=1e9;float id=0.;
  for(int i=0;i<3;i++){
   float fi=float(i)-1.;float sc=(i==1)?1.15:.88;
   float hop=(i==0)?A0:(i==1)?A1:A2;
   vec3 q=(p-vec3(fi*1.5,((i==1)?.15:-.25)+hop,(i==1)?-.5:.35))/sc;
   float b=sdRoundCone(q-vec3(0,-1.0,0),.52,.3,1.15);
   float h=length(q-vec3(0,.86,0))-.36;
   float dd=min(b,h)*sc;
   if(dd<d){d=dd;id=(i==1&&h<b)?1.:0.;}
  }
  return vec2(d,id);
 }
 if(S==5){ // one button
  float base=sdRC(p-vec3(0,-.8,0),1.75,.32,.14);
  float ring=sdTorusY(p-vec3(0,-.46,0),vec2(1.28,.06));
  float cap=sdRC(p-vec3(0,-.14-.2*G1,0),1.05,.32,.22);
  vec2 r=vec2(base,0.);
  if(ring<r.x) r=vec2(ring,2.);
  if(cap<r.x) r=vec2(cap,1.);
  return r;
 }
 if(S==6){ // puzzle
  p.xy*=K1;
  vec2 q=p.xy;
  float kr=A0;
  float d2=sdBox2(q,vec2(1.,1.));
  float k1=length(q-vec2(1.3,0.))-kr;
  float k2=length(q-vec2(0.,1.3))-kr;
  d2=smin(d2,k1,.14);d2=smin(d2,k2,.14);
  float h1=length(q-vec2(-1.3,0.))-.4;
  float h2=length(q-vec2(0.,-1.3))-.4;
  d2=max(d2,-min(h1,h2));
  return vec2(ext(d2,p.z,.38,.12),0.);
 }
 if(S==7){ // voxels
  vec2 r=vec2(1e9,0.);
  vec3 C[6]=vec3[6](vec3(-1.3,-1.0,0),vec3(0,-1.0,0),vec3(1.3,-1.0,0),vec3(-.65,.3,0),vec3(.65,.3,0),vec3(0,1.6,0));
  for(int i=0;i<6;i++){vec3 c=C[i];c.y+=(i==3?A0:i==4?A1:i==5?A2:0.);float d=sdRB(p-c,vec3(.55),.08);if(d<r.x)r=vec2(d,0.);}
  vec3 q=p-B0;q.xz*=K1;q.xy*=K2;
  float d=sdRB(q,vec3(.34),.06);if(d<r.x)r=vec2(d,1.);
  return r;
 }
 if(S==8){ // gears
  vec3 a=p-vec3(-.75,-.35,0);a.xy*=K1;
  float g1=gear(a,1.15,.36,10,.3,.5);
  vec3 q=p-vec3(1.55,.95,0);q.xy*=K2;
  float g2=gear(q,.68,.3,7,.3,.26);
  float hub=sdCylZ(p-vec3(-.75,-.35,0),.32,.13);
  float hub2=sdCylZ(p-vec3(1.55,.95,0),.14,.13);
  vec2 r=vec2(min(g1,g2),0.);
  float hb=min(hub,hub2);if(hb<r.x)r=vec2(hb,2.);
  return r;
 }
 if(S==9){ // bars
  vec2 r=vec2(1e9,0.);
  float H[5]=float[5](.7,1.15,1.7,2.3,3.0);
  for(int i=0;i<5;i++){float h=H[i]*((i==0)?A0:(i==1)?A1:(i==2)?A2:(i==3)?A3:A4);float d=sdRB(p-vec3(-2.2+float(i)*1.1,-1.6+h*.5,0),vec3(.4,h*.5-.1,.4),.1);if(d<r.x)r=vec2(d,(i==4)?1.:0.);}
  return r;
 }
 if(S==10){ // heart beat
  float s=A0;
  p/=s;
  vec2 hp=vec2(p.x,p.y+1.2)/2.0;
  float d2=sdHeart(hp)*2.0;
  return vec2(ext(d2,p.z,.62,.4)*s,0.);
 }
 if(S==11){ // chevrons wave
  vec2 r=vec2(1e9,0.);
  for(int i=0;i<3;i++){
   vec2 q=p.xy-vec2(0,1.25-float(i)*1.15+((i==0)?A0:(i==1)?A1:A2));
   float d2=min(sdSeg2(q,vec2(-1.55,-.6),vec2(0,.55)),sdSeg2(q,vec2(0,.55),vec2(1.55,-.6)))-.3;
   float d=ext(d2,p.z,.34,.12);
   if(d<r.x)r=vec2(d,(i==0)?1.:0.);
  }
  return r;
 }
 if(S==12){ // bubbles
  vec3 pa=p-vec3(0,A0,0);
  float b1=sdRB(pa-vec3(-.3,.5,0),vec3(1.05,.5,.06),.4);
  vec3 t=pa-vec3(-1.15,-.55,0);t.xy=K1*t.xy;
  float tail=sdRB(t,vec3(.26,.26,.2),.1);
  b1=smin(b1,tail,.12);
  vec2 r=vec2(b1,0.);
  for(int k=0;k<3;k++){float rr=(k==0)?A2:(k==1)?A3:A4;float d=length(pa-vec3(-.3+(float(k)-1.)*.72,.5,-.5))-rr;if(d<r.x)r=vec2(d,(k==1)?2.:1.);}
  vec3 pb=p-vec3(0,A1,0);
  float b2=sdRB(pb-vec3(1.55,-1.05,.55),vec3(.55,.28,.06),.3);
  vec3 t2=pb-vec3(1.1,-1.55,.55);t2.xy=K2*t2.xy;
  b2=smin(b2,sdRB(t2,vec3(.17,.17,.12),.07),.1);
  if(b2<r.x)r=vec2(b2,1.);
  return r;
 }
 if(S==13){ // rocket
  vec3 q=p;q.x+=A0;q.xy=K1*q.xy;q.y-=.35;
  float cyl=sdRC(q-vec3(0,-.5,0),.68,.85,.2);
  float nose=sdRoundCone(q-vec3(0,.3,0),.68,.07,1.7);
  float body=smin(cyl,nose,.15);
  vec3 f=q;float seg=2.0944;float a=atan(f.z,f.x);float aa=mod(a+seg*.5,seg)-seg*.5;float rl=length(f.xz);f=vec3(rl*cos(aa),f.y,rl*sin(aa));
  float fin=sdRB(f-vec3(.85,-1.0,0),vec3(.3,.5,.05),.05);
  body=smin(body,fin,.12);
  vec2 r=vec2(body,0.);
  vec3 t=q-vec3(0,.1,-.6);
  float ring=length(vec2(length(t.xy)-.32,t.z))-.08;
  if(ring<r.x)r=vec2(ring,0.);
  float pg=length(t*vec3(1,1,1.7))-.3;
  if(pg<r.x)r=vec2(pg,2.);
  float fh=A1;
  float fl=sdRoundCone(vec3(q.x,-(q.y+1.4),q.z),.5,.03,fh);
  if(fl<r.x)r=vec2(fl,1.);
  return r;
 }
 return vec2(1e9,0.);
}
vec2 map(vec3 p){
 p.y-=YOFF;
 vec2 r=map0(p/SCL);r.x*=SCL;return r;
}
vec3 nrm(vec3 p,float ee){vec2 e=vec2(ee,0);return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x));}
vec3 pal(float t){return .5+.5*cos(6.2831*(t+vec3(.0,.33,.67)));}
vec3 env(vec3 d){
 d.xz*=ENVR;
 float y=d.y*.5+.5;
 vec3 lime=vec3(.69,1.,0.),cy=vec3(.05,.95,.88);
 vec3 c=vec3(.01,.03,.035)+vec3(.02,.22,.2)*pow(y,2.)+vec3(.0,.1,.12)*smoothstep(.0,.5,1.-y);
 float strip=smoothstep(.85,.97,dot(d,normalize(vec3(-.3,.9,.5))));
 float st2=smoothstep(.93,.99,dot(d,normalize(vec3(.9,.3,.4))));
 float st3=smoothstep(.9,.985,dot(d,normalize(vec3(-.8,.1,.6))));
 float big=smoothstep(.2,.8,dot(d,normalize(vec3(.2,-.7,.7))));
 float hot=smoothstep(.975,.998,dot(d,normalize(vec3(.4,.6,-.6))));
 c+=strip*vec3(2.2)+st2*cy*2.6+st3*lime*2.2+big*vec3(.25,.7,.6)*.5+hot*vec3(3.);
 float bands=smoothstep(.4,.9,sin(d.y*9.+d.x*3.))*.35;
 c+=bands*cy*smoothstep(0.,.8,y);
 return c;
}
float PXA=.001;
float hash(vec2 p){p=fract(p*vec2(443.897,441.423));p+=dot(p,p.yx+19.19);return fract((p.x+p.y)*p.x);}
void camRay(vec2 uv,out vec3 ro,out vec3 rd){
 ro=vec3(0,0,-P.z);rd=normalize(vec3(uv,1.9));
 ro.yz*=RYm;rd.yz*=RYm;ro.xz*=RXm;rd.xz*=RXm;
}
// sphere-trace one ray; fills the hit point data; minr = closest approach in pixel footprints (for silhouette detection)
bool march(vec2 uv,out vec3 ro,out vec3 rd,out float t,out vec2 m,out float minr){
 camRay(uv,ro,rd);
 minr=1e9;t=0.;m=vec2(0);
 float bb=dot(ro,rd);float cc=dot(ro,ro)-4.6*4.6;float hh=bb*bb-cc;
 if(hh<0.)return false;
 hh=sqrt(hh);t=max(-bb-hh,0.);float tmax=-bb+hh;
 bool hit=false;
 for(int i=0;i<150;i++){
  if(float(i)>=L.x)break;
  m=map(ro+rd*t);
  minr=min(minr,m.x/(t*PXA));
  if(m.x<max(.0007,t*PXA*.25)){hit=true;break;}
  t+=m.x*.86;if(t>tmax)break;
 }
 return hit;
}
// shade a hit; edge=1 when the pixel is at a grazing angle (supersampled by the caller)
vec4 shade(vec3 ro,vec3 rd,float t,vec2 m,out float edge){
 edge=0.;
 vec3 p=ro+rd*t;
 vec3 n=nrm(p,max(S==1?.0042:.0016,t*PXA*.8));
 if(dot(n,-rd)<.4)edge=1.;
 // ripples: wave packets of light that run over the surface from each touch point, wobbling the reflections as they pass
 vec3 nn=n;vec3 rip=vec3(0);
 vec3 lime=vec3(.69,1.,0.),cy=vec3(.05,.95,.88);
 for(int i=0;i<4;i++){
  float age=T-RP[i].w;
  if(age>0.&&age<3.4){
   vec3 dv=p-RP[i].xyz;float d=length(dv);
   float f=d-age*2.8;
   float fade=exp(-age*.85)*smoothstep(0.,.06,age);
   float env=exp(-f*f*2.3);float osc=cos(f*9.5);
   vec3 td=dv-n*dot(dv,n);td/=max(length(td),1e-3);
   nn=normalize(nn+td*osc*env*fade*.42);
   vec3 wc=mix(lime,cy,clamp(d*.33+.15*osc,0.,1.));
   float behind=smoothstep(0.,-1.6,f)*smoothstep(-3.,-1.4,f);
   rip+=wc*(env*(.5+.5*osc)*fade*1.45+behind*fade*.16)+vec3(.9,1.,.92)*exp(-d*d*5.)*exp(-age*7.)*1.05;
  }
 }
 vec3 r=reflect(rd,nn);
 float fr=pow(1.-max(dot(-rd,nn),0.),3.);
 vec3 e=env(normalize(r+vec3(p.x*.34,p.y*.42,p.z*.2)));
 vec3 irid=pal(dot(nn,vec3(.3,.5,.2))*1.2+fr*.8+.05);
 irid=mix(irid,vec3(.69,1.,.0)*.8+vec3(0,.15,.2),.35);
 vec3 col=e*mix(vec3(1.),irid*1.4,.25)+fr*irid*.9;
 if(S==0){
  float onFront=step(.9,-n.z)*step(p.z,-.7);
  float idx=floor((p.y+1.1)/.44+.5);
  float rel=mod(p.y+1.1+.22,.44)-.22;
  float insideX=step(abs(p.x),1.05);
  if(onFront>.5&&abs(rel)<.12&&insideX>.5){
   col=vec3(.02,.08,.1)+e*.35;
   float fl=.7+.3*sin(T*3.+idx*1.7);
   float slit=step(abs(rel),.028)*step(abs(p.x+.25),.6);
   col+=slit*vec3(.69,1.,0.)*2.5*fl;
   float led=1.-smoothstep(.03,.045,length(vec2(p.x-.92,rel)));
   float led2=1.-smoothstep(.03,.045,length(vec2(p.x-.78,rel)));
   col+=led*vec3(.05,.95,.88)*3.*step(0.,sin(T*4.+idx*2.3))+led2*vec3(.69,1.,0.)*2.*step(0.,sin(T*2.6+idx));
  }
 }
 if(S==2){
  if(m.y>.5){ col=vec3(.01,.012,.015)+e*.12;
   vec2 wc=vec2((p.x>0.?1.35:-1.15),-.78);vec2 dd=p.xy-wc;float rr=length(dd);
   if(rr<.22&&abs(p.z)>.9){col=e*1.1;float sp=step(.6,sin(atan(dd.y,dd.x)*5.-T*9.));col=mix(col,vec3(.02),sp*.8);}
  }else{
   float side=step(.8,abs(n.z));
   if(side>.5&&p.y>-.1&&p.y<.62&&abs(p.x)<1.85){
    float pillar=step(.46,abs(fract((p.x+1.85)/.92)-.5));
    if(pillar<.5){col=vec3(.02,.09,.12)+e*.4;}
   }
   if(n.x>.5&&p.y>-.05&&p.y<.6&&abs(p.z)<.78) col=vec3(.02,.09,.12)+e*.45;
   float hl=1.-smoothstep(.07,.11,length(vec2(abs(p.z)-.62,p.y+.38)));
   if(n.x>.5) col+=hl*vec3(1.,1.,.8)*(2.5+1.2*sin(T*3.));
   if(side>.5&&abs(p.y+.32)<.035) col=vec3(.69,1.,0.)*1.6;
  }
 }
 if(S>=3||S==1){
  if(m.y>.5&&m.y<1.5) col=vec3(.69,1.,0.)*(.95+.45*G1)+e*.35+fr*.35;
  if(m.y>1.5) col=vec3(.05,.95,.88)*.95+e*.3+fr*.3;
 }
 // soft hover light that follows the pointer
 float dm=length(cross(p-ro,MRD));
 float g=exp(-dm*dm*1.3)*U.z;
 vec3 gc=mix(lime,cy,.5+.5*sin(T*2.+dm*2.2));
 col+=gc*g*(.35+fr*1.3)*(1.+M.z*.6);
 col+=rip;
 col=col/(1.+col*.18);
 return vec4(col,1.);
}
// where does the pointer ray first touch the figure? (read back from one pixel when a ripple is born)
void pick(){
 vec3 ro,rd;camRay(M.xy,ro,rd);
 float bb=dot(ro,rd);float cc=dot(ro,ro)-4.6*4.6;float hh=bb*bb-cc;
 float t=-1.;
 if(hh>0.){hh=sqrt(hh);float tt=max(-bb-hh,0.);float tmax=-bb+hh;
  for(int i=0;i<150;i++){vec3 p=ro+rd*tt;float d=map(p).x;if(d<.002){t=tt;break;}tt+=d*.86;if(tt>tmax)break;}}
 float v=clamp(t/16.,0.,.99999);
 o=vec4(floor(v*255.)/255.,fract(v*255.),t>0.?1.:0.,1.);
}
void initAnim(){
#if S==0
 A0=.2*pow(max(0.,sin(T*.9)),8.);A1=.2*pow(max(0.,sin(T*.9+1.7)),8.);A2=.2*pow(max(0.,sin(T*.9+3.4)),8.);A3=.2*pow(max(0.,sin(T*.9+5.1)),8.);A4=.2*pow(max(0.,sin(T*.9+6.8)),8.);
#elif S==1
 float wk=T-U.w;float c1=(wk>0.&&wk<.62)?sin(clamp(wk/.62,0.,1.)*3.14159):0.;
 float ip=mod(T,6.3);float c2=(U.y>.99&&ip<.5)?sin(ip/.5*3.14159):0.;
 A0=1.-.86*smoothstep(0.,.42,max(c1,c2));
#elif S==4
 A0=.22*abs(sin(T*1.7));A1=.22*abs(sin(T*1.7+1.9));A2=.22*abs(sin(T*1.7+3.8));
#elif S==6
 K1=rot(.22*sin(T*.7));A0=.4+.03*sin(T*2.3);
#elif S==7
 A0=.07*sin(T*1.6+3.3);A1=.07*sin(T*1.6+4.4);A2=.07*sin(T*1.6+5.5);
 B0=vec3(1.7*cos(T*.8)+.1,.7+.3*sin(T*1.3),1.5*sin(T*.8));K1=rot(T*.9);K2=rot(.4+T*.5);
#elif S==8
 K1=rot(T*.45);K2=rot(.3-T*.643);
#elif S==9
 A0=.8+.2*sin(T*1.1);A1=.8+.2*sin(T*1.1+.9);A2=.8+.2*sin(T*1.1+1.8);A3=.8+.2*sin(T*1.1+2.7);A4=.8+.2*sin(T*1.1+3.6);
#elif S==10
 float f=fract(T*1.1);A0=1.+.09*(exp(-pow((f-.12)*9.,2.))+.7*exp(-pow((f-.34)*9.,2.)));
#elif S==11
 A0=.16*sin(T*2.4);A1=.16*sin(T*2.4-1.);A2=.16*sin(T*2.4-2.);
#elif S==12
 A0=.07*sin(T*1.4);A1=-.09*sin(T*1.4+1.);
 A2=.2*(1.+.45*max(0.,sin(T*5.)));A3=.2*(1.+.45*max(0.,sin(T*5.-1.3)));A4=.2*(1.+.45*max(0.,sin(T*5.-2.6)));
 K1=rot(.7);K2=rot(-.7);
#elif S==13
 A0=.012*sin(T*37.);A1=1.6*(1.+.14*sin(T*28.)+.07*sin(T*43.));K1=rot(-.62);
#endif
}
// coarse occupancy pass: one ray per MK.x-pixel cell, conservative; tells the full pass which cells can contain the figure
void maskPass(){
 vec2 uv=(gl_FragCoord.xy*MK.x-.5*R)/R.y;
 vec3 ro,rd;camRay(uv,ro,rd);
 float bb=dot(ro,rd);float cc=dot(ro,ro)-4.6*4.6;float hh=bb*bb-cc;
 float occ=0.;
 if(hh>0.){
  hh=sqrt(hh);float t=max(-bb-hh,0.);float tmax=-bb+hh;
  float tol=tmax*(MK.x*.8+3.)*PXA;
  for(int i=0;i<150;i++){float d=map(ro+rd*t).x;if(d<tol){occ=1.;break;}t+=d*.86;if(t>tmax)break;}
 }
 o=vec4(occ,0,0,1);
}
void main(){
 RYm=rot(P.y);RXm=rot(P.x);ENVR=rot(T*.22);YOFF=.06*sin(T*1.3);
 G1=max(pow(max(0.,sin(T*1.15)),14.),M.z);
 float dtc=T-U.w;POP=(dtc>0.&&dtc<2.)?.06*exp(-dtc*5.)*sin(dtc*22.):0.;
 SCL=mix(.5,1.,U.y)*(1.+POP);camRay(M.xy,MRO,MRD);initAnim();
 PXA=1./(R.y*1.9);
 if(Q.x>1.5){maskPass();return;}
 if(Q.x>.5){pick();return;}
 if(MK.x>0.&&texelFetch(msk,ivec2((gl_FragCoord.xy-O)/MK.x),0).r<.5){o=vec4(0);return;}
 vec2 uv=(gl_FragCoord.xy-O-.5*R)/R.y;

 // anti-aliasing: the centre ray decides if the pixel needs it; extra rays only test coverage and re-use the
 // lighting of an already shaded hit on the same surface (same depth), so edges cost a fraction of a full trace
 vec4 acc=vec4(0),cref=vec4(0);float cnt=0.,tref=-1.;bool gz=false;
 for(int k=0;k<8;k++){
  if(float(k)>=L.y)break;
  vec2 of=(k==0)?vec2(0):vec2(fract(.5+float(k)*.7548776662),fract(.5+float(k)*.5698402909))-.5;
  vec3 ro,rd;float t,minr;vec2 m;
  bool hit=march(uv+of/R.y,ro,rd,t,m,minr);
  vec4 c=vec4(0);float e=0.;
  if(hit){
   if(tref>0.&&!gz&&abs(t-tref)<3.*t*PXA)c=cref;
   else{c=shade(ro,rd,t,m,e);if(tref<0.){cref=c;tref=t;}}
  }else if(minr<2.5)e=1.;
  if(k==0){if(e<.5){acc=c;cnt=1.;break;}gz=hit;}
  acc+=c;cnt+=1.;
 }
 vec4 c=acc/cnt;
 c.rgb+=(hash(gl_FragCoord.xy+T)-.5)/255.*c.a;
 o=c;
}
`;
