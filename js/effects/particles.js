function Particles(){
	this.friction = .97;
	this.aceleration = 1;
	this.MaxaAceleration = 5;
	this.acelerationR = 4;
	
	this.particles =  [];
	this.forces =  [];
}

Particles.prototype.addForce = function( angulo, forca ) {
	var f = {
				r: angulo,
				forca: forca ,

				update: function ( game ){

					var ad = +this.vx;
					var ady = -this.vy;
					
					this.x += ad  ;
					this.y += ady ;
					
					this.r += .01;
					
					this.rSize += 0.02;
					
					if( this.alpha > 0.02)
						this.alpha -= 0.002;
					else
						this.alpha = 0


				},
				draw: function( game, canvas ){
					
				}
			};
			
		this.forces.push( f );
}


Particles.prototype.addSmoke = function( vx, vy) {
	
	for( var e=0; e<2; e++){
		var newPart = {
				x: vx ,
				y: vy ,
				vx: ( Math.random()/ 2),
				vy: 1 + ( Math.random() * 3 ),
				rSize: 0.4,
				alpha: 0.2,
				r: ( Math.random() * 10 ),
				img: new Image(),
				url: "images/smoke2.png?a=3", 
				update: function ( parti ){
					var fx = 0, fy = 0;
					
					if( parti.forces.length > 0){
						for( var k=0; k<parti.forces.length; k++){
							var f = parti.forces[k];
							fx += f.forca *  Math.sin( mathI.convertToRadians( f.r ) );
							fy += f.forca *  Math.cos( mathI.convertToRadians( f.r ) ) * -1;
						}
					}
				
					var ad = +this.vx + fx;
					var ady = -this.vy + fy;	
				
					this.x += ad  ;
					this.y += ady ;
					
					this.r += .01;
					
					this.rSize += 0.02;
					
					if( this.alpha > 0.02)
						this.alpha -= 0.002;
					else
						this.alpha = 0


				},
				draw: function( parti, canvas ){
					
					var context = canvas.getContext("2d");
					
					var xO = ( this.img.width  * this.rSize ) / 2;
					var yO = ( this.img.height * this.rSize ) / 2;

					context.save(); 
					context.translate( this.x + viewPoint.viewPointx ,this.y  + viewPoint.viewPointy );
					context.rotate( mathI.convertToRadians( this.r ));

					context.globalAlpha = this.alpha;
					
					context.drawImage( this.img, -xO, -yO, ( this.img.width * this.rSize ), ( this.img.height * this.rSize) );
					context.restore();
				}
			};
			
		newPart.img.src = newPart.url;
		this.particles.push( newPart );
	}
	
}

Particles.prototype.colisaoCanvas = function( particle ) {
	
	if( particle.y < 0 || particle.alpha == 0){
		if( this.particles.length > 0)
			this.particles.remove( 0 );	
	}					
}

Particles.prototype.update = function() {
	
	for(var i=0; i< this.particles.length; i++){
		this.particles[i].update( this );
		this.colisaoCanvas( this.particles[i] );
	}

};

Particles.prototype.render = function( canvas ) {
	
	var context = canvas.getContext("2d");
	//context.clearRect(0, 0, canvas.width, canvas.height);
	
	for(var i=0; i < this.particles.length; i++){
		if(  this.particles[i] != "undefined" ){		
			this.particles[i].draw( this, canvas );
		}
	}

};