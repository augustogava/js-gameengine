function cParticle(){
	this.position = new Vector(222, 444);
	this.direction = new Vector(2, 0);
	this.size = 10;
	this.sizeSmall = 0;
	this.timeToLive = 2333;
	this.colour = [];
	this.drawColour = "";
	this.deltaColour = [];
	this.sharpness = 0;
}

var Effects = function(data) {
	this.init(data);
};

Effects.prototype = {
	maxParticles: 300,
	particles:[],
	idUnique: (Math.random()*Math.random()),
	defaults:["250,144,35,1," +
	          "32,31,25,0," +
	          "240,0,0,0," +
	          "20,20,7.5,0," +
	          "0,0," + //speed
	          "0,360," + //angle
	          "-0.01, -0.01," + //gravity
	          "3,2," +
	          "0,10," + //sharopness
	          "1,0," +
	          "200," +
	          "8,10,"+
			  "-1",
	          
	          "2,2,2,1," +
	          "0,0,0,0," +
	          "100,100,100,0," +
	          "0,0,0,0," +
	          "0,0," + //speed
	          "0,360," + //angle
	          "-0.02, -0.01," + //gravity
	          "1,10," +
	          "33,10," + //sharopness
	          "2,0," +
	          "200," +
	          "8,10,"+
			  "-1",
	          
			  //Hit
	          "255 , 190, 8, 0.5," +
	          "0,100,0,0," +
	          "255,255,0,0," +
	          "0,0,0,0," +
	          "0,2," + //speed
	          "0,360," + //angle
	          "-0.004, -0.015," + //gravity
	          "0,0," +
	          "20,20," + //sharopness
	          "1,1," +
	          "200," +
	          "6,0," +
		  "0.1",
			  
			  //Fumacao Branca
			  "250,250,250,0.2," +
	          "0,0,0,0," +
	          "250,250,250,0," +
	          "0,0,0,0," +
	          "0,0," + //speed
	          "0,0," + //angle
	          "-0.004, -0.015," + //gravity
	          "1,2," +
	          "0,10," + //sharopness
	          "2,0," +
	          "100," +
	          "10,22," +
			  "0.15",
			  
			  //sangue 4
	          "255 , 0, 0, 0.7," +
	          "0,100,0,0," +
	          "255,0,0,0," +
	          "0,0,0,0," +
	          "0,2," + //speed
	          "0,360," + //angle
	          "-0.004, -0.015," + //gravity
	          "0,0," +
	          "20,20," + //sharopness
	          "1,1," +
	          "100," +
	          "6,0," +
			  "0.08",
			  
			  //explosao 5
			  "250,144,35,0.5," +
	          "32,31,25,0," +
	          "240,0,0,0," +
	          "20,20,7.5,0," +
	          "1,0," + //speed
	          "260,40," + //angle
	          "-0.001, -0.001," + //gravity
	          "5,5," +
	          "0,10," + //sharopness
	          "1,0," +
	          "200," +
	          "42,5,"+
			  "0.2",
			  
			  //Smokeexplosao 6
			  "2,2,2, 0.24," +
	          "0,0,0,0," +
	          "100,100,100,0," +
	          "0,0,0,0," +
	          "0,0," + //speed
	          "0,360," + //angle
	          "-0.002, -0.001," + //gravity
	          "17,17," +
	          "0,10," + //sharopness
	          "2,0," +
	          "200," +
	          "20,0,"+
			  "1",
			  
			  //explosaoTiro 7
			   "250,144,35,0.5," +
	          "32,31,25,0," +
	          "240,0,0,0," +
	          "20,20,7.5,0," +
	          "0,0," + //speed
	          "0,360," + //angle
	          "-0.01, -0.01," + //gravity
	          "5,5," +
	          "0,10," + //sharopness
	          "1,0," +
	          "100," +
	          "10,2,"+
			  "0.1",
			  
			  //explosaoTiroMaior 8
			   "250,144,35,0.5," +
	          "32,31,25,0," +
	          "240,0,0,0," +
	          "20,20,7.5,0," +
	          "0,0," + //speed
	          "0,360," + //angle
	          "-0.01, -0.01," + //gravity
	          "5,5," +
	          "0,10," + //sharopness
	          "1,0," +
	          "200," +
	          "18,3,"+
			  "0.2",
			  
			  //explosaoTiroMaior 9
			   "250,144,35,0.5," +
	          "32,31,25,0," +
	          "240,0,0,0," +
	          "20,20,7.5,0," +
	          "2,0," + //speed
	          "0,0," + //angle
	          "+0.002, -0.0002," + //gravity
	          "0,0," +
	          "0,0," + //sharopness
	          "1,0," +
	          "100," +
	          "42,0,"+
			  "0.3",

			  //Fumacao preta 10
			  "0,0,0,0.1," +
	          "10,10,10,0," +
	          "50,50,50,0," +
	          "0,0,0,0," +
	          "1,0," + //speed
	          "0,0," + //angle
	          "-0.002, -0.006," + //gravity
	          "1,2," +
	          "0,10," + //sharopness
	          "22,0," +
	          "100," +
	          "10,22," +
			  "0.1",
			  
			   //Tiro Gelo 11
			  "180,180,255,0.5," +
	          "5,5,25,0," +
	          "184,205,248,0," +
	          "5,5,35,0," +
	          "2,0," + //speed
	          "0,0," + //angle
	          "+0.002, -0.0002," + //gravity
	          "0,0," +
	          "0,0," + //sharopness
	          "1,0," +
	          "50," +
	          "42,0,"+
			  "0.3"
			  
	          ],
	active:true,
	
	colisao: "",
	type: "efx",
	
	// Properties
	position: new Vector(500, 500),
	positionRandom: new Vector(22, 22),
	size:65,
	sizeRandom:10,
	speed:4,
	speedRandom:1.5,
	lifeSpan:9,
	lifeSpanRandom:7,
	angle:0,
	angleRandom:360,
	gravity: new Vector(0, 0),
	startColour:[ 250, 0, 0, 1 ],
	startColourRandom:[ 62, 60, 60, 0 ],
	finishColour:[ 245, 200, 0, 0 ],  
	finishColourRandom:[ 60, 60, 60, 0 ],
	sharpness:40,
	sharpnessRandom:10,
	
	particleCount:0,
	elapsedTime:0,
	duration:-1,
	emissionRate:0,
	emitCounter:0,
	particleIndex:0,

	init: function(){
		this.idUnique = Math.random()*Math.random();
		this.emissionRate = this.maxParticles / this.lifeSpan;
		this.emitCounter = 0;
		this.position = new Vector(0, 0);
		this.particles = [];
	},
	
	setDefault: function( index ){
		var dados = this.defaults[index].split( "," );
		this.startColour = [];
		this.startColour[0] = parseFloat( dados[0] );
		this.startColour[1] = parseFloat(dados[1]);
		this.startColour[2] = parseFloat(dados[2]);
		this.startColour[3] = parseFloat(dados[3]);
		
		this.startColourRandom = [];
		this.startColourRandom[0] = parseFloat(dados[4]);
		this.startColourRandom[1] = parseFloat(dados[5]);
		this.startColourRandom[2] = parseFloat(dados[6]);
		this.startColourRandom[3] = parseFloat(dados[7]);
		
		this.finishColour = [];
		this.finishColour[0] = parseFloat(dados[8]);
		this.finishColour[1] = parseFloat(dados[9]);
		this.finishColour[2] = parseFloat(dados[10]);
		this.finishColour[3] = parseFloat(dados[11]);

		this.finishColourRandom = [];
		this.finishColourRandom[0] = parseFloat(dados[12]);
		this.finishColourRandom[1] = parseFloat(dados[13]);
		this.finishColourRandom[2] = parseFloat(dados[14]);
		this.finishColourRandom[3] = parseFloat(dados[15]);

		this.speed = parseFloat(dados[16]);
		this.speedRandom = parseFloat(dados[17]);
		
		this.angle = parseFloat(dados[18]);
		this.angleRandom = parseFloat(dados[19]);
		
		this.gravity = new Vector(parseFloat(dados[20]), parseFloat(dados[21]) );
		
		this.positionRandom = new Vector( parseFloat(dados[22]), parseFloat(dados[23]) );
		
		this.sharpness = parseFloat(dados[24]);
		this.sharpnessRandom = parseFloat(dados[25]);
		
		this.lifeSpan = parseFloat(dados[26]);
		this.lifeSpanRandom = parseFloat(dados[27]);
		
		this.maxParticles = parseFloat(dados[28]);
		this.size = parseFloat(dados[29]);
		this.sizeRandom = parseFloat(dados[30]);
		
		this.duration =  parseFloat(dados[31]);
		
	},
	
	addParticle: function(){
		if(this.particleCount == this.maxParticles) {
			return false;
		}
//		console.info( this )
		// Take the next particle out of the particle pool we have created and initialize it	
		var particle = new cParticle();
		this.initParticle( particle );
		this.particles[ this.particleCount ] = particle;
		// Increment the particle count
		this.particleCount++;
		
		return true;
	},
	
	initParticle: function( particle ){5
		var RANDM1TO1 = function(){ return Math.random() * 2 - 1; };
		
		particle.position.x = this.position.x + this.positionRandom.x 
		particle.position.y = this.position.y + this.positionRandom.y 
	
		var newAngle = (this.angle + this.angleRandom * RANDM1TO1() ) * ( Math.PI / 180 ); // convert to radians
		var vector = new Vector( Math.cos( newAngle ), Math.sin( newAngle ) ); // Could move to lookup for speed
		var vectorSpeed = this.speed + this.speedRandom * RANDM1TO1();
		particle.direction.multiplyBy( vectorSpeed );
	
		particle.size = this.size + this.sizeRandom * RANDM1TO1();
		particle.size = particle.size < 0 ? 0 : ~~particle.size;
		particle.timeToLive = this.lifeSpan + this.lifeSpanRandom * RANDM1TO1();
		
		particle.sharpness = this.sharpness + this.sharpnessRandom * RANDM1TO1();
		particle.sharpness = particle.sharpness > 100 ? 100 : particle.sharpness < 0 ? 0 : particle.sharpness;
		// internal circle gradient size - affects the sharpness of the radial gradient
		particle.sizeSmall = ~~( ( particle.size / 200 ) * particle.sharpness ); //(size/2/100)
	
		var start = [
			this.startColour[ 0 ] + this.startColourRandom[ 0 ] * RANDM1TO1(),
			this.startColour[ 1 ] + this.startColourRandom[ 1 ] * RANDM1TO1(),
			this.startColour[ 2 ] + this.startColourRandom[ 2 ] * RANDM1TO1(),
			this.startColour[ 3 ] + this.startColourRandom[ 3 ] * RANDM1TO1()
		];
	
		var end = [
			this.finishColour[ 0 ] + this.finishColourRandom[ 0 ] * RANDM1TO1(),
			this.finishColour[ 1 ] + this.finishColourRandom[ 1 ] * RANDM1TO1(),
			this.finishColour[ 2 ] + this.finishColourRandom[ 2 ] * RANDM1TO1(),
			this.finishColour[ 3 ] + this.finishColourRandom[ 3 ] * RANDM1TO1()
		];
	
	    particle.colour = start;
		particle.deltaColour[ 0 ] = ( end[ 0 ] - start[ 0 ] ) / particle.timeToLive;
		particle.deltaColour[ 1 ] = ( end[ 1 ] - start[ 1 ] ) / particle.timeToLive;
		particle.deltaColour[ 2 ] = ( end[ 2 ] - start[ 2 ] ) / particle.timeToLive;
		particle.deltaColour[ 3 ] = ( end[ 3 ] - start[ 3 ] ) / particle.timeToLive;
	},
	
	update: function( delta ){
		if( !delta ){
			delta = 0;
		}
		if( this.active && this.emissionRate > 0 ){
			var rate = 1 / this.emissionRate;
			this.emitCounter += delta;
			while( this.particleCount < this.maxParticles && this.emitCounter > rate ){
				this.addParticle();
				this.emitCounter -= rate;
			}
			this.elapsedTime += delta;
			if( this.duration != -1 && this.duration < this.elapsedTime ){
				this.stopParticleEmitter();
			}
		}
	
		this.particleIndex = 0;
		while( this.particleIndex < this.particleCount ) {
	
			var currentParticle = this.particles[ this.particleIndex ];
	
			// If the current particle is alive then update it
			if( currentParticle.timeToLive > 0 ){
	
				// Calculate the new direction based on gravity
				currentParticle.direction.addTo( this.gravity );
				currentParticle.position = new Vector( currentParticle.position, currentParticle.direction );
//				currentParticle.position = new Vector( currentParticle.position, new Vector(0, 0)-5,-5) );
				currentParticle.timeToLive -= delta;
	
				// Update colours based on delta
				var r = currentParticle.colour[ 0 ] += ( currentParticle.deltaColour[ 0 ] * delta );
				var g = currentParticle.colour[ 1 ] += ( currentParticle.deltaColour[ 1 ] * delta );
				var b = currentParticle.colour[ 2 ] += ( currentParticle.deltaColour[ 2 ] * delta );
				var a = currentParticle.colour[ 3 ] += ( currentParticle.deltaColour[ 3 ] * delta );
				
				// Calculate the rgba string to draw.
				var draw = [];
				draw.push("rgba(" + ( r > 255 ? 255 : r < 0 ? 0 : ~~r ) );
				draw.push( g > 255 ? 255 : g < 0 ? 0 : ~~g );
				draw.push( b > 255 ? 255 : b < 0 ? 0 : ~~b );
				draw.push( (a > 1 ? 1 : a < 0 ? 0 : a.toFixed( 2 ) ) + ")");
				currentParticle.drawColour = draw.join( "," );
				
				this.particleIndex++;
			} else {
				// Replace particle with the last active 
				if( this.particleIndex != this.particleCount - 1 ){
					this.particles[ this.particleIndex ] = this.particles[ this.particleCount-1 ];
				}
				this.particleCount--;
			}
		}
	},
	
	stopParticleEmitter: function(){
		this.active = false;
		this.elapsedTime = 0;
		this.emitCounter = 0;
	},
	
	removeF: function(){
		enti.removeObjetct( this.idUnique );
	},
	
	draw: function( ){
	
		for( var i = 0, j = this.particleCount; i < j; i++ ){
			var particle = this.particles[ i ];
			var size = particle.size;
			var halfSize = size >> 1;5
			var x = particle.position.x;
			var y = particle.position.y;

			// ctx.strokeStyle = "red";
			// ctx.strokeStyle = '#1AA7EC';
			// ctx.lineWidth = "2";

			// ctx.save();
			// ctx.beginPath();
			// ctx.strokeStyle = "red";
			// ctx.strokeStyle = '#1AA7EC';
			// ctx.lineWidth = "2";
			// ctx.arc(x, y, 53, 30, 2 * Math.PI);
			// ctx.strokeStyle = "red";
			// ctx.strokeStyle = '#1AA7EC';
			// ctx.lineWidth = "2";
			// ctx.fill();
			// ctx.strokeStyle = "red";
			// ctx.strokeStyle = '#1AA7EC';
			// ctx.lineWidth = "2";
			// ctx.strokeStyle = "red";
			// ctx.stroke();
			// ctx.strokeStyle = "red";
			// ctx.strokeStyle = '#1AA7EC';
			// ctx.lineWidth = "2";
			// ctx.closePath();
			// ctx.restore();
			// var radgrad = ctx.createRadialGradient(3, 2, particle.sizeSmall, x + halfSize, y + halfSize, halfSize);
			// radgrad.addColorStop( 0, particle.drawColour );   
			// radgrad.addColorStop( 1, 'rgba(0,0,0,0)' ); //Super cool if you change these values (and add more colour stops)
			ctx.fillStyle = 'red';
		  	ctx.fillRect( x, y, size, size );
		}
	}

};
