import { Types } from "../Core.js";
import { SDML_Node } from "../RefNode.js";
import { ResourceLoader } from "../ResourceLoader.js";
import { SDML_Compiler_Visitor } from "../TagVisitor.js";

class STLDeferLoader extends ResourceLoader {
	load(url, ast) {
		return Promise.resolve(new STL_Node(this.env, url, ast));
	}
}

class STL_Node extends SDML_Node {
	constructor(env, url, ast) {
		super(env);
		this.url = url;
		this.ast = ast;
		this.types = new Types({
			geometry: 1
		});
	}

	compile() {
		const load_promise = `new Promise((s, r)=>{new UTILS.STLLoader().load('${this.url}', (g)=>{${this.class_name}_stl = g;s();}, undefined, (e)=>{r(e);})})`;
		this.env.add_WaitToLoad(load_promise);
		this.env.add_WaitToDispose(`${this.class_name}_stl.dispose(); ${this.class_name}_stl = undefined;`);
		const code = `class ${this.class_name} extends ComponentBase {
    constructor() {
        super();
        if (${this.class_name}_stl === undefined) throw new Error('stl geometry from "${this.url}" is not loaded');
        this.r = {n: {geometry: [${this.class_name}_stl.clone()]}, e: {}};
    }
    dispose() {
        this.geometry.dispose();
        this.geometry = undefined;
    }
}`;
		this.env.add_Template(`${this.class_name}_stl`, `var ${this.class_name}_stl = undefined;`);
		this.env.add_Template(this.class_name, code);
	}

	summary() {
		return `stl_${this.uid.toString()}`;
	}

	get_Entries() {
		return [];
	}

	get_InputsTypes() {
		return Types.NONE;
	}

	get_ExportsTypes() {
		return Types.NONE;
	}

	get_SDMLNodeInstance(scope, name, id, parent, ast) {
		return new SDML_STLNode(scope, name, id, parent, ast, this);
	}
}

class SDML_STLNode extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast, stl_node_ref) {
		super(scope, name, id, parent, ast, {}, [], false);
		this.stl_node = stl_node_ref;
	}

	static entries = [];
	static inputs = Types.NONE;

	to_Mermaid(ans, link) {
		ans.push(`Node_${this.uid}(stl url=${this.stl_node.url})`);
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'geometry', this);
	}

	get_NewNode(codegen) {
		return this.stl_node.class_name;
	}

	get_Type() {
		return SDML_STLNode.type;
	}

	static get type() {
		return new Types({ geometry: 1 });
	}
}

export { STLDeferLoader };