
const float PI = 3.1415926535;

// Original noise code from https://www.shadertoy.com/view/4sc3z2
#define MOD3 vec3(0.1031,.91369,0.13787)

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+.00019);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float simplex_noise(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - 1.0 * K2);
    vec3 d2 = d0 - (i2 - 2.0 * K2);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);
    
    // most expensive operation-----------------
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    float distortScale = 20.;
    //vec4 n = vec4(1.);
    return dot(vec4(distortScale), n);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    //vec2 uv = fragCoord/iResolution.y;
        
    
    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5

    uv.y += 0.5;
    //vec2 uv = fragCoord.xy/iResolution.xy;
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0 
    // origin on -y axis 
	
    float m = 0.;
    float t = iTime*.3;
    //t = 1.;
    vec3 col;
    float lineWidith = 0.004;

    float number = 30.;
    for(float i=number; i>=5.; i-=1.){
        // where is magic happend : "vec2(st.y,uv.x)"
        float edge = simplex_noise(vec3(vec2(st.y,uv.x) * vec2(15.5, 0.0) + vec2(0, t + i*1.5), 1.))*.2 + 0.25;// + (.5/COUNT)*i + .25;
        edge *= 0.2;   
        
        //if(st.y < i * edge){
          //  col += vec3(0.0,0.0,0.03);
        //}
        
        float line = 1.0 - smoothstep(0.0,lineWidith,abs(st.y - i * edge));

   		col += line*0.8;
    }           

    
    fragColor = vec4(col,1.0);
}