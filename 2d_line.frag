float line( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = -p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h );
    
    return clamp(((1.0 - d)-0.99)*100.0, 0.0, 1.0);
}


vec3 stroke(float x, float s, float w,vec3 col) {
	float d = step(s,x+w*.5) - step(s, x-w*.5);
    return clamp(d, 0., 1.)*col;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //vec2 uv = fragCoord/iResolution.xy;
    //float ratio = iResolution.x / iResolution.y;
    //uv.x *= ratio;
    
   	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * uv;
    p.x *= iResolution.x / iResolution.y;
 

    vec2 a = vec2(0.,-1.);    
    vec2 b = vec2(0.,1.);
    vec3 c = vec3(0.);
    c += line(p, a, b);
	vec3 lineCol = vec3(1.,0.,0.);
    c *= lineCol;
    fragColor = vec4(c,1.0);
}