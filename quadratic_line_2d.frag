
vec2 udBezier(in vec2 p0, in vec2 p1, in vec2 p2, in vec2 pos)
{    
    // p(t)    = (1-t)^2*p0 + 2(1-t)t*p1 + t^2*p2
    // p'(t)   = 2*t*(p0-2*p1+p2) + 2*(p1-p0)
    // p'(0)   = 2(p1-p0)
    // p'(1)   = 2(p2-p1)
    // p'(1/2) = 2(p2-p0)
    vec2 a = p1 - p0;
    vec2 b = p0 - 2.0*p1 + p2;
    vec2 c = p0 - pos;

    float kk = 1.0 / dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(c,b)) / 3.0;
    float kz = kk * dot(c,a);      

    vec2 res;

    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float h = q*q + 4.0*p3;

    if(h >= 0.0) 
    { 
        h = sqrt(h);
        vec2 x = (vec2(h, -h) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = uv.x + uv.y - kx;
        t = clamp( t, 0.0, 1.0 );

        // 1 root
        vec2 qos = c + (2.0*a + b*t)*t;
        res = vec2( length(qos),t);
    }
    else
    {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
        t = clamp( t, 0.0, 1.0 );

        // 3 roots
        vec2 qos = c + (2.0*a + b*t.x)*t.x;
        float dis = dot(qos,qos);
        
        res = vec2(dis,t.x);

        qos = c + (2.0*a + b*t.y)*t.y;
        dis = dot(qos,qos);
        if( dis<res.x ) res = vec2(dis,t.y );

        qos = c + (2.0*a + b*t.z)*t.z;
        dis = dot(qos,qos);
        if( dis<res.x ) res = vec2(dis,t.z );

        res.x = sqrt( res.x );
    }
    
    return res;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p0 = vec2(.3,1.0);
    vec2 p1 = vec2(0.0,.6);
    vec2 p2 = vec2(.4,0.2);
    float lineWidth = .5/iResolution.y; // pixel divide by resolution
    vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;

    float be = udBezier( p0, p1, p2, p ).x;
    vec3 col;

  
	float d = 0.;

    // bezier
    d = be;
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.003,0.003+lineWidth*1.5,d) );
    fragColor = vec4(col,1.0);
}