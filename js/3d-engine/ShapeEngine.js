class ShapeEngine {
    constructor(canvas, objUrl, pos, basePos) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.position = pos;
        this.basePosition = basePos;
        this.range = 100;
        this.angle = 0;
        this.speed = 0.05;
        this.pinned = true;
        this.mesh = new mesh();
        this.objLoader = new ObjLoader(objUrl);

        this.fTheta = 0;
        this.matProj = new mat4x4();
        this.initProjectionMatrix();

        this.lastTimestamp = 0;

        this.interactions = new Interactions(canvas);
        this.scaleFactor = 1.0;
        this.translationOffset = { x: 0, y: 0 };
        this.isMovingScene = false;
    }

    initProjectionMatrix() {
        const fNear = 0.1;
        const fFar = 1000.0;
        const fFov = 90.0;
        const fAspectRatio = this.canvas.height / this.canvas.width;
        const fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * Math.PI);
    
        this.matProj.m[0][0] = fAspectRatio * fFovRad;
        this.matProj.m[1][1] = fFovRad;
        this.matProj.m[2][2] = fFar / (fFar - fNear);
        this.matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
        this.matProj.m[2][3] = 1.0;
        this.matProj.m[3][3] = 0.0;
    }

    async initialize() {
        await this.objLoader.load();
        this.mesh = this.objLoader.getMesh();
    }

    multiplyMatrixVector(i, m) {
        let o = new vec3d();
        o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
        o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
        o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
        let w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];
    
        if (w !== 0.0) {
            o.x /= w;
            o.y /= w;
            o.z /= w;
        }
        return o;
    }

    update(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.1);

        const interactionState = this.interactions.getState();

        if (interactionState.scrollDelta !== 0) {
            const zoomChange = -interactionState.scrollDelta * interactionSettings.zoomSensitivity;
            this.scaleFactor += zoomChange;
            this.scaleFactor = Math.max(this.scaleFactor, 0.1);
        }

        if (interactionState.activeMode === 'move') {
            this.isMovingScene = true;
        } else if (interactionState.activeMode === 'scale') {
            this.isMovingScene = false;
            const scaleChange = (interactionState.mousePos.y - interactionState.lastMousePos.y) / this.canvas.height;
            const adjustedScaleChange = scaleChange * (interactionState.keyCode === 'ShiftLeft' || interactionState.keyCode === 'ShiftRight' ? 0.5 : 1);
            this.scaleFactor += adjustedScaleChange * interactionSettings.scalingSensitivity;
            this.scaleFactor = Math.max(this.scaleFactor, 0.1);
        } else if (interactionState.activeMode === 'rotate') {
            this.isMovingScene = false;
            this.fTheta += (interactionState.mousePos.x - interactionState.lastMousePos.x) * interactionSettings.rotationSensitivity;
            this.angle += (interactionState.mousePos.y - interactionState.lastMousePos.y) * interactionSettings.rotationSensitivity;
        } else {
            this.isMovingScene = false;
        }

        if (this.isMovingScene) {
            this.translationOffset.x += (interactionState.mousePos.x - interactionState.lastMousePos.x) * interactionSettings.translationSensitivity;
            this.translationOffset.y += (interactionState.mousePos.y - interactionState.lastMousePos.y) * interactionSettings.translationSensitivity;
        } 

        let matRotZ = new mat4x4();
        let matRotX = new mat4x4();
        let matScale = new mat4x4();
    
        matRotZ.m[0][0] = Math.cos(this.fTheta);
        matRotZ.m[0][1] = Math.sin(this.fTheta);
        matRotZ.m[1][0] = -Math.sin(this.fTheta);
        matRotZ.m[1][1] = Math.cos(this.fTheta);
        matRotZ.m[2][2] = 1;
        matRotZ.m[3][3] = 1;
    
        matRotX.m[0][0] = 1;
        matRotX.m[1][1] = Math.cos(this.angle * 0.5);
        matRotX.m[1][2] = Math.sin(this.angle * 0.5);
        matRotX.m[2][1] = -Math.sin(this.angle * 0.5);
        matRotX.m[2][2] = Math.cos(this.angle * 0.5);
        matRotX.m[3][3] = 1;

        matScale.m[0][0] = this.scaleFactor;
        matScale.m[1][1] = this.scaleFactor;
        matScale.m[2][2] = this.scaleFactor;
        matScale.m[3][3] = 1;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.mesh.tris.forEach(tri => {
            let triRotatedZ = new triangle();
            let triRotatedZX = new triangle();
            let triScaled = new triangle();
            let triTranslated = new triangle();
            let triProjected = new triangle();
    
            triRotatedZ.p[0] = this.multiplyMatrixVector(tri.p[0], matRotZ);
            triRotatedZ.p[1] = this.multiplyMatrixVector(tri.p[1], matRotZ);
            triRotatedZ.p[2] = this.multiplyMatrixVector(tri.p[2], matRotZ);
    
            triRotatedZX.p[0] = this.multiplyMatrixVector(triRotatedZ.p[0], matRotX);
            triRotatedZX.p[1] = this.multiplyMatrixVector(triRotatedZ.p[1], matRotX);
            triRotatedZX.p[2] = this.multiplyMatrixVector(triRotatedZ.p[2], matRotX);
    
            triScaled.p[0] = this.multiplyMatrixVector(triRotatedZX.p[0], matScale);
            triScaled.p[1] = this.multiplyMatrixVector(triRotatedZX.p[1], matScale);
            triScaled.p[2] = this.multiplyMatrixVector(triRotatedZX.p[2], matScale);

            triTranslated = triScaled;
            triTranslated.p[0].z += 3.0;
            triTranslated.p[1].z += 3.0;
            triTranslated.p[2].z += 3.0;
    
            triProjected.p[0] = this.multiplyMatrixVector(triTranslated.p[0], this.matProj);
            triProjected.p[1] = this.multiplyMatrixVector(triTranslated.p[1], this.matProj);
            triProjected.p[2] = this.multiplyMatrixVector(triTranslated.p[2], this.matProj);
    
            triProjected.p[0].x += 1.0; triProjected.p[0].y += 1.0;
            triProjected.p[1].x += 1.0; triProjected.p[1].y += 1.0;
            triProjected.p[2].x += 1.0; triProjected.p[2].y += 1.0;
    
            triProjected.p[0].x *= 0.5 * this.canvas.width;
            triProjected.p[0].y *= 0.5 * this.canvas.height;
            triProjected.p[1].x *= 0.5 * this.canvas.width;
            triProjected.p[1].y *= 0.5 * this.canvas.height;
            triProjected.p[2].x *= 0.5 * this.canvas.width;
            triProjected.p[2].y *= 0.5 * this.canvas.height;

            triProjected.p[0].x += this.translationOffset.x;
            triProjected.p[0].y += this.translationOffset.y;
            triProjected.p[1].x += this.translationOffset.x;
            triProjected.p[1].y += this.translationOffset.y;
            triProjected.p[2].x += this.translationOffset.x;
            triProjected.p[2].y += this.translationOffset.y;
    
            this.drawTriangle(triProjected.p[0], triProjected.p[1], triProjected.p[2], "#FFFFFF");
        });

        this.interactions.resetLoop();
    }
    
    drawTriangle(p1, p2, p3, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    start() {
        const loop = (timestamp) => {
            if (!this.lastTimestamp) this.lastTimestamp = timestamp;
            const deltaTime = (timestamp - this.lastTimestamp) * 0.001; 

            this.update(deltaTime);
            this.lastTimestamp = timestamp;

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
