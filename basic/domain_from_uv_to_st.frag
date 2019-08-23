precision mediump float;
const float PI = 3.1415926535;


float rand(float x) {
    return fract(sin(x)*43758.5453123);
}


float band(vec2 uv,vec2 st, float size, float width, vec2 offset, float t,float random){
    float blur = 0.004;
    uv += offset;

    uv.x += sin(uv.y * 1.0 + t) * 0.01; // move left and right
    uv.y += sin(uv.x * 21.0 +t*2.)*1.5*random;
    float d = length(uv);
    float e = smoothstep(size + width + blur, size + width, d);
    d = smoothstep(size + blur, size, d);
    e -= d;
   
	return e;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 col = vec3(0., 0, 0);

    vec2 uv = fragCoord/iResolution.xy;
    uv -= 0.5;
    uv *= 2.0;
    uv.x *= iResolution.x/iResolution.y;
    float t = iTime;
    
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    //st.x = st.x/(PI*2.0) - 0.5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0 
    vec2 uv1 = uv;
    uv1.x += sin(uv1.y * 1.0) * .001; // move left and right
    uv1.y += sin(uv1.x * 1.0)* .0005;

    // col += vec3(uv1.x,0.0,0.0);
    col += vec3(0.0,uv1.y,0.0);
    col = vec3(length(uv1));



    fragColor = vec4(col, 1.);
}