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

class component_THREE_Path extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const path = new THREE.Path();
        path.autoClose = i.closed;
        path.curves = c.default.curve;
        this.r = {
            n: { path: [path] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            const path = new THREE.Path();
            path.autoClose = i.closed;
            path.curves = c.default.curve;
            this.r.n.path[0] = path;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Path");
    }
}

class component_Component_2 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_6 = null;
		this.node_7 = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_6 = s.curves;
		this.node_7 = new component_THREE_Path({closed: false}, {default: {curve: [...this.node_6.curve]}}, {});
		this.r = {n:{path: [...this.node_7.r.n.path]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (s.curves !== null) {
		   this.b[0] |= 1;
		   this.node_6 = s.curves;
		}
		this.node_7.b = [0];
		if (this.b[0] & /* $$node_6 */ 1) {
			// path children : $$node_6
			if (this.b[0] & 1) this.node_7.b[0] |= 2;
			this.b[0] |= 2 & (this.node_7.update({closed: false}, {default: {curve: [...this.node_6.curve]}}, {}) ? 2147483647 : 0);
		}
		if (this.b[0] & /* $$node_7 */ 2) {
			$changed = true;
			this.r.n.path = [...this.node_7.r.n.path];
		}
		return $changed;
	}
	dispose() {
		this.node_6 = undefined;
		this.node_7.dispose();
		// console.log(">>>> dispose component_Component_2");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_THREE_CurveLine extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curveline: [new THREE.LineCurve(i.s, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            this.r.n.curveline[0] = new THREE.LineCurve(i.s, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveLine");
    }
}

