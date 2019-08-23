const float PI = 3.1415926535;

// Polynomial smooth min (for copying and pasting into your shaders)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float smax(float a,float b,float k){
    return smin(a,b,-k);
}

float hash1(float s){
    return sin(s * 42.6520981210954362);
}

float hash2(float s){
    return fract(s * 24.57608761367653 + 0.4146145118678);
}

float wave1(float stx,float scale,float t){    // float angle = abs(sin(iTime))* 1.5;


        //float angle = .3 + 0.4 * abs(sin(iTime)) - 0.12;// 0.3~0.5
        //float angle = .3 + 0.4 * a - 0.12;// 0.3~0.5

        // stx += angle;
        float hash1 = hash1(t);
        // float hash2 = hash2(iTime);
        float r;
        float r1 = (0.1 + 0.0001 * hash1) * abs(sin((stx + 0.1*t) * 4.1));
        float r2 = (0.12 - 0.001 * hash1) * sin(stx*14. + t);
        float r3 = (.35 + 0.0001 * hash1) * cos(stx*18. + t)-0.6;

        
        r = smax(r,r1,0.6);
        r = smax(r,r2,.2);
        r = smax(r,r3,.6);
        r *= scale;
        r = max(0.0,r);
        return r;
    }

float wave2(float stx,float scale){
    float res;

    stx = 4.*(stx-0.5);// input stx is 0.25~0.75 after uv.y += 0.5
                        // now convert stx to -1 ~ 1 for local point up curve
    res = 1. - abs(stx) - 0.1; // move sharp peak lower bit
    float res1 = 1. - pow(stx,2.0);
    res = smax(res,res1,0.2); // linear make very sharp peak,mix with powered smooth peak
    res *= scale; // scale down 
    res = max(0.0,res);

    return res;
}

float wave(float stx,float t,float scale){
    // st.x += 0.25 * sin(iTime);
    // a = abs(sin(iTime));
    float w1 = wave1(stx,0.7,t);
    float w2 = wave2(stx,0.15);

    // for debug
    // if(st.y < w1){
    //     col += vec3(1.0,0.0,0.0);
    // }

    // if(st.y < w2){
    //     col += vec3(0.0,1.0,0.0);
    // }

    float w = smax(w1,w2,0.02);
    w *= scale;
    return w;
}


float hash(vec2 p)  // replace this by something better
{
    p  = 50.0*fract( p*0.34768375633183 + vec2(0.71,0.113));
    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv.y += 0.5;
    //vec2 uv = fragCoord.xy/iResolution.xy;
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0 
    // origin on -y axis 
	
    vec3 col;
    st.x += 0.0; // peak direct up to +y axis, rotate range is -0.25~0.25 
    float number = 1.;
    float oldLine;

    vec2 st1 = st;
    st1.y = fract(st1.y*number);

    float w = 0.1;
    float scale = 3.;
    w = wave(st1.x,iTime,scale);
    w = noise(vec2(st1.y*3.,st1.x*0.5));
    // w *= 0.5;
    // col += 1. - smoothstep(0.0,0.15,abs(st1.y - w));
    col += 1. - smoothstep(0.0,0.004,abs(st1.y - w));

    // for(float i = 0.;i<number;i++){
    //     float w = wave(st.x+i,1.0,scale*i);
    //     if(st.y < w){
    //         col += vec3(0.0,0.0,.05);
            
    //     }
    //     col += 1. - smoothstep(0.0, 0.001, abs(st.y - w));
    // }


    // Output to screen
    fragColor = vec4(col,1.0);
}