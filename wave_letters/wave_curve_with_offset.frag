
precision mediump float;
const float PI = 3.1415926535;
const float lineNumF = 30.0;
const float lineWidith = 0.01;


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
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

 
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv *= 2.0; // -1. ~ 1.
    uv.y += 1.0;// 0 ~ 2
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x *= 1.5;
    //st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0

    float x = st.x;
    x *= .2;
    x -= fract(iTime*0.1);
    // float x = uv.x;
    float y = 0.0;
    float a1 = -.2*sin(iTime*5.0);
    float f1 = 12.5;
    float y1 = wave2(x,a1,f1);
    float a2 = 0.0;//
    a2 = sin(iTime*10.)*0.1;
    float f2 = 8.0;
    float y2 = wave2(x+0.1,a2,f2);
    y = smax(y,y1,0.9);
    y = smax(y,y2,0.8);
    // y = smax(y,wave1(x*0.01),-0.9);
    float peak3 = 0.2;
    float narrow3 = 1.0;//*sin(iTime*10.);
    float y3 = wave3(x+0.2,peak3,narrow3);

    y = smax(y,y3,0.8);
    y = smax(y,0.2,0.9);


    
    vec2 st1 = st;

    // distort domain to make curve pattern
    //st1.y += 0.4 * sin(0.007*iTime*(st.x+iTime));
	st1.y += y;
    
    vec3 col;
    // draw basic line loop ----------------------------
    float index = floor(st1.y  * lineNumF);
    float gap = 1.0 / lineNumF;
    float r = index * gap;
    if(index > 30.0/st1.y){
        float line = 1.0 - smoothstep(0.0,lineWidith,abs(st1.y - r));

   		col += line;
    }



	fragColor = vec4(col,1.0);
}