class component_THREE_BoxGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = new THREE.BoxGeometry(i.w, i.h, i.d, i.ws, i.hs, i.ds);
        this.r = {
            n: { boxgeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.boxgeometry[0];
        if (this.b[0] & 63) {
            geo.dispose();
            this.r.n.boxgeometry[0] = new THREE.BoxGeometry(i.w, i.h, i.d, i.ws, i.hs, i.ds);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.boxgeometry[0].dispose();
        this.r.n.boxgeometry = undefined;
        // console.log("dispose component_THREE_BoxGeometry");
    }
}

class closure_If_True_25 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_28 = null;
		this.node_30 = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_28 = new component_THREE_CurveLine({s: (new THREE.Vector2(0, 0)), e: (new THREE.Vector2(1, 1))}, {}, {});
		this.node_30 = new component_THREE_BoxGeometry({w: 1, h: 1, d: 1, ws: 1, hs: 1, ds: 1}, {}, {});
		this.r = {n:{curve: [...this.node_28.r.n.curveline], boxgeometry: [...this.node_30.r.n.boxgeometry]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (this.b[0] & /* $$node_28 */ 1) {
			$changed = true;
			this.r.n.curve = [...this.node_28.r.n.curveline];
		}
		if (this.b[0] & /* $$node_30 */ 2) {
			$changed = true;
			this.r.n.boxgeometry = [...this.node_30.r.n.boxgeometry];
		}
		return $changed;
	}
	dispose() {
		this.node_28.dispose();
		this.node_30.dispose();
		// console.log(">>>> dispose closure_If_True_25");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_If_25 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({$test: false, ...i}, [0]);
		this.r = null;
		this.condition = null;
		this.true_nodes = null;
		this.false_nodes = null;
		this.init(c, s);
	}
	init(c, s) {
		this.condition = this.i.$test;
		this.r = {n: {curve: [], boxgeometry: []}, e: {}};
		if (this.condition) {
			const node = new closure_If_True_25({}, {}, {});
			this.true_nodes = node;
			this.r.n.curve.push(...node.r.n.curve);
			this.r.n.boxgeometry.push(...node.r.n.boxgeometry);
		}
	}
	diff(i) {
		this.b = [0];
		if (i.$test !== undefined && this.i.$test !== i.$test) {
			this.i.$test = i.$test;
			this.condition = i.$test;
			this.b[0] |= 1;
		}
	}
	update(i, c, s) {
		this.diff(i);
		if (this.b[0] & /* $test */ 1) {
			this.r.n.curve = [];
			this.r.n.boxgeometry = [];
			if (this.condition) {
				if (this.true_nodes !== null)
					this.true_nodes.update({}, {}, {})
				else 
					this.true_nodes = new closure_If_True_25({}, {}, {});
				this.r.n.curve.push(...this.true_nodes.r.n.curve);
				this.r.n.boxgeometry.push(...this.true_nodes.r.n.boxgeometry);
			}
			return true;
		}
	}
	dispose() {
		if (this.true_nodes !== null) this.true_nodes.dispose();
		if (this.false_nodes !== null) this.false_nodes.dispose();
		// console.log(">>>> dispose component_If_25");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_THREE_CurveEllipse extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curveellipse: [new THREE.EllipseCurve(i.center.x, i.center.y, i.rx, i.ry, i.as, i.ae, i.clockwise)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 63) {
            this.r.n.curveellipse[0] = new THREE.EllipseCurve(i.center.x, i.center.y, i.rx, i.ry, i.as, i.ae, i.clockwise);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveEllipse");
    }
}

class closure_For_17 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_21 = null;
		this.node_23 = null;
		this.node_25 = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_21 = new component_THREE_CurveEllipse({center: (new THREE.Vector2(0, 0)), rx: 1, ry: 1, as: 0, ae: 6.283185307179586, clockwise: false}, {}, {});
		this.node_23 = new component_THREE_CurveLine({s: (new THREE.Vector2(0, 0)), e: (new THREE.Vector2(1, 1))}, {}, {});
		this.node_25 = new component_If_25({$test: true}, {}, {});
		this.r = {n:{curve: [...this.node_21.r.n.curveellipse, ...this.node_23.r.n.curveline, ...this.node_25.r.n.curve], boxgeometry: [...this.node_25.r.n.boxgeometry]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (this.b[0] & /* $$node_21,$$node_23,$$node_25 */ 7) {
			$changed = true;
			this.r.n.curve = [...this.node_21.r.n.curveellipse, ...this.node_23.r.n.curveline, ...this.node_25.r.n.curve];
		}
		if (this.b[0] & /* $$node_25 */ 4) {
			$changed = true;
			this.r.n.boxgeometry = [...this.node_25.r.n.boxgeometry];
		}
		return $changed;
	}
	dispose() {
		this.node_21.dispose();
		this.node_23.dispose();
		this.node_25.dispose();
		// console.log(">>>> dispose closure_For_17");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_For_17 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({$array:[], ...i}, [0]);
		this.r = null;
		this.nodes_array = [];
		this.array = null;
		this.init(c, s);
	}
	init(c, s) {
		this.array = this.i.$array;
		this.r = {n: {curve: [], boxgeometry: []}, e: {}};
		for (const [index, iter] of this.array.entries()) {
			const node = new closure_For_17({idx: index}, {}, {});
			this.nodes_array.push(node);
			this.r.n.curve.push(...node.r.n.curve);
			this.r.n.boxgeometry.push(...node.r.n.boxgeometry);
		}
	}
	diff(i) {
		this.b = [0];
		if (i.$array !== undefined && this.i.$array !== i.$array) {
			this.i.$array = i.$array;
			this.array = i.$array;
			this.b[0] |= 1;
		}
	}
	update(i, c, s) {
		this.diff(i);
		if (this.b[0] & 1) {
			const $len = this.array.length;
			let $changed = this.nodes_array.length !== $len;
			this.nodes_array.splice($len, Infinity).forEach(n => n.dispose());
			this.r.n.curve = [];
			this.r.n.boxgeometry = [];
			let $idx = 0;
			while ($idx < $len) {
				const iter = this.array[$idx];
				const index = $idx;
				const node = this.nodes_array[$idx];
				if (node === undefined) {
					$changed = true;
					const _node = new closure_For_17({idx: index}, {}, {});
					this.nodes_array.push(_node);
					this.r.n.curve.push(..._node.r.n.curve);
					this.r.n.boxgeometry.push(..._node.r.n.boxgeometry);
				}
				else {
					$changed = node.update({idx: index}, {}, {}) || $changed;
					this.r.n.curve.push(...node.r.n.curve);
					this.r.n.boxgeometry.push(...node.r.n.boxgeometry);
				}
				$idx++;
			}
			return $changed;
		}
	}
	dispose() {
		for (const node of this.nodes_array) {
			node.dispose();
		}
		this.nodes_array = [];
		// console.log(">>>> dispose component_For_17");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_Component_0 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_11 = null;
		this.node_13 = null;
		this.node_15 = null;
		this.node_17 = null;
		this.node_31 = null;
		this.node_17_param_$array = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_11 = new component_THREE_CurveEllipse({center: (new THREE.Vector2(0, 0)), rx: 1, ry: 1, as: 0, ae: 6.283185307179586, clockwise: false}, {}, {});
		this.node_13 = new component_THREE_CurveLine({s: (new THREE.Vector2(0, 0)), e: (new THREE.Vector2(1, 1))}, {}, {});
		this.node_15 = new component_THREE_CurveEllipse({center: (new THREE.Vector2(0, 0)), rx: 1, ry: 1, as: 0, ae: 6.283185307179586, clockwise: false}, {}, {});
		this.node_17_param_$array = (()=>{const a = [];for(let i = 0; i < 2; i++) a.push(i);return a;})();
		this.node_17 = new component_For_17({$array: this.node_17_param_$array}, {}, {});
		this.node_31 = new component_Component_2({}, {}, {curves: {curve: [...this.node_11.r.n.curveellipse, ...this.node_13.r.n.curveline, ...this.node_15.r.n.curveellipse, ...this.node_17.r.n.curve]}});
		this.r = {n:{path: [...this.node_31.r.n.path]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (this.b[0] & /* $$node_11,$$node_13,$$node_15,$$node_17 */ 15) {
			// Curves children : 
			this.b[0] |= 32 & (this.node_31.update({}, {}, {curves: (this.b[0] & /* node_11,node_13,node_15,node_17 */ 15) ? {curve: [...this.node_11.r.n.curveellipse, ...this.node_13.r.n.curveline, ...this.node_15.r.n.curveellipse, ...this.node_17.r.n.curve]} : null}) ? 2147483647 : 0);
		}
		if (this.b[0] & /* $$node_31 */ 32) {
			$changed = true;
			this.r.n.path = [...this.node_31.r.n.path];
		}
		return $changed;
	}
	dispose() {
		this.node_11.dispose();
		this.node_13.dispose();
		this.node_15.dispose();
		this.node_17.dispose();
		this.node_31.dispose();
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