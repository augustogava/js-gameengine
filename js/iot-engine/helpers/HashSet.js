class HashTable {
    constructor() {
        this.table = new Array(127);
        this.size = 0;
    }

    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.table.length;
    }

    set(key, value) {
        const index = this._hash(key);
        if (!this.table[index]) {
            this.table[index] = [];
        }
        // Check if the key already exists in the chain, update value if it does
        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i][0] === key) {
                this.table[index][i][1] = value;
                return;
            }
        }
        // Otherwise, add the new key-value pair
        this.table[index].push([key, value]);
        this.size++;
    }

    get(key) {
        const index = this._hash(key);
        if (this.table[index]) {
            for (let i = 0; i < this.table[index].length; i++) {
                if (this.table[index][i][0] === key) {
                    return this.table[index][i][1];
                }
            }
        }
        return undefined;
    }

    remove(key) {
        const index = this._hash(key);
        if (this.table[index] && this.table[index].length) {
            for (let i = 0; i < this.table[index].length; i++) {
                if (this.table[index][i][0] === key) {
                    this.table[index].splice(i, 1);
                    this.size--;
                    return true;
                }
            }
        }
        return false;
    }

    getAllObjects() {
        const lstOut = [];
        this.table.forEach((values) => {
            if (values) {
                values.forEach(([key, value]) => {
                    lstOut.push(value);
                });
            }
        });
        return lstOut;
    }

    display() {
        this.table.forEach((values, index) => {
            if (values) {
                const chainedValues = values.map(
                    ([key, value]) => `[ ${key}: ${value} ]`
                );
                console.log(`${index}: ${chainedValues}`);
            }
        });
    }
}
