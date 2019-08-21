precision mediump float;

const float PI = 3.1415926535;
vec2 hash( vec2 x )  // replace this by something better
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5

    uv.y += 0.7;
    //vec2 uv = fragCoord.xy/iResolution.xy;
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 
    // Time varying pixel color
    float number = 4.;
    float t = floor(st.y * number);
    //st.y = t * 0.1;
    //st.y *= t;

    vec3 col;
    st.x += 0.15;

    vec2 st1 = st;
    st1.x *= 400.*st1.y+10.*sin(iTime);
   
    
	col += vec3(noise(st1));
	//col += 0.2;
    

    float thresh1 = st.x - 0.6;// part of st.x near to 0.6 make smaller thresh1  
    col *= max(0.0,thresh1);    // smaller thresh1 make fade out effect
	col *= 15.;
    
    vec2 st2 = st;
    st2.x *= 500.*st2.y+10.*sin(iTime);

    float col2 = noise(st2);

   if(col.x == 0.0){
   		col += col2;
        //col *= thresh2;
       	//col *= max(.0,thresh3);
        col *= st.x - .6;
        col *= 15.;
    }
    

    col *= max(0.0,st.y - 0.83);
    col *= 10.;
    vec2 st3 = st;
    st3.x -= 0.25;
    st3.x *= 800.*st3.y+10.*sin(iTime);
    float col3 = noise(st3);
    if(col.x == 0.0){
        col += col3;
        col *= st.y - 0.89;
    }

    col *= 10.;
    // Output to screen
    fragColor = vec4(col,1.0);
}