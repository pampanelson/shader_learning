


const float zoom = 1.;
const float lineThickness = 1.5; // in pixels
const float nearZ = 0.0;
const float farZ = 1000.0; 
#define kWidth 6. // line width , 1. to 6.

/*
// alternative settings for full-screen
const int numCubes = 64;
const float twistStep = .03;
const float scaleStep = 0.98;
const float zoom = 2.8;
const float lineThickness = .8; // in pixels
*/


// input in range [-1,1] to span iResolution.y pixels
float RenderLine( vec2 a, vec2 b, vec2 fragCoord )
{
    a = (iResolution.y*a + iResolution.xy)*.5;
    b = (iResolution.y*b + iResolution.xy)*.5;
    
    const float halfThickness = lineThickness*.5; 

    const float halfAASoftening = 1.2; // in pixels (don't change this much)
    
    float t = dot(fragCoord-a,b-a);
    t /= dot(b-a,b-a);
    t = clamp( t, 0., 1. );
    return smoothstep( halfThickness-halfAASoftening, halfThickness+halfAASoftening, length(fragCoord - mix(a,b,t)) );
}

    
float RenderLine3D( vec3 a, vec3 b, vec2 fragCoord )
{
    vec3 camPos = vec3(0,0,-5);
    
    a -= camPos;
    b -= camPos;
    
    // todo: transform by camera matrix

    a.z /= zoom;
    b.z /= zoom;
    
    // perspective projection
    return RenderLine( a.xy/a.z, b.xy/b.z, fragCoord );
}


// combine 2 anti-aliased values
float BlendAA( float a, float b )
{
    // a and b values represent what proportion of the pixel is covered by each line,
    // but they don't contain enough information to accurately combine them!
    // if both lines are covering the same part of the pixel the result should be min(a,b)
    // if they cover non-overlapping parts of the pixel the result is a-(1-b)
	// a*b assumes the proportion of overlap is the same in the solid and clear regions
    // this is the safest assumption given the lack of any other info

    // but, tune it until it looks good
    return mix( min(a,b), a*b, .5 );
    //return a*b;
   
}
vec3 Draw2DLine(vec2 a,vec2 b,vec2 p){
    vec3 res = vec3(1.);
    vec2 pa = -p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h );
    
    float line = clamp(((1.0 - d*kWidth)-0.99)*100.0, 0.0, 1.0)*kWidth;
    res *= line;
    return res;
}


vec3 Draw3DLine(vec3 a,vec3 b,vec2 p,vec3 cam){
    if(a.z >= nearZ && a.z <= farZ && b.z >= nearZ && b.z <= farZ ){
        vec2 a1;
        float ratioA = abs(cam.z)/(abs(cam.z - a.z));
        a1 = a.xy * ratioA; 
        vec2 b1;
        float ratioB = abs(cam.z)/(abs(cam.z - b.z)); 
        b1 = b.xy * ratioB;
        return Draw2DLine(a1,b1,p);
    }

}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

   	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * uv;
    p.x *= iResolution.x / iResolution.y;
    p *= -1.;

    // float line = 1.;    
    // vec3 c;
    // int nums = 50;
    // for(int i=0;i<nums;i++){
	//     vec3 a = vec3(0.,-1.,0.);
    //     vec3 b = vec3(1.*cos(iTime*float(i)),2.*float(i+1),0.);
    //     c = vec3(sin(float(i*10)/100.),float(i)/10.,cos(float(i)));
    //     line = BlendAA( line, RenderLine3D(a,b,fragCoord) );
        

    // }


    
    // c *= 1.-line;// get color 
		
    // c = 1.-c; // reverse and remove black dot 
    // 	// Output to screen

    vec3 color;

    vec3 a = vec3(.0,.0,0.);
    vec3 b = vec3(cos(iTime),sin(iTime),0.);    
    vec3 c = vec3(1.,2.,1.);

    vec3 cam = vec3(0.,0.,-5.);

    color += Draw3DLine(a,b,p,cam);
    //color += Draw2DLine(a.xy,b.xy,p);

    //color = 1. - color;
   	fragColor = vec4(color,1.0);
        
    
}
    
