mat2 myrotate(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(
        vec2(c, -s),
        vec2(s, c)
    );
}


void mainImage( out vec4 c, vec2 p ) {
    
    // set position
    vec2 v = iResolution.xy;
    p = (p-v*.5) / v.y; // -0.5 to 0.5
    float r = length(p);
    float rotateDirection;
    rotateDirection = sign(sin(r*1000.));

    // p *= myrotate(iTime*rotateDirection);

    // breathing effect
    //p += p * sin(dot(p, p)*20.-iTime) * .04;
    
    // accumulate color
    c *= 0.;
    for (float i = .5 ; i < 8. ; i++){
        
        // fractal formula and rotation
        p = 
            //abs(2.*fract(p/r*0.5-.5)-1.) * // deep and deep into details
            abs(2.*fract(p-.5)-1.) * // deep and deep into details
            mat2(
                cos(
                	.05*(iTime * 2.7 + iMouse.x*.1)*i + 
                    //.785*vec4(1,7,3,1) // 3.14 / 4 = 0.785, so 1,7,3,1 -> (c,-s,s,c)
                    2.*.785*vec4(1,4,2,1) // 3.14 / 4 = 0.785, so 1,7,3,1 -> (c,-s,s,c)
                    // if change rotate angle, vec4 value should change at same time with 2pi/rotate degree 
                	)
                ),
        
        // coloration
        c += exp(-abs(p.y)*5.) * (cos(vec4(2,3,2,2)*i)*.5+.5) * .5;
        c += exp(-abs(p.x)*5.) * (cos(vec4(20,30,10,10)*i)*.5+.5) * .5;
       
    }

    // c.b += sin(r*iTime*1000.);
    
    // palette
    c.rg *= 0.5;

    // check range
    // c = vec4(vec3(p.y),1.0);

    // check fract
    // float col;
    // for (float i = .5 ; i < 8. ; i++){

    //     p = abs(2.*fract(p-6.5)-1.)//   triangle
    //         *
    //     	mat2(
    //             cos(
    //             	.05*(iTime * 2.7 + iMouse.x*.1)*i*i + .78*vec4(1,7,3,1)
    //             	)
    //             );
    //     col += p.x;


    // }

    // c = vec4(vec3(col),1.);
}