// drawShadowShadow(light){
//     var x = light.x; // get the light position as we will modify it
//     var y = light.y;
//     var r = this.radius * 1.1;
//     var vX = x - this.position.x; // get the vector to the light source
//     var vY = y - this.position.y;
//     // ctx.save();
//     var dist = -Math.sqrt(vX*vX+vY*vY)*0.3;
//     var dir = Math.atan2(vY,vX);

//     var lx = Math.cos(dir) * dist + this.position.x;   // light canb not go past radius
//     var ly = Math.sin(dir) * dist + this.position.y;

//     var grd = ctx.createRadialGradient(lx,ly,r * 1/4 ,lx,ly,r);

//     ctx.beginPath();
//     grd.addColorStop(0,"rgba(0,0,0,1)");
//     grd.addColorStop(1,"rgba(0,0,0,0)");
//     ctx.fillStyle = grd;
//     ctx.fill();
//     ctx.closePath();
// }
