precision mediump float;
const float PI = 3.1415926535;

float DistLine(vec3 ro,vec3 rd,vec3 p){
    return length(cross(p-ro,rd))/length(rd);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0.5 to 0.5)
    vec2 uv = fragCoord/iResolution.xy;
    // uv -= .5;
    uv.x *= iResolution.x/iResolution.y;

    vec3 col;// black write by vec3(float)
    // basic settings ==================================
    vec2 uv1 = uv;
    float n = 10.;

    // by floor or ceil -----------------------------------------------
    // if(uv.y < 1./n * ceil(uv1.x*n)){
    //     col += 0.5;
    // }

    // by array ------------------------------------------------------
    float numbers[10] = float[](0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9);   
    if(uv.y < numbers[int(ceil(uv1.x*n))]){
        col += 0.5;
    }

    // by  loop -----------------------------
    for(float i = 0.; i < 10.; i++){
        col += i * 0.01;
    }

    // array out of range error --------------------------
    // col = vec3(numbers[10]);


    // col = vec3(uv.x,uv.y,0.0);
    // Output to screen
    fragColor = vec4(col,1.0);
}

