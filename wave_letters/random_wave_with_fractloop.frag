precision mediump float;
const float PI = 3.1415926535;

float DistLine(vec3 ro,vec3 rd,vec3 p){
    return length(cross(p-ro,rd))/length(rd);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0.5 to 0.5)
    // vec2 uv = fragCoord/iResolution.xy;
    // uv -= .5;
    // uv.x *= iResolution.x/iResolution.y;


    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv.y += 0.5; // move before set unit axis
    uv.y *= iResolution.y/iResolution.x; // x axis is unit 1 
    // uv.x *= iResolution.x/iResolution.y; // y axis is unit 1 




    //vec2 uv = fragCoord.xy/iResolution.xy;
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    st.x = st.x/(PI*2.0) + .5; // before st.x is -π ~ π after is  normalized 0.0 ~ 1.0 
    // origin on -y axis 
    st.x *= 2.; // 0.~2.
    st.x -= 0.5; // +y is 0.~ 1., uncomment uv.y += 0.5 to see details




    vec3 col;// black write by vec3(float)

    // set a base for use noise of sin
    float r = sin(st.x*PI);
    // r += 0.8 * pow(abs(0.5 - st.x),2.);
    r *= 0.5;

    float n = 5.;
    float index = floor(st.y * n);
    r += 0.1*index;
    if(st.y < r){
        col += 0.2;
    }


    // col += vec3(sin(st.x*PI));

    // col = vec3(uv.x,uv.y,0.0);
    // Output to screen

    // mark origin
    if(abs(uv.x) < 0.01 && abs(uv.y) < 0.01){
        col += vec3(.3,0.0,0.0);
    }


    fragColor = vec4(col,1.0);
}

