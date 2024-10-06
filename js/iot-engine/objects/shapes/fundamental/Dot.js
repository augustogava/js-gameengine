// roundDot.updateFieldUserInstance('shapeType', 'square');

class Dot extends BasicForms {
    constructor(x, y, size, shapeType = 'round') {
        super();
        this.position = new Vector(x, y);
        this.size = size;
        this.shapeType = shapeType;

        this.vertices.push(new Vertex(this.position));

        this.color = "black";
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
    }

    getPosition() {
        return this.position;
    }

    draw() {
        ctx.beginPath();
        if (this.shapeType === 'round') {
            ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        } else if (this.shapeType === 'square') {
            ctx.rect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
        }
        ctx.fill();
        ctx.closePath();
    }

    update(d) {
        this.position.addTo(this.velocity.multiply(d));
    }

    updateFieldUserInstance(property, value) {
        if (property === 'color') {
            this.color = value;
            ctx.fillStyle = value;
        } else if (property === 'size') {
            this.size = value;
        } else if (property === 'positionX') {
            this.position.setX(value);
        } else if (property === 'positionY') {
            this.position.setY(value);
        } else if (property === 'shapeType') {
            this.shapeType = value;
        }
    }

    getInputFieldsConfig() {
        return {
            'Dot': [
                { id: 'color', label: 'Color', type: 'color', value: this.color },
                { id: 'size', label: 'Size', type: 'number', value: this.size },
                { id: 'positionX', label: 'Position X', type: 'number', value: this.position.getX() },
                { id: 'positionY', label: 'Position Y', type: 'number', value: this.position.getY() },
                { id: 'shapeType', label: 'Shape Type', type: 'select', value: this.shapeType, options: ['round', 'square'] }
            ]
        };
    }
}
