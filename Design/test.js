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

class closure_For_11 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_15 = null;
		this.node_17 = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_15 = new component_THREE_CurveLine({s: (new THREE.Vector2(0, 0)), e: (new THREE.Vector2(1, 1))}, {}, {});
		this.node_17 = new component_THREE_CurveEllipse({center: (new THREE.Vector2(0, 0)), rx: 1, ry: 1, as: 0, ae: 6.283185307179586, clockwise: false}, {}, {});
		this.r = {n:{curveline: [...this.node_15.r.n.curveline], curveellipse: [...this.node_17.r.n.curveellipse]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (this.b[0] & /* $$node_15 */ 1) {
			$changed = true;
			this.r.n.curveline = [...this.node_15.r.n.curveline];
		}
		if (this.b[0] & /* $$node_17 */ 2) {
			$changed = true;
			this.r.n.curveellipse = [...this.node_17.r.n.curveellipse];
		}
		return $changed;
	}
	dispose() {
		this.node_15.dispose();
		this.node_17.dispose();
		// console.log(">>>> dispose closure_For_11");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_For_11 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({$array:[], ...i}, [0]);
		this.r = null;
		this.nodes_array = [];
		this.array = null;
		this.init(c, s);
	}
	init(c, s) {
		this.array = this.i.$array;
		this.r = {n: {curveline: [], curveellipse: []}, e: {}};
		for (const [index, iter] of this.array.entries()) {
			const node = new closure_For_11({i: index}, {}, {});
			this.nodes_array.push(node);
			this.r.n.curveline.push(...node.r.n.curveline);
			this.r.n.curveellipse.push(...node.r.n.curveellipse);
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
			this.r.n.curveline = [];
			this.r.n.curveellipse = [];
			let $idx = 0;
			while ($idx < $len) {
				const iter = this.array[$idx];
				const index = $idx;
				const node = this.nodes_array[$idx];
				if (node === undefined) {
					$changed = true;
					const _node = new closure_For_11({i: index}, {}, {});
					this.nodes_array.push(_node);
					this.r.n.curveline.push(..._node.r.n.curveline);
					this.r.n.curveellipse.push(..._node.r.n.curveellipse);
				}
				else {
					$changed = node.update({i: index}, {}, {}) || $changed;
					this.r.n.curveline.push(...node.r.n.curveline);
					this.r.n.curveellipse.push(...node.r.n.curveellipse);
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
		// console.log(">>>> dispose component_For_11");
	}
	ref(id) {
		switch (id) { 
		}
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

class component_Component_0 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_5 = null;
		this.node_7 = null;
		this.node_9 = null;
		this.node_11 = null;
		this.node_18 = null;
		this.node_11_param_$array = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_5 = new component_THREE_CurveLine({s: (new THREE.Vector2(0, 0)), e: (new THREE.Vector2(1, 1))}, {}, {});
		this.node_7 = new component_THREE_CurveEllipse({center: (new THREE.Vector2(0, 0)), rx: 1, ry: 1, as: 0, ae: 6.283185307179586, clockwise: false}, {}, {});
		this.node_9 = new component_THREE_CurveLine({s: (new THREE.Vector2(0, 0)), e: (new THREE.Vector2(1, 1))}, {}, {});
		this.node_11_param_$array = (()=>{const a = [];for(let i = 0; i < 2; i++) a.push(i);return a;})();
		this.node_11 = new component_For_11({$array: this.node_11_param_$array}, {}, {});
		this.node_18 = new component_THREE_Path({closed: false}, {default: {curve: [...this.node_5.r.n.curveline, ...this.node_7.r.n.curveellipse, ...this.node_9.r.n.curveline, ...this.node_11.r.n.curveline, ...this.node_11.r.n.curveellipse]}}, {});
		this.r = {n:{path: [...this.node_18.r.n.path]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		this.node_18.b = [0];
		if (this.b[0] & /* $$node_5,$$node_7,$$node_9,$$node_11,$$node_11 */ 15) {
			// path children : $$node_5,$$node_7,$$node_9,$$node_11,$$node_11
			if (this.b[0] & 15) this.node_18.b[0] |= 2;
			this.b[0] |= 32 & (this.node_18.update({closed: false}, {default: {curve: [...this.node_5.r.n.curveline, ...this.node_7.r.n.curveellipse, ...this.node_9.r.n.curveline, ...this.node_11.r.n.curveline, ...this.node_11.r.n.curveellipse]}}, {}) ? 2147483647 : 0);
		}
		if (this.b[0] & /* $$node_18 */ 32) {
			$changed = true;
			this.r.n.path = [...this.node_18.r.n.path];
		}
		return $changed;
	}
	dispose() {
		this.node_5.dispose();
		this.node_7.dispose();
		this.node_9.dispose();
		this.node_11.dispose();
		this.node_18.dispose();
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