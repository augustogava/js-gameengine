class ShapeEngine {
	constructor(pos, basePos) {
		this.position = pos;
		this.basePosition = basePos;
		this.range = 100;
		this.angle = 0;
		this.speed = 0.05;
		this.pinned = true;

	}

	update() {
		this.position.x = this.basePosition.x + Math.cos(this.angle) * this.range;
		this.position.y = this.basePosition.y + Math.sin(this.angle) * this.range;
		this.angle += this.speed;
	}

	render() {
		ctx.beginPath();
		ctx.arc(this.basePosition.x, this.basePosition.y, this.range, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
		ctx.fill();
	}
}