const bodyType = new HashTable();
bodyType.set('static', 'static');
bodyType.set('dynamic', 'dynamic');
bodyType.set('kinematic', 'kinematic');

class RigidBody {
    constructor(instance, bodyTypeP,  mass, position, degrees, speed, direction) {
        this.id = Utils.randomIntFromInterval(1, 5000);

        this.bodyType = bodyType.get(bodyTypeP);
        this.fixedRotation = false;

        this.color = "rgba(250,128,114, 1)";
        this.colorProjection = Utils.changeRedSoftness(this.color, 200);
        this.colorShadow = Utils.changeRedSoftness(this.color, 0);

        this.mass = mass;
        this.density = 1;

        this.angle = (degrees)  ? ( degrees * (Math.PI / 180) ) : 0;
        this.angularVelocity = 0;
        this.position = position;
        this.positionOld = position;
        this.positionFixed = position;
        this.positionOldFixed = position;

        this.acceleration = new Vector(0, 0);
        
        this.velocity = new Vector(0, 0);
        if( speed )
		    this.velocity.setLength(speed);

        if( direction )
		    this.velocity.setAngle(direction);

        this.velocityFixed = this.velocity;


        this.statePhysics = true;

        if( mass ){
            this.physics = new Physics(mass);
            this.physics.addForce(this.physics.gravity.multiplyBy(this.mass));
        }

        this.SHADOW_HISTORY = 20;
        this.historyShadow = [];
        this.currentTime = Date.now();

        // this.debugObj = new Debug(this);
    }

    debug(){            
                  
    }

    collidesWith(otherShape) {
        return false;
    }

    changePhysicsState(v) {
        if (v == undefined)
            this.statePhysics = true;

        this.statePhysics = !this.statePhysics;;
    }

    updateDegrees(d) {
        this.angle = (d)  ? ( d * (Math.PI / 180) ) : this.angle;
    }

    updatePosition(v) {
        this.position = v;
    }

    commonsUpdate(obj){
        obj.updateToReadbleNumber();
        if (Globals.isAttraction()) {
            obj.attract();
        }

        if (!Globals.isDebug()) {
            return ;
        }

        // var timeDifference = Date.now() - obj.currentTime ;
        // if ( (timeDifference > ( .01 * 1000)) ) {
        //     obj.historyShadow.push({ x: obj.position.x, y: obj.position.y, angle: obj.angle, width: obj.width, height: obj.height });
        //     obj.currentTime = Date.now();
        // }
        
        // if (obj.historyShadow.length > this.SHADOW_HISTORY) {
        //     obj.historyShadow.shift();
        // }
    }

    updateToReadbleNumber(){
        if( this.position )
            this.positionFixed = new Vector( this.position.x.toFixed(1), this.position.y.toFixed(1) );      

        if( this.positionOld )
            this.positionOldFixed = new Vector( this.positionOld.x.toFixed(1), this.positionOld.y.toFixed(1) );      

        if( this.velocity )
            this.velocityFixed = new Vector( this.velocity.x.toFixed(1), this.velocity.y.toFixed(1) ); 
    }

    clone() {
        // return new Vector(this.x, this.y);
    }

    // forces = [];

    applyForce(f){
        if( !f ){
            return ;
        }
        
        this.velocity.addTo(f);
    }

}