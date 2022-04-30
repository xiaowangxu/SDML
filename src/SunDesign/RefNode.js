import { Types } from "./Core.js";

export class SDML_Node {
	constructor(env) {
		this.types = new Types();
		this.env = env;
		this.uid = this.env.uid;
		this.class_name = `component_Component_${this.uid}`;
		this.inputs = {};
		this.outputs = {};
		this.compiled = false;
	}

	compile() {
	}

	instance_of(_class) {
		return this instanceof _class
	}

	summary() {
		return `node_${this.uid.toString()}`;
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
	}
}