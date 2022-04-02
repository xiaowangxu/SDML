import * as THREE from 'Three.js';

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

class component_THREE_StandardMaterial extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const mat = new THREE.MeshStandardMaterial({
            color: i.color,
            emissive: i.emissive,
            roughness: i.roughness,
            metalness: i.metalness,
            flatShading: i.flat,
            wireframe: i.wireframe,
        });
        this.r = {
            n: { standardmaterial: [mat] },
            e: {}
        }
    }
    update(i, c, s) {
        const mat = this.r.n.standardmaterial[0];
        if (this.b[0] & /* color */ 1) {
            mat.color = i.color;
        }
        if (this.b[0] & /* emissive */ 2) {
            mat.emissive = i.emissive;
        }
        if (this.b[0] & /* roughness */ 4) {
            mat.roughness = i.roughness;
        }
        if (this.b[0] & /* metalness */ 8) {
            mat.metalness = i.metalness;
        }
        if (this.b[0] & /* flat */ 16) {
            mat.flatShading = i.flat;
        }
        if (this.b[0] & /* wireframe */ 32) {
            mat.wireframe = i.wireframe;
        }
        return false;
    }
    dispose() {
        this.r.n.standardmaterial[0].dispose();
        this.r.n.standardmaterial = undefined;
        // console.log("dispose component_THREE_BoxGeometry");
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
		if (this.b[0] & /* pos */ 1){
        	object3d.position.copy(i.pos);
		}
		if (this.b[0] & /* rot */ 2){
        	object3d.rotation.copy(i.rot);
		}
		if (this.b[0] & /* scale */ 4){
        	object3d.scale.copy(i.scale);
		}
        if (this.b[0] & /* children */ 8) {
            object3d.clear();
            c.default.object3d.forEach(o=>object3d.add(o));
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Object3D", this.r.n.object3d[0]);
    }
}

class component_THREE_Mesh extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const mesh = new THREE.Mesh(c.default.geometry[0], c.default.material[0]);
        mesh.position.copy(i.pos);
        mesh.rotation.copy(i.rot);
        mesh.scale.copy(i.scale);
        this.r = {
            n: { mesh: [mesh] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const mesh = this.r.n.mesh[0];
		if (this.b[0] & /* pos */ 1){
        	mesh.position.copy(i.pos);
		}
		if (this.b[0] & /* rot */ 2){
        	mesh.rotation.copy(i.rot);
		}
		if (this.b[0] & /* scale */ 4){
        	mesh.scale.copy(i.scale);
		}
        if (this.b[0] & /* children */ 8) {
            if (mesh.geometry !== c.default.geometry[0])
                mesh.geometry = c.default.geometry[0];
            if (mesh.material !== c.default.material[0])
                mesh.material = c.default.material[0];
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Mesh");
    }
}

class component_StaticComponent_0 extends ComponentBase {
	constructor(i = {}, c, s) {
		super({...i}, [0]);
		this.r = null;
		this.node_4 = null;
		this.node_6 = null;
		this.node_8 = null;
		this.node_9 = null;
		this.node_6_param_color = null;
		this.node_6_param_emissive = null;
		this.init(c, s);
	}
	init(c, s) {
		this.node_4 = new component_THREE_BoxGeometry({w: 1, h: 1, d: 1, ws: 1, hs: 1, ds: 1}, {}, {});
		this.node_6_param_color = (new THREE.Color(1, 0, 0));
		this.node_6_param_emissive = (new THREE.Color(0, 0, 0));
		this.node_6 = new component_THREE_StandardMaterial({color: this.node_6_param_color, emissive: this.node_6_param_emissive, roughness: 0, metalness: 0, flat: false, wireframe: false}, {}, {});
		this.node_8 = new component_THREE_Object3D({pos: (new THREE.Vector3(0, 0, 0)), rot: (new THREE.Euler(0, 0, 0)), scale: (new THREE.Vector3(1, 1, 1))}, {default: {object3d: []}}, {});
		this.node_9 = new component_THREE_Mesh({pos: (new THREE.Vector3(0, 0, 0)), rot: (new THREE.Euler(0, 0, 0)), scale: (new THREE.Vector3(1, 1, 1))}, {default: {geometry: [...this.node_4.r.n.boxgeometry], material: [...this.node_6.r.n.standardmaterial]}, children: {object3d: [...this.node_8.r.n.object3d]}}, {});
		this.r = {n:{mesh: [...this.node_9.r.n.mesh]}, e:{}};
	}
	diff(i) {
		this.b = [0];
	}
	update(i, c, s) {
		this.diff(i);
		let $changed = false;
		this.node_9.b = [0];
		if (this.b[0] & /* $$node_4,$$node_6,$$node_8 */ 19) {
			// mesh children : $$node_4,$$node_6,$$node_8
			if (this.b[0] & 3) this.node_9.b[0] |= 8;
			if (this.b[0] & 16) this.node_9.b[0] |= 16;
			this.b[0] |= 32 & (this.node_9.update({pos: (new THREE.Vector3(0, 0, 0)), rot: (new THREE.Euler(0, 0, 0)), scale: (new THREE.Vector3(1, 1, 1))}, {default: {geometry: [...this.node_4.r.n.boxgeometry], material: [...this.node_6.r.n.standardmaterial]}, children: {object3d: [...this.node_8.r.n.object3d]}}, {}) ? 2147483647 : 0);
		}
		if (this.b[0] & /* $$node_9 */ 32) {
			$changed = true;
			this.r.n.mesh = [...this.node_9.r.n.mesh];
		}
		return $changed;
	}
	dispose() {
		this.node_4.dispose();
		this.node_6.dispose();
		this.node_8.dispose();
		this.node_9.dispose();
		// console.log(">>>> dispose component_StaticComponent_0");
	}
	ref(id) {
		switch (id) { 
		}
	}
}

const component_Component_0 = new component_StaticComponent_0();

export { component_Component_0 as main };