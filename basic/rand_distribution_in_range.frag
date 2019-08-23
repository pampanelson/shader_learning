precision mediump float;
const float PI = 3.1415926535;
const float aPI = acos(-1.0);

float rand(float x) {
    return fract(sin(x*14421.89801)*43758.5453123);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    vec3 col;
    vec2 uv = (fragCoord.xy - .5 * iResolution.xy)/iResolution.y; // uv -.5 ~ .5
    uv *= 2.0; // -1. ~ 1.
    uv.y += 1.0;
    uv.y *= 0.5;// 0 ~ 1
    // uv.y += 1.0;

    // uv.y *= 2.;// 0~2
    float a = 0.2;
    float b = 0.8;
    // uv.y += 0.2;
    float n = 4.;
    float l = b-a;
    float stp = l/n;
    
    float y;

    if(uv.x < 0.){

        y = fract(uv.y*n);
        col += vec3(y,0.0,0.0);
    }
    else{
        if(uv.y <= b && uv.y >= a){
            // for(float i = .0; i < n ; i++){
            //     y = a + stp*i;
            //     if(uv.y < y){
            //         col += vec3(0.0,1./n,0.0);
            //     }

            // }

            // see the commants for details  ************* IMPORTANT ***************
            // firt move uv.y to 0.
            uv.y -= a;

            // change uv.y scale by sagment and total length
            float index = floor(uv.y * n/l);
            // index = 0. , 1. ,2. ... according to uv.y
            float f = index * stp;
            float seed = iTime;
            float rand = rand(seed) * stp;
            f += rand;
            float line = 1. - smoothstep(0.0,0.001 ,abs(uv.y - f) );

            line *= 10.;
            // col += line;
            col += line;

        }
        else{
            col += 1.0;
        }
    }


    // float fl = floor(uv.y * n);


    //     col += fl*0.1;

    // float t = mod(iTime,10.);
    // if(abs(uv.y-fl*stp - rand(iTime)*stp)<0.0001){
    // }

    
	fragColor = vec4(col,1.0);
}