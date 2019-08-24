const float pi = 3.1415926545;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    uv.x *= iResolution.x/iResolution.y;

    // Time varying pixel color
    vec3 col;
    vec2 points[3];
    vec2 leftDown = vec2(0.5,0.5);
    points[0] =leftDown + vec2(0.0,0.0);
    points[1] =leftDown + vec2(0.5,0.0);
    points[2] =leftDown + vec2(0.5*0.5,0.5*sqrt(3.0)*0.5);

    for(int i = 0;i<3;i++){
        if(distance(uv,points[i])<0.02){
            col = vec3(1.0);
        }

        
    
        int index1 = i>2?i-1:i;
        int index2 = i>2?i-2:i;
        if(
            abs(distance(uv,points[index1]) - distance(uv,points[index2])) < 0.01 && 
            distance(uv,points[i])<= 0.5 * 0.5 / cos(pi/12.)
            ){
            col = vec3(1.0);

        }

    }
    // Output to screen
    fragColor = vec4(col,1.0);
}