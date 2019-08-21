//Fast Code, No Optim and clean ;) !
precision mediump float;

float PI=3.1415926535;

// Polynomial smooth min (for copying and pasting into your shaders)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float smax(float a,float b,float k){
    return smin(a,b,-k);
}

vec3 showCurve(float uvy,float c,vec3 color){
    if(uvy < c){
        return color;
    }
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xx;    
    vec2 uv2 =  -1.0 + 2.0 * uv; // -1 ~ 1

    vec3 color = vec3(0.0);

    float c;
    // sin
    // c = 0.1*sin(uv.x*PI);

    // x*x*x
    float c1 = 1. - abs(pow((uv.x- 0.5)*4.,3.0));
    c1 *= 0.5;
    color += showCurve(uv.y,c1,vec3(0.2,0.0,0.0));
    // x*x
    float c2 = 1.-pow(uv.x-0.5,2.0);
    c2 *= 0.5;
    // color += showCurve(uv.y,c2,vec3(0.0,0.2,0.0));


    float c3 = 0.4;

    c = smax(c1,c3,0.1);

    color += showCurve(uv.y,c,vec3(0.0,0.0,0.2));


	fragColor =  vec4(color, 1.0);
    
      
}

