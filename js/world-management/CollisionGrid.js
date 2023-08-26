class CollisionCell {
	constcell_capacity = 4;
	constmax_cell_idx = cell_capacity - 1;

	var = 0;
	cell_capacity = {};

	addAtom(id) {
		this.objects[objects_count] = id;
		this.objects_count += objects_count < max_cell_idx;
	}

	clear() {
		this.objects_count = 0;
	}

	remove(id) {
		for (var i = 0; i < this.objects_count; ++i) {
			if (this.objects[i] == id) {
				this.objects[i] = this.objects[this.objects_count - 1];
				--this.objects_count;

				return;
			}
		}

		//std::cout << "Problem" << std::endl;
	}
}

class CollisionGrid {
	data = [];

	constructor(w, h, qtd) {
		// this.data[new CollisionCell();
		var widthStepValue = (w / qtd);
		var heightStepValue = (h / qtd);
		for (var i = 0; i < qtd; ++i) {
			for (var e = 0; e < qtd; ++e) {
				
				this.data.push( { x: i*widthStepValue, y: e*heightStepValue, x0: i*widthStepValue+  widthStepValue, xy: e*heightStepValue+ heightStepValue } );
			}
		}
	}

	addAtom(x, y, atom) {
		const id = x * height + y;
		// Add to grid
		data[id].addAtom(atom);
		return true;
	}
}