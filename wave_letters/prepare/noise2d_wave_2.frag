precision mediump float;
const float PI = 3.1415926535;


float wave(float freq, float amp, float x, float phase) {
    return amp * sin(freq * x + phase);
}

float rand(float x) {
    return fract(sin(x)*43758.5453123);
}

float randWaves(float seed, float x, float t) {
    float p = 0.;
    for(int i = 0; i < 20; ++i) {
        float amp = rand(seed * float(i) * .473);
        float freq = rand(amp*8736.);
        p += wave(freq * 50., amp * .02, x, pow(freq, .1) * t + rand(seed));
    }
    return p;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime;
    float p = 0.1 + randWaves(.5, uv.x, t);
    // p *= 0.1;
    p = wave(5.,.1,uv.x,0.0);
    // p *= 2.;

    vec2 uv1 = (fragCoord - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    // uv1.y += 0.5; // move before set unit axis
    uv1.y *= iResolution.y/iResolution.x; // x axis is unit 1 
    // uv.x *= iResolution.x/iResolution.y; // y axis is unit 1 




    //vec2 uv = fragCoord.xy/iResolution.xy;
    vec2 st = vec2(atan(uv1.x,uv1.y),length(uv1));
    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0 
    // origin on -y axis 
    // st.x *= 2.; // 0.~2.
    // st.x -= 0.5; // +y is 0.~ 1., uncomment uv.y += 0.5 to see details




    vec3 col;
    if(st.y < p)
        col += 1.0;
    // Output to screen
    fragColor = vec4(col,1.0);
}