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

class component_THREE_Vector2 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { vec2: [new THREE.Vector2(i.x, i.y)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & /* x */ 1 && i.x !== this.r.n.vec2[0].x) {
            this.r.n.vec2[0].x = i.x;
            $changed ||= true;
        }
        if (this.b[0] & /* y */ 2 && i.y !== this.r.n.vec2[0].y) {
            this.r.n.vec2[0].y = i.y;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Vector2");
    }
}

class component_Component_2 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_5 = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_5 = new component_THREE_Vector2({x: 0, y: 0}, {}, {});
		this.r = {n:{vec2: [...this.node_5.r.n.vec2]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (this.b[0] & /* $$node_5 */ 1) {
			$changed = true;
			this.r.n.vec2 = [...this.node_5.r.n.vec2];
		}
		return $changed;
	}
	dispose() {
		this.node_5.dispose();
		// console.log(">>>> dispose component_Component_2");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

class component_THREE_Object3D extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const object3d = new THREE.Object3D();
        object3d.name = i.name;
        object3d.castShadow = i.castshadow;
        object3d.receiveShadow = i.receiveshadow;
        object3d.visible = i.visible;
        object3d.position.copy(i.pos);
        object3d.rotation.copy(i.rot);
        object3d.scale.copy(i.scale);
        c.default.object3d.forEach(o=>object3d.add(o));
        this.r = {
            n: { object3d: [object3d] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const object3d = this.r.n.object3d[0];
        if (this.b[0] & /* name */ 1){
            object3d.name = i.name;
        }
        if (this.b[0] & /* pos */ 2){
            object3d.position.copy(i.pos);
        }
        if (this.b[0] & /* rot */ 4){
            object3d.rotation.copy(i.rot);
        }
        if (this.b[0] & /* scale */ 8){
            object3d.scale.copy(i.scale);
        }
        if (this.b[0] & /* castshadow */ 16){
            object3d.castShadow = i.castshadow;
        }
        if (this.b[0] & /* receiveshadow */ 32){
            object3d.receiveShadow = i.receiveshadow;
        }
        if (this.b[0] & /* visible */ 64){
            object3d.visible = i.visible;
        }
        if (this.b[0] & /* children */ 128) {
            object3d.clear();
            c.default.object3d.forEach(o=>object3d.add(o));
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Object3D", this.r.n.object3d[0]);
    }
}

class component_THREE_PerspectiveCamera extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const perspectivecamera = new THREE.PerspectiveCamera(i.fov, 1, i.near, i.far);
        perspectivecamera.name = i.name;
        perspectivecamera.position.copy(i.pos);
        perspectivecamera.rotation.copy(i.rot);
        perspectivecamera.scale.copy(i.scale);
        this.r = {
            n: { perspectivecamera: [perspectivecamera] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const perspectivecamera = this.r.n.perspectivecamera[0];
        if (this.b[0] & /* pos */ 1){
            perspectivecamera.position.copy(i.pos);
        }
        if (this.b[0] & /* rot */ 2){
            perspectivecamera.rotation.copy(i.rot);
        }
        if (this.b[0] & /* scale */ 4){
            perspectivecamera.scale.copy(i.scale);
        }
        if (this.b[0] & /* fov */ 8) {
            perspectivecamera.fov = i.fov;
        }
        if (this.b[0] & /* near */ 16) {
            perspectivecamera.near = i.near;
        }
        if (this.b[0] & /* far */ 32) {
            perspectivecamera.far = i.far;
        }
        if (this.b[0] & /* fov, near, far */ 56) {
            perspectivecamera.updateProjectionMatrix();
        }
        if (this.b[0] & /* name */ 64) {
            perspectivecamera.name = i.name;
        }
		return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Object3D", this.r.n.object3d[0]);
    }
}

class component_Component_0 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_8 = null;
		this.node_10 = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_8 = new component_THREE_Object3D({name: 'unnamed', castshadow: true, receiveshadow: true, visible: true, pos: (new THREE.Vector3(0, 0, 0)), rot: (new THREE.Euler(0, 0, 0)), scale: (new THREE.Vector3(1, 1, 1))}, {default: {object3d: []}}, {});
		this.node_10 = new component_THREE_PerspectiveCamera({name: 'unnamed', castshadow: true, receiveshadow: true, visible: true, pos: (new THREE.Vector3(0, 0, 0)), rot: (new THREE.Euler(0, 0, 0)), scale: (new THREE.Vector3(1, 1, 1)), fov: 75, near: 0.01, far: 1000}, {}, {});
		this.r = {n:{object3d: [...this.node_8.r.n.object3d], perspectivecamera: [...this.node_10.r.n.perspectivecamera]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		if (this.b[0] & /* $$node_8 */ 1) {
			$changed = true;
			this.r.n.object3d = [...this.node_8.r.n.object3d];
		}
		if (this.b[0] & /* $$node_10 */ 2) {
			$changed = true;
			this.r.n.perspectivecamera = [...this.node_10.r.n.perspectivecamera];
		}
		return $changed;
	}
	dispose() {
		this.node_8.dispose();
		this.node_10.dispose();
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