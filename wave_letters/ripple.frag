precision mediump float;
const float mPI = 3.1415926535;

float hash11(float p)
{
    p = fract(p * .31);
    p *= p + 3.333;
    p *= p;
    return fract(p);
}

mat2 rotate(float rot){
    rot = (rot/360.0) * 2.0 * mPI;
    return mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
}

float square(vec2 uv,vec2 p,float width,float rot){
    uv *= rotate(rot);
    if(abs(uv.x-p.x)<width && abs(uv.y - p.y)<width){
        return 1.0;
    }
    return 0.0;
}


float smtLine(float lineWidth,float f,float lineSaturation){
    float res;
    res = smoothstep(lineWidth,0.0,f);
    res *= smoothstep(0.0,lineWidth,f)*lineSaturation;
    return res;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec3 col;
 
    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv.y += 0.5;
    //vec2 uv = fragCoord.xy/iResolution.xy;
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x = st.x/(mPI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0

// ===================================================================== ripples
    vec2 st1 = st;
    st1.y += .06;
    	//float wave = -(sin(st.y*0.05*iTime) + 1.0)*0.5;


    // parameters ---------------------------------------
    float lineNum = 40.0;
    //float lineGap = 0.03;
    float lineWidth = 0.2;
    float offsetY = 0.1;
    float lineSaturation = 4.0;
    bool  bRipple = true;
    // ---------------------------------------------------

   	float index = floor(st1.y * lineNum);
        
    float f = fract(st1.y * lineNum);
    
    // ripples -----------------------------
    
    if(bRipple){
        float wave = sin(0.02*iTime*index*4.0*mPI);
    	//f += 0.06*clamp(0.2,0.8,wave);
    	//wave = max(0.1,wave);
    	f += 0.05 * wave;
    }    
    //------------------------------------------
	float line = smtLine(lineWidth,f,lineSaturation);
    col = vec3(line);
    
    if(st.y <= offsetY){
        col *= 0.0;
    }

    fragColor = vec4(col,1.0);
}



// ===================================================================== ripples
    // vec2 st1 = st;
    // st1.y += .06;
    // 	//float wave = -(sin(st.y*0.05*iTime) + 1.0)*0.5;
   	// float index = floor(st1.y * lineNum);
    //    	//float wave = sin(0.0008*iTime*index)*sin(index);


    // 	//st1.y += wave;
        
    // 	float f = fract(st1.y * lineNum);
    
    // // ripples -----------------------------
    
    // if(bRipple){
    //     float wave = sin(0.02*iTime*index*4.0*mPI);
    // 	//f += 0.06*clamp(0.2,0.8,wave);
    // 	//wave = max(0.1,wave);
    // 	f += 0.05 * wave;
    // }    
    // //------------------------------------------

    // if(bRandomWave){

    //     // f+= .01;


    // }
	// float line = smtLine(lineWidth,f);
    // col = vec3(line);
    
    // if(st.y <= offsetY){
    //     col *= 0.0;
    // }
    // =====================================================================
