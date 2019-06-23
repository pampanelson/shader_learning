void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0.5 to 0.5)
    vec2 uv = fragCoord/iResolution.xy;
    uv -= .5;
    uv.x *= iResolution.x/iResolution.y;

    float gray;
    float gray1;
    float gray2;
    
    gray1 = -log(uv.x)*0.1;
    gray2 = 1.0-sqrt(uv.x);
    // gray = pow(uv.x,-.35)*0.2;
    // gray = exp(uv.x + 2.5) * 0.05;
    float l = sin(iTime)*0.5 + 0.5;
    gray = l * gray1 + (1.-l)*gray2;
    vec3 col = vec3(1.0); // white
    fragColor = vec4(col * gray, 1.0);
}