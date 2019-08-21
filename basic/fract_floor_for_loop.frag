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



    vec3 col;// black write by vec3(float)
    // basic settings ==================================
    vec2 uv1 = uv;
    float n = 20.;
    float m = 17.0;
    vec2 st1 = st;
    st1.x *= 2.0;// a circle is 0.0 ~ 2.0 , +Y is 0.5 ~ 1.5
    st1.x -= 0.5;// +y is 0. ~ 1.




    // by floor or ceil -----------------------------------------------
    // if(st1.y < 1.5 * 1./n * ceil(st1.x*n)){
    //     col += 0.5;
    // }

    float lineWidith = 0.003;
    float r = 1./n * floor(st1.x*n);
    float index = ceil(st1.y*m);
    r += 0.1 * index;
    r *= .4;
    float line = 1.0 - smoothstep(0.0,lineWidith,abs(st.y - r));
    col += line;



    // by array ------------------------------------------------------
    // float numbers[10] = float[](0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9);   
    // if(uv.y < numbers[int(ceil(uv1.x*n))]){
    //     col += 0.5;
    // }

    // by  loop -----------------------------
    // for(float i = 0.; i < 10.; i++){
    //     col += i * 0.01;
    // }

    // array out of range error --------------------------
    // col = vec3(numbers[10]);


    // col = vec3(uv.x,uv.y,0.0);
    // Output to screen

    // mark origin
    if(abs(uv.x) < 0.01 && abs(uv.y) < 0.01){
        col += vec3(.3,0.0,0.0);
    }


    fragColor = vec4(col,1.0);
}

