precision mediump float;
const float PI = 3.1415926535;


float rand(float x) {
    return fract(sin(x)*43758.5453123);
}


float band(vec2 uv,vec2 st, float size, float width, vec2 offset, float t,float random){
    float blur = 0.005;
    uv += offset;
    

      
   	uv.x += sin(uv.y * 18.0) * .01; // move left and right
    uv.y += sin(uv.x * 20.0)*0.005 * 10.990*st.x*2.5;// multiply for deform
        
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
    
    vec2 st = vec2(atan(uv.x,uv.y+1.),length(uv));
    st.x = st.x/(PI*2.0) - 0.5; // normalized 
	st.x += 1.;// +y is 0.25 ~ 0.75
    st.x -= 0.25;
    st.x *= 2.; // +y is 0.~1.
    float number = 100.;
    float step = 2.5/number;
    //if(st.x < .5){
        for(float i = 0.0;i<number;i++){

            float i1 = floor(i/1.);
            float rand = 0.046*rand(i1)*rand(i1);
            float mask = band(uv,st,0.2 + step*i, 0.0022, vec2(0., 1.0), t,rand);
            col += 1. * mask;



        }

    //}

    fragColor = vec4(col, 1.);
}