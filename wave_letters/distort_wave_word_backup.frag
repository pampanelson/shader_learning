const float PI = 3.1415926535;
const float aPI = acos(-1.);


// Polynomial smooth min (for copying and pasting into your shaders)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float smax(float a,float b,float k){
    return smin(a,b,-k);
}

float wave1(float x){
    return x;
}
float wave2(float x,float amplitude,float freq){
    float res = 0.0;

    res = amplitude - pow(x*freq,2.0);
    return res;
}
// peak is highest point , narrow is wave wide
float wave3(float x,float peak,float narrow){
    float res = 0.0;
    res = peak - narrow*abs(x*x*x);
    return res;
}

vec3 word_wave(vec2 st,float rotateSpeed,float distort,float colNumber,float offsetY,float lsratio,float wsratio){

    float speed = rotateSpeed;// sign means rotate clock(+) or counterclock(-)
    float piFactor = 128.0;// bigger number will avoid jump on loop but no effect on rotate speed
    float m = mod(speed*iTime,piFactor * PI);

    
    vec2 st1 = st;

    // make distort
	
	st1.y /= distort;// how ???????????????
    
    //float colNumber = 10.; //   input parameters ------------------
    st1.y *= colNumber;
	

    //st1.y = max(4.0,st1.y);
    
    //float offsetY = 7.0; // pass parameters
    
    if(st1.y < offsetY){
    	return vec3(0.0);
    }
    st1.x *= 1.*floor(st1.y);
    if(mod(floor(st1.y),2.0)>0.0){
    	st1.x += m;
    }else{
    	st1.x -= m;
    }
    
    vec2 polar = fract(st1);
    
    vec3 col;
    // Time varying pixel color
    //col = vec3(polar.x,polar.y,0.0);
	
    vec2 localPolar = polar;
    
    
    // pass parameter
    
    //float lsratio = 0.5;// =====================
    //float wsratio = 0.5;// =======================
    localPolar.x *= 1.0/(1.0 - wsratio);
    localPolar.y *= 1.0/(1.0 - lsratio);

    
    col = texture(iChannel0,localPolar).xyz;

    if(localPolar.x > 1.0 || localPolar.y > 1.0){
    	col *= 0.0;
    }
    
    return col;

}


float wave_distort(vec2 st,float angle){
    // distort =========================================

    
    vec2 st2 = st;
    //st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0

    float x = st2.x;
    x *= .2; // wave smooth factor
    // x -= fract(iTime*0.1);
    //x += 0.5;
    //x = -x;

    // =+++++++++++++ IMPORTANT ++++++++++++++++++++++++++++
    x += 0.25; // 0.45 : peak direct up position , 0.0 : - x axis , 0.9 : +x axis 
	x += sin(iTime*0.5);
    // float x = uv.x;
    float y = 0.0;
    float a1 = -.2*sin(iTime*5.0);
    float f1 = 12.5;
    float y1 = wave2(x,a1,f1);
    float a2 = 0.0;//
    a2 = sin(iTime*10.)*0.1;
    float f2 = 8.0; // power ===============================
    float y2 = wave2(x+0.1,a2,f2);
    y = smax(y,y1,0.9);
    y = smax(y,y2,0.8);
    // y = smax(y,wave1(x*0.01),-0.9);
    float peak3 = 0.1;//
    float narrow3 = 4.0;//*sin(iTime*10.);
    float y3 = wave3(x+0.2,peak3,narrow3);

    y = smax(y,y3,0.8);
    y = smax(y,0.2,0.9);

    y *= 1.;// whole scale =======================

	return y;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    
    bool bWaveDistortDebug = false;
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.x; // uv -.5 ~ .5  , x axis is scale t0 1.

    
    // prepare uv for st **********************************
    uv *= 2.0; // -1. ~ 1.
    uv.y += iResolution.y/iResolution.x;// origin point on (0.5 * x , 0.0)
    
    float offset = 0.2; // pass parameter
    uv.y -= offset;// whole screen offset ======================
    // uv *= 0.5;// 0 ~ 1
    
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    //st.x += PI;// 0 ~ 2PI on -y axis 

	// distort =========================================
    float angle = 0.0;// pass parameter
    float y = wave_distort(st,angle);

    
    vec3 col;
   // vec3 word_wave(vec2 st,float rotateSpeed,float distort,float colNumber,float offsetY,float lsratio,float wsratio){
    col = word_wave(st,2.0,y,20.,15.0,0.5,0.5);

    
    // debug distort wave =============
    if(st.y < y && bWaveDistortDebug){
   		col = vec3(1.0);
    }
    
    
    
    // Output to screen
    fragColor = vec4(col,1.0);
}