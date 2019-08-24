const float PI = 3.1415926535;
const float aPI = acos(-1.);

float maRippleSize;
float miRippleSize;
float maRippleSpeed;
float miRippleSpeed;

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

    // make distort
    
    if(distort > 0.0){
    	st.y /= distort;// how ??????????????? divided a number less 1.0 will amplify 
    }
	

    
    //float colNumber = 10.; //   input parameters ------------------
    st.y *= colNumber;
	

    //st1.y = max(4.0,st1.y);
    
    //float offsetY = 7.0; // pass parameters
    
    if(st.y < offsetY){
    	return vec3(0.0);
    }
    st.x *= 1.*floor(st.y);
    if(mod(floor(st.y),2.0)>0.0){
    	st.x += m;
    }else{
    	st.x -= m;
    }
    
    vec2 polar = fract(st);
    
    vec3 col;
    // Time varying pixel color
    //col = vec3(polar.x,polar.y,0.0);
	
    vec2 localPolar = polar;
    
    
    // pass parameter
    localPolar.x *= 1.0/(1.0 - wsratio);
    localPolar.y *= 1.0/(1.0 - lsratio);

    
    col = texture(iChannel0,localPolar).xyz;

    if(localPolar.x > 1.0 || localPolar.y > 1.0){
    	col *= 0.0;
    }
    
    return col;

}


float wave_distort(bool use,vec2 st,float angle){
    // distort =========================================

    
    vec2 st2 = st;
    //st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0

    float x = st2.x;
    x *= .2; // wave smooth factor
    // x -= fract(iTime*0.1);
    //x += 0.5;
    //x = -x;

    // =+++++++++++++ IMPORTANT ++++++++++++++++++++++++++++
    if(!use){
        
       x += 1.; // this value makes no distort ================ . TODO 
    }
    else{
		x += -.0; // 0.0 is up direct , -0.5 is right direct , 0.5 is left direct
        x += 0.5 - angle;// angle is 0. ~ 1, 1 is right direct , 0 is left direct 

    }
    
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

    y *= 1.2;// whole scale =======================

	return y;
}


float line_wave(vec2 st,float lineNumber,float lineWidth,float offsetY,float distort,bool bRipple){
	float line;
    float sty = st.y;
    if(bRipple){
      	float maRipple = sin(iTime) * maRippleSpeed;
        //line = 1. - smoothstep(0.0,lineWidth,abs(sty + ripple - 0.1 ));
            
        sty += maRipple * maRippleSize;
    }
        
    sty /= distort;
    sty *= lineNumber;
    
    
    float index = floor(sty);
    if(index > offsetY){
        
        if(bRipple){
        	float miRipple = sin(index*iTime) * miRippleSpeed;
            
            sty += miRipple * miRippleSize;
        }
        
       	sty = fract(sty);
    
    	line = 1. - smoothstep(0.0,lineWidth,abs(sty - 0.1));
    

    }

	return line;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    

    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.x; // uv -.5 ~ .5  , x axis is scale t0 1.

    
    // prepare uv for st **********************************
    uv *= 2.0; // -1. ~ 1.
    uv.y += iResolution.y/iResolution.x;// origin point on (0.5 * x , 0.0)
    
    float offset = 0.0; // pass parameter
    uv.y -= offset;// whole screen offset ======================
    // uv *= 0.5;// 0 ~ 1
    
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    //st.x += PI;// 0 ~ 2PI on -y axis 

	// distort =========================================
    bool bUseWaveDistort = true;
    
    float angle;
    angle = 0.0;
    angle = clamp(0.0,1.0,angle);//angle is 0. ~ 1, 1 is right direct , 0 is left direct 
   	angle = (sin(iTime) + 1.)*0.5;// pass parameter

    float y = wave_distort(bUseWaveDistort,st,angle);
    
    
    
    vec3 col;
   // vec3 word_wave(vec2 st,float rotateSpeed,float distort,float colNumber,float offsetY,float lsratio,float wsratio){
    //col = word_wave(st,2.0,y,10.,10.0,0.5,0.5);

    // pass parameters
    float lineWidth = 0.08;
    float lineNumber = 20.;
    float offsetY = 10.;
    
    bool bRipple = true;
    maRippleSpeed = 0.05;
    maRippleSize = .2;
    
    miRippleSpeed = 0.05;
    miRippleSize = 1.5;
    


    col = vec3(line_wave(st,lineNumber,lineWidth,offsetY,y,bRipple));
    
    
    
    
    
    // debug distort wave =============
    bool bWaveDistortDebug = false;
    if(st.y < y && bWaveDistortDebug){
   		col = vec3(1.0);
    }
    
    
    
    // Output to screen
    fragColor = vec4(col,1.0);
}