precision mediump float;
const float PI = 3.1415926535;
const float aPI = acos(-1.0);
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    vec3 col;
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv *= 2.0; // -1. ~ 1.

    // uv.y += 1.0;

    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x += aPI;
    float speed = 10.;// sign means rotate clock(+) or counterclock(-)
    float m = mod(speed*iTime, 2.0 * aPI);
    st.x -= m;
    if(abs(st.x)<0.001){
        col = vec3(1.);
    }
	fragColor = vec4(col,1.0);
}