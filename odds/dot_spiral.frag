// Fork of "Dots and Spirals" by Vovosunt. https://shadertoy.com/view/MltyzN
// 2019-07-13 03:08:24

#define smooth (1.0 / iResolution.x)
#define PI      3.14159265359
#define liness 8.0
#define rings 32.0
#define swirls 18.0
#define size 0.005
#define pos 0.15
#define width 0.055

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 st = (fragCoord.xy -0.5 * iResolution.xy)/ iResolution.x;
        
    vec3 finCol = vec3(0.0);
    float lines = floor(iMouse.x / iResolution.x * liness + 1.);
    float swirl = floor(iMouse.y / iResolution.y * swirls + 1.);
    float maxz = 0.0;
    
    
    for(float i = 0.0; i < lines; ++i){
    
        float il = i /lines;
        
    	float a =(atan(st.x,st.y) + PI)/PI/2.;
    	float aa = (floor(a * rings) + 0.5)/rings;
    	aa = aa * 2.0 * PI - PI;
    	float offset = floor(a * rings)/rings * 2.0 * PI * swirl + il * 2.0 * PI;
    	float rt = cos(iTime * 1.0 + offset)/2.0 + 0.5;
    	float rm = sin(iTime * 1.0 + offset)/2.0 + 0.5;
    	float ll = mix(pos - width,pos + width,rt);
    
    	vec2 center = vec2(ll*sin(aa),ll*cos(aa));

        float ring = length(center - st);
        ring = smoothstep(smooth,-smooth,ring -size *(1.0 +  rm)/2.0);
        //vec3 color = vec3(il, fract(il*2.0),fract(il*3.0)) + vec3(0.15);
        // float xm = (0.25 + rm)/1.25;
        // if(maxz < xm){
        //    finCol = mix(finCol,color * xm,ring);
        //     maxz = xm;
        // }
        // finCol = mix(finCol, color *ring * (0.25 + rm)/1.25, step(maxz - rm,0.0));
        finCol = max(finCol,ring * (0.25 + rm)/1.25);
    }
    
	fragColor = vec4(finCol,1.0);
}
