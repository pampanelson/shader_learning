// Fork of "fire fast" by mawo78. https://shadertoy.com/view/4dlGR2
// 2019-07-03 13:48:37

// by @301z
// noise 3D by by inigo quilez

float noise( in vec2 xx )
{
	vec3 x = vec3(xx,0.0);
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture( iChannel0, (uv+0.5)/256.0, -100.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord.xy / iResolution.xy;

        // the sound texture is 512x2
    int tx = int(uv.x*512.0);
    
    int splitHighLow = 150;
    

    
	// first row is frequency data (48Khz/4 in 512 texels, meaning 23 Hz per texel)
	float fft1 = 0.; 
	float fft2  = 0.; 

    // second row is the sound wave, one texel is one mono sample
    //float wave = texelFetch( iChannel1, ivec2(tx,1), 0).x;
    
    for(int i = 0;i < 512;i++){
        float f = texelFetch( iChannel1, ivec2(i,0), 0 ).x;
        if(i <= splitHighLow){
            fft1 += f;
        }else{
            fft2 += f;

        };
    };
    
    
    
    
	vec3 c1 = vec3(0.1, 0.0, 0.0);
	vec3 c2 = vec3(0.7, 0.0, 0.0);
	vec3 c3 = vec3(0.2, 0.0, 0.0);
	vec3 c4 = vec3(.9, 0.4,0.1);
	vec3 c5 = vec3(0.1);
	vec3 c6 = vec3(0.9);
	vec2 p = fragCoord.xy * 8.0 / iResolution.xx;
    
	float q = fbm(p - iTime * .5);
	vec2 r = vec2(fbm(p + q + iTime * .7 - p.x - p.y), fbm(p + q - iTime *.4));
	vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
    vec3 col = c * -cos(1.57 * fragCoord.y / iResolution.y);
    col.g = 0.;
    p.x = -p.x;
	q = fbm(p - iTime * .5);
	r = vec2(fbm(p + q + iTime * .7 - p.x - p.y), fbm(p + q - iTime * .4));
	c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
    vec3 col1 = c * -cos(1.57 * fragCoord.y / iResolution.y);
	col1.rb = col1.br;
    col1.g = .0;
	//col1.r += .1;
    //col.b += .1;
    col1.r += fft2*0.008;
    col.b += fft1*0.006;
    fragColor = vec4(col1+col,1.0);
    //fragColor = vec4(col,1.0);
    //col1.r += fft1*.3;
    //col.b += fft2*.3;
	//fragColor = vec4(col1+col,1.0);
   

}
