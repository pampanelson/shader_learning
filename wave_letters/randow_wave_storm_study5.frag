//Fast Code, No Optim and clean ;) !
precision mediump float;
float Hash2d(vec2 uv)
{
    float f = uv.x + uv.y * 47.0;
    return fract(cos(f*3.333)*100003.9);
}
float Hash3d(vec3 uv)
{
    float f = uv.x + uv.y * 37.0 + uv.z * 521.0;
    return fract(cos(f*3.333)*100003.9);
}
float mixP(float f0, float f1, float a)
{
    return mix(f0, f1, a*a*(3.0-2.0*a));
}
const vec2 zeroOne = vec2(0.0, 1.0);
float noise2d(vec2 uv)
{
    vec2 fr = fract(uv.xy);
    vec2 fl = floor(uv.xy);
    float h00 = Hash2d(fl);
    float h10 = Hash2d(fl + zeroOne.yx);
    float h01 = Hash2d(fl + zeroOne);
    float h11 = Hash2d(fl + zeroOne.yy);
    return mixP(mixP(h00, h10, fr.x), mixP(h01, h11, fr.x), fr.y);
}
float noise(vec3 uv)
{
    vec3 fr = fract(uv.xyz);
    vec3 fl = floor(uv.xyz);
    float h000 = Hash3d(fl);
    float h100 = Hash3d(fl + zeroOne.yxx);
    float h010 = Hash3d(fl + zeroOne.xyx);
    float h110 = Hash3d(fl + zeroOne.yyx);
    float h001 = Hash3d(fl + zeroOne.xxy);
    float h101 = Hash3d(fl + zeroOne.yxy);
    float h011 = Hash3d(fl + zeroOne.xyy);
    float h111 = Hash3d(fl + zeroOne.yyy);
    return mixP(
        mixP(mixP(h000, h100, fr.x), mixP(h010, h110, fr.x), fr.y),
        mixP(mixP(h001, h101, fr.x), mixP(h011, h111, fr.x), fr.y)
        , fr.z);
}


float PI=3.1415926535;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xx;    
    vec2 uv2 =  -1.0 + 2.0 * uv; // -1 ~ 1
    uv2.y += 1.;
    uv2.xy *= 7.5;  
    vec3 color = vec3(0.0);
    
        
    float wave = (sqrt(sin( 
                            (-0.9*noise2d(uv*30.0)*3.1416) 
                            + 
                            ((uv2.x*uv2.x) + (uv2.y*uv2.y)) 
                        )     
                    ));
     
        
        
    wave = smoothstep(0.996, 1.0, wave);
    color += wave * 1.5;
      


	fragColor =  vec4(color, 1.0);
    
      
}

