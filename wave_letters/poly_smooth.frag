/* Created by Vinicius Graciano Santos - vgs/2015 
 * This is a tutorial that explains the polynomial smooth minimum.
 *
 * Read my blog post at http://viniciusgraciano.com/blog/smin/ 
 * for a complete description including all the maths!
 * 
 * This function is a polynomial approximation to the min function,
 * and it is widely used by "shadertoyers" to do smooth unions of 
 * distance functions that represent objects in raymarchers.
 * There are some nice, simple, and beautiful mathematical ideas in it!
 *
 * Polynomial smin was introduced by iq in the following article:
 * http://iquilezles.org/www/articles/smin/smin.htm
 */

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

// Polynomial smooth min (commented version)
// @input a: first value
// @input b: second value
// @float k: 'Smoothness value', usually in the range (0,1].
//           Values close to zero makes smin converge to min.
//           Warning: the function is NOT defined at k = 0!
//           Tip: negative values turn the funtion into smooth max!
float sminExplained(float a, float b, float k) {
    
    // Compute the difference between the two values.
    // This is used to interpolate both values inside the range (-k, k).
    // Smaller ranges give a better approximation of the min function.
    float h = a - b;
    
    // The interval [-k, k] is mapped to [0, 1],
    // and clamping takes place only after this transformation.
    
    // Map [-k, k] to [0, 1] and clamp if outside the latter.
    h = clamp(0.5 + 0.5*h/k, 0.0, 1.0);    
    
    // Linearly interpolate the input values using h inside (0, 1).
    // The second term ensures continuous derivatives at the boundaries of [0,1],
    // but this is not completely obvious! See my blog post for details.
    return mix(a, b, h) - k*h*(1.0-h);    
}

float wave1(float x){
    return x;
}
float wave2(float x,float amplitude,float freq){
    float res = 0.0;

    res = amplitude - pow(x*freq,2.0);
    return res;
}
// peak is highest point , narrow is wave wide
float wave3(float x,float peak,float narrow){
    float res = 0.0;
    res = peak - narrow*abs(x*x*x);
    return res;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

 
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv *= 2.0; // -1. ~ 1.
    uv.y += 1.0;

    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x *= 1.5;
    //st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0
    vec2 st1 = st;

    float x = st.x;
    x *= .2;
    x -= fract(iTime*0.1);
    // float x = uv.x;
    float y = 0.0;
    float a1 = -.2*sin(iTime*5.0);
    float f1 = 12.5;
    float y1 = wave2(x,a1,f1);
    float a2 = 0.0;//
    a2 = sin(iTime*10.)*0.1;
    float f2 = 8.0;
    float y2 = wave2(x+0.1,a2,f2);
    y = smax(y,y1,0.9);
    y = smax(y,y2,0.8);
    // y = smax(y,wave1(x*0.01),-0.9);
    float peak3 = 0.2;
    float narrow3 = 1.0;//*sin(iTime*10.);
    float y3 = wave3(x+0.2,peak3,narrow3);

    y = smax(y,y3,0.8);
    y = smax(y,0.2,0.9);

    vec3 col;
    if(st.y < y){
    	col += 1.0;
    }
    
    

	fragColor = vec4(col,1.0);
}