class ObjLoader {
    constructor(url) {
        this.url = url;
        this.mesh = new mesh();
    }

    async load() {
        const response = await fetch(this.url);
        const data = await response.text();
        this.parseObjData(data);
    }

    parseObjData(data) {
        const lines = data.split("\n");
        const vertices = [];
        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith("v ")) {
                const parts = line.split(/\s+/);
                vertices.push(new vec3d(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])));
            }
            if (line.startsWith("f ")) {
                const parts = line.split(/\s+/);
                const p1 = vertices[parseInt(parts[1]) - 1];
                const p2 = vertices[parseInt(parts[2]) - 1];
                const p3 = vertices[parseInt(parts[3]) - 1];
                this.mesh.tris.push(new triangle(p1, p2, p3));
            }
        });
    }

    getMesh() {
        return this.mesh;
    }
}
