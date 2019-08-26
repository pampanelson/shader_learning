
precision mediump float;
const float PI = 3.1415926535;


// Polynomial smooth min (for copying and pasting into your shaders)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float smax(float a,float b,float k){
    return smin(a,b,-k);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

 
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv *= 2.0; // -1. ~ 1.
    uv.y += 1.0;

    vec2 st = vec2(atan(uv.x,uv.y),length(uv));

    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0

    // st.x += sin(iTime);

    float angle = sin(iTime);
    angle = .5; // 0.25 ~ 0.75 is 0 ~ pi
    angle *= 0.5;
    angle += 0.25;

    float r;
    float peakSharp = 0.3;// 0.3~ 0.4
    r = 1. - pow(abs(st.x-angle),peakSharp);
    r = smoothstep(0.0,0.77,r);
    r *= 0.5;
    // r *= 0.5;
    vec3 col;
    if(st.y < r){
    	col += 1.0;
    }
    
    

	fragColor = vec4(col,1.0);
}












