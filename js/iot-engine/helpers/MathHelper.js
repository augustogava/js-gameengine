class MathHelper {
    static getLinerInterpolation(finder, init, initV, max, maxV) {
        return (maxV - (initV)) / (max - init) * (finder - init) + (initV);
    }

    static lerp(a, b, t) {
        return a + (b - a) * t;
    }


    static length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static normalize(v) {
        const len = this.length(v);
        return new Vector(v.x / len, v.y / len);
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    static clamp(v, min, max) {
        return Math.max(min, Math.min(v, max));
    }

    static clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    static clamp2(value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }

    static distanceXY(x0, y0, x1, y1) {
        var dx = x1 - x0,
            dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
}