const float PI = 3.1415926535;
const float lineNumF = 20.0;
const float lineWidith = 0.01;
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 col;
 
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.x; // uv -.5 ~ .5  , x axis is scale t0 1.
    uv *= 2.0; // -1. ~ 1.
    uv.y += iResolution.y/iResolution.x;// origin point on (0.5 * x , 0.0)
    // uv *= 0.5;// 0 ~ 1
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x += PI;// 0 ~ 2PI on -y axis 

    st.y += .04 * sin(0.1*iTime*st.x*16.);
    float index = floor(st.y  * lineNumF);
    float gap = 1.0 / lineNumF;
    float r = index * gap;
    float line = 1.0 - smoothstep(0.0,lineWidith,abs(st.y - r));

    col += line;
    // if(st.y < .5){
    //     col += 1.0;
    // }
	fragColor = vec4(col,1.0);
}
