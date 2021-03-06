// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Value Noise (http://en.wikipedia.org/wiki/Value_noise), not to be confused with Perlin's
// Noise, is probably the simplest way to generate noise (a random smooth signal with 
// mostly all its energy in the low frequencies) suitable for procedural texturing/shading,
// modeling and animation.
//
// It produces lowe quality noise than Gradient Noise (https://www.shadertoy.com/view/XdXGW8)
// but it is slightly faster to compute. When used in a fractal construction, the blockyness
// of Value Noise gets qcuikly hidden, making it a very popular alternative to Gradient Noise.
//
// The princpiple is to create a virtual grid/latice all over the plane, and assign one
// random value to every vertex in the grid. When querying/requesting a noise value at
// an arbitrary point in the plane, the grid cell in which the query is performed is
// determined (line 30), the four vertices of the grid are determined and their random
// value fetched (lines 35 to 38) and then bilinearly interpolated (lines 35 to 38 again)
// with a smooth interpolant (line 31 and 33).


// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH
// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH
// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH
// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH
// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH
// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS
// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8
// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl
// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH

precision mediump float;
const float PI = 3.1415926535;

// Polynomial smooth min (for copying and pasting into your shaders)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float smax(float a,float b,float k){
    return smin(a,b,-k);
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

// -----------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    vec2 p = fragCoord.xy / iResolution.xy;
    
    vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);
    vec2 uv1 = uv;
    
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0
    // origin on -y axis
    
    vec3 col;
    float number = 100.;
    float noise = noise(vec2(uv.y*62.3,uv.x*54.));
    noise = pow(noise,2.);
    // noise = smax(noise,.9,0.1);
    noise = smin(noise,0.9,0.9);
    noise = smax(noise,0.1,0.9);
    // uv1.y += sin(noise)*0.1;
    float uvy = fract(uv1.y * number);
    
    
    float r = noise;
    col += 1. - smoothstep(0.0,0.13,abs(uvy - r));
    
	fragColor = vec4( col, 1.0 );
}


    // vec2 p = fragCoord.xy / iResolution.xy;

	// vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);
    // uv.y -= .1;


    // vec3 col;
    // float noise = noise(vec2(uv.y*1.,uv.x*1.1));
    // noise = pow(noise,2.);
    // float r = noise * 1.;


    // float number = 20.;

    // // for(float i=0.0;i<number;i++){
    // //     col += 1. - smoothstep(0.0,0.003,abs(uv.y +  i/30. - r));    


    // // }
	// vec2 uv1 = uv;
    // uv1.y = fract(uv1.y * number);

    // // col += 1. - smoothstep(0.0,0.003,abs(uv.y - r * uv1.y));
    // col += 1. - smoothstep(0.0,0.003,abs(uv.y - r));