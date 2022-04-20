import * as THREE from 'Three.js';
import CSG from 'CSG.js';
import * as UTILS from 'Utils.js';

const $loading = [];

class ComponentBase {
    constructor(i, b) {
        this.i = i;
        this.r = null;
        this.b = b;
    }
    init(c, s) {
    }
    diff(i) {
    }
    update(i, c, s) {
        return false;
    }
    dispose() {
    }
    ref(id) {
        console.log(id);
    }
}

class component_ToNode extends ComponentBase {
    constructor(i, c, s, t) {
        super();
        this.t = t;
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: {[this.t]:[i.value]},
            e: {}
        }
    }
    update(i, c, s) {
        this.r.n[this.t][0] = i.value;
        return true;
    }
    dispose() {
        // console.log("dispose component_ToNode");
    }
}

class component_Component_0 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({time: 0, ...i}, [0]);
		this.r = null;
		this.node_4 = null;
		this.node_4_param_value = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_4_param_value = (123 + this.i.time);
		this.node_4 = new component_ToNode({value: this.node_4_param_value},{},{},'int');
		this.r = {n:{int: [...this.node_4.r.n.int]}, e:{}};
	}
	diff(i) {
		this.b = [0];
		if (i.time !== undefined && i.time !== this.i.time) {
			this.i.time = i.time;
			this.b[0] |= 1;
		}
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		this.node_4.b = [0];
		if (this.b[0] & /* time */ 1) {
			this.node_4_param_value = (123 + this.i.time);
			this.b[0] |= 4;
		}
		if (this.b[0] & /* $$node_4_param_value */ 4) {
			// to-node children : 
			this.b[0] |= 2 & (this.node_4.update({value: this.node_4_param_value}, {}, {}) ? 2147483647 : 0);
		}
		if (this.b[0] & /* $$node_4 */ 2) {
			$changed = true;
			this.r.n.int = [...this.node_4.r.n.int];
		}
		return $changed;
	}
	dispose() {
		this.node_4.dispose();
		// console.log(">>>> dispose component_Component_0");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

const $load_promise = Promise.all($loading);
function $dispose() {

}
export {};
export { component_Component_0 as main, $load_promise as onLoad, $dispose as Dispose };