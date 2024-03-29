import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from './Core.js';
import { ResourceLoader } from './ResourceLoader.js';
import { SDML_Node } from './RefNode.js';
import { SDML_ComponentNode } from './TagVisitor.js';
import { ALL_NODE_TYPES } from './TagCollection.js';
import { typeCheck } from './sPARks.js';
import { typeToString } from './SunDesignExpression.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from './Core.js';
import Loaders from './Loaders/All.js';
import '../SunDesignTagTemplates/All.js';
import { readFile } from 'fs/promises';
import chalk from 'chalk';

function parse(S) {
	let pos = 0;
	let keepComments = false;
	let keepWhitespace = true;

	let openBracket = "<";
	let openBracketCC = "<".charCodeAt(0);
	let closeBracket = ">";
	let closeBracketCC = ">".charCodeAt(0);
	let minusCC = "-".charCodeAt(0);
	let slashCC = "/".charCodeAt(0);
	let exclamationCC = '!'.charCodeAt(0);
	let singleQuoteCC = "'".charCodeAt(0);
	let doubleQuoteCC = '"'.charCodeAt(0);
	let openCornerBracketCC = '['.charCodeAt(0);
	let closeCornerBracketCC = ']'.charCodeAt(0);

	/**
	 * parsing a list of entries
	 */
	function parseChildren(tagName) {
		let children = [];
		while (S[pos]) {
			if (S.charCodeAt(pos) == openBracketCC) {
				if (S.charCodeAt(pos + 1) === slashCC) {
					let closeStart = pos + 2;
					pos = S.indexOf(closeBracket, pos);

					let closeTag = S.substring(closeStart, pos)
					if (closeTag.indexOf(tagName) == -1) {
						let parsedText = S.substring(0, pos).split('\n');
						throw new Error(
							'Unexpected close tag\nLine: ' + (parsedText.length - 1) +
							'\nColumn: ' + (parsedText[parsedText.length - 1].length + 1) +
							'\nChar: ' + S[pos]
						);
					}

					if (pos + 1) pos += 1

					return children;
				} else if (S.charCodeAt(pos + 1) === exclamationCC) {
					if (S.charCodeAt(pos + 2) == minusCC) {
						//comment support
						const startCommentPos = pos;
						while (pos !== -1 && !(S.charCodeAt(pos) === closeBracketCC && S.charCodeAt(pos - 1) == minusCC && S.charCodeAt(pos - 2) == minusCC && pos != -1)) {
							pos = S.indexOf(closeBracket, pos + 1);
						}
						if (pos === -1) {
							pos = S.length
						}
						if (keepComments) {
							children.push(S.substring(startCommentPos, pos + 1));
						}
					} else if (
						S.charCodeAt(pos + 2) === openCornerBracketCC
						&& S.charCodeAt(pos + 8) === openCornerBracketCC
						&& S.substr(pos + 3, 5).toLowerCase() === 'cdata'
					) {
						// cdata
						let cdataEndIndex = S.indexOf(']]>', pos);
						if (cdataEndIndex == -1) {
							children.push(S.substr(pos + 9));
							pos = S.length;
						} else {
							children.push(S.substring(pos + 9, cdataEndIndex));
							pos = cdataEndIndex + 3;
						}
						continue;
					} else {
						// doctypesupport
						const startDoctype = pos + 1;
						pos += 2;
						let encapsuled = false;
						while ((S.charCodeAt(pos) !== closeBracketCC || encapsuled === true) && S[pos]) {
							if (S.charCodeAt(pos) === openCornerBracketCC) {
								encapsuled = true;
							} else if (encapsuled === true && S.charCodeAt(pos) === closeCornerBracketCC) {
								encapsuled = false;
							}
							pos++;
						}
						children.push(S.substring(startDoctype, pos));
					}
					pos++;
					continue;
				}
				let node = parseNode();
				children.push(node);
				if (node.tagName[0] === '?') {
					children.push(...node.children);
					node.children = [];
				}
			} else {
				let text = parseText();
				if (keepWhitespace) {
					if (text.length > 0) {
						children.push(text);
					}
				} else {
					text.attributes.text = text.attributes.text.trim();
					if (text.attributes.text.length > 0) {
						children.push(text);
					}
				}
				pos++;
			}
		}
		return children;
	}

	/**
	 *    returns the text outside of texts until the first '<'
	 */
	function parseText() {
		let start = pos;
		pos = S.indexOf(openBracket, pos) - 1;
		if (pos === -2)
			pos = S.length;
		const str = S.slice(start, pos + 1);
		return { tagName: "textContext", attributes: { text: str }, children: [] };
	}
	/**
	 *    returns text until the first nonAlphabetic letter
	 */
	let nameSpacer = '\r\n\t>/= ';

	function parseName() {
		let start = pos;
		while (nameSpacer.indexOf(S[pos]) === -1 && S[pos]) {
			pos++;
		}
		return S.slice(start, pos);
	}
	/**
	 *    is parsing a node, including tagName, Attributes and its children,
	 * to parse children it uses the parseChildren again, that makes the parsing recursive
	 */
	let NoChildNodes = []// || ['img', 'br', 'input', 'meta', 'link', 'hr'];

	function parseNode() {
		pos++;
		const tagName = parseName();
		const attributes = {};
		let children = [];

		// parsing attributes
		while (S.charCodeAt(pos) !== closeBracketCC && S[pos]) {
			let c = S.charCodeAt(pos);
			if ((c > 64 && c < 91) || (c > 96 && c < 123)) {
				//if('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(S[pos])!==-1 ){
				let name = parseName();
				let value = '';
				// search beginning of the string
				let code = S.charCodeAt(pos);
				while (code && code !== singleQuoteCC && code !== doubleQuoteCC && !((code > 64 && code < 91) || (code > 96 && code < 123)) && code !== closeBracketCC) {
					pos++;
					code = S.charCodeAt(pos);
				}
				if (code === singleQuoteCC || code === doubleQuoteCC) {
					value = parseString();
					if (pos === -1) {
						return {
							tagName,
							attributes,
							children,
						};
					}
				} else {
					value = null;
					pos--;
				}
				attributes[name] = value;
			}
			pos++;
		}
		// optional parsing of children
		if (S.charCodeAt(pos - 1) !== slashCC) {
			if (tagName == "script") {
				let start = pos + 1;
				pos = S.indexOf('</script>', pos);
				children = [S.slice(start, pos)];
				pos += 9;
			} else if (tagName == "style") {
				let start = pos + 1;
				pos = S.indexOf('</style>', pos);
				const STR = S.slice(start, pos)
				children = [{ tagName: 'textContext', attributes: { text: STR }, children: [] }];
				pos += 8;
			} else if (NoChildNodes.indexOf(tagName) === -1) {
				pos++;
				children = parseChildren(tagName);
			} else {
				pos++
			}
		} else {
			pos++;
		}
		return {
			tagName,
			attributes,
			children,
		};
	}

	/**
	 *    is parsing a string, that starts with a char and with the same usually  ' or "
	 */

	function parseString() {
		let startChar = S[pos];
		let startpos = pos + 1;
		pos = S.indexOf(startChar, startpos)
		const str = S.slice(startpos, pos);
		return str;
	}

	let out = null;
	out = parseChildren('');

	return out;
}

export class XMLParser {
	constructor(str) {
		this.str = str;
		this.result = null;
		this.error = null;
		try {
			this.result = parse(this.str);
		}
		catch (err) {
			this.error = err;
		}
	}
}

export class ComponentWebLoader extends ResourceLoader {
	constructor(env) {
		super(env);
	}

	async load(url, ast) {
		console.log(` ${chalk.bold.blueBright('Dep Resolver')} : loading file '${url}'`);
		const str = await readFile(url, { encoding: 'utf-8' });
		return await new Promise((resolve, reject) => {
			console.log(` ${chalk.bold.blueBright('Dep Resolver')} ${chalk.bold.green('Loaded')} : file '${url}' loaded`);
			try {
				const component = new SDML_Component(this.env, url, str, resolve, reject);
			}
			catch (err) {
				reject(err);
			}
		});
	}
}

const SDML_TEMPLATE_BASE =
	`class ComponentBase {
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
`

export class Environment {
	constructor(loaders = {}, opt = {}) {
		this.opt = opt;
		this.uidgen = BigInt(0);
		this.warnings = [];
		this.urlmap = {};
		this.caches = {};
		this.promises = [];
		loaders = { component: ComponentWebLoader, ...Loaders, ...loaders };
		this.loaders = {};
		this.used_templates = new Map();
		this.load_template_name = "$loading";
		this.wait_to_load = new Set();
		this.wait_to_dispose = new Set();
		this.exports = new Map();
		for (let key in loaders) {
			this.loaders[key] = new loaders[key](this);
		}
	}

	is_ResourceType(loader) {
		return this.loaders[loader] !== undefined;
	}

	component(name, url) {
		if (this.urlmap[name] !== undefined) return;
		this.urlmap[name] = url;
		this.caches[url] = null;
		const promise = this.loaders.component.load(url).then((component) => {
			this.caches[url] = component;
			if (component instanceof SDML_Node) {
				component.compile();
			}
		});
		this.promises.push(promise);
	}

	load(loader, url, ast) {
		if (this.caches[url] !== undefined) {
			if (this.caches[url] instanceof Promise) {
				console.log(` ${chalk.bold.blueBright.italic.underline("Environment")} : file '${url}' is already in the loading queue`);
				return this.caches[url];
			}
			else {
				console.log(` ${chalk.bold.blueBright.italic.underline("Environment")} : file '${url}' is already loaded`);
				return Promise.resolve();
			}
		}
		const promise = this.loaders[loader].load(url, ast).then((component) => {
			this.caches[url] = component;
			if (component instanceof SDML_Node) {
				component.compile();
			}
		})
		this.caches[url] = promise;
		return promise;
	}

	onLoaded() {
		return Promise.all(this.promises);
	}

	get(url) {
		return this.caches[url];
	}

	get_ClassName(name) {
		if (name in this.urlmap)
			return this.get(this.urlmap[name]).class_name;
		return undefined;
	}

	add_Template(name, code) {
		this.used_templates.set(name, code);
	}

	add_Export(name, class_name) {
		if (this.exports.has(name)) {
			throw new Error(`duplicated export name '${name}' found`);
		}
		this.exports.set(name, class_name);
	}

	add_WaitToDispose(str) {
		this.wait_to_dispose.add(str);
	}

	add_WaitToLoad(str) {
		this.wait_to_load.add(str);
	}

	get uid() {
		return this.uidgen++;
	}

	generate() {
		const codes = [...this.used_templates.values()];
		return `${SDML_TEMPLATE_BASE}\n${codes.join('\n\n')}`;
	}
}

class SDML_Component extends SDML_Node {
	constructor(env, url, sdml, onready, onreject) {
		super(env);
		this.url = url;
		this.xmlast = {
			flags: true,
			refs: null,
			inputs: null,
			outputs: null,
			type: null,
			slots: null,
			template: null,
			export: null,
		};
		this.flags = {
			static: false,
			export: false,
			"inputs-hint": false,
			strict: false,
		};
		this.sdml = sdml;
		this.urlmap = {};
		this.slots = {};
		this.compile_res = null;
		this.types = null;
		this.onready = onready;
		this.onreject = onreject;
		try {
			this.parse_XML(sdml);
			this.pre_Compile();
			this.collect_Resources();
		}
		catch (err) {
			throw new Error(`${err.message}\nin ${this.url}`);
		}
	}

	set_Ast(type, ast, self) {
		if (this.xmlast[type] === undefined) {
			throw new Error(`entry <${type}/> is not allowed in '${this.url}'`);
		}
		if (this.xmlast[type] === true) {
			this.xmlast[type] = self;
		}
		else if (this.xmlast[type] === null) {
			this.xmlast[type] = ast;
		}
		else {
			throw new Error(`dupilcate entry <${type}/> found in '${this.url}'`);
		}
	}

	parse_XML(sdml) {
		console.log(` ${chalk.bold.yellow('XML Parser')} : parsing xml file '${this.url}'`);
		const xmlparser = new XMLParser(sdml);
		if (xmlparser.error !== null) {
			throw new Error(`${xmlparser.error}`);
		}
		for (let i of xmlparser.result) {
			this.set_Ast(i.tagName, i.children, i);
		}
		console.log(` ${chalk.bold.yellow('XML Parser')} ${chalk.bold.green('Ended')} : file '${this.url}' xml parsing finished`);
	}

	collect_Resources() {
		const refs = this.xmlast.refs ?? [];
		const promises = [];
		refs.forEach(ref => {
			if (!this.env.is_ResourceType(ref.tagName)) throw new Error(`<${ref.tagName} /> sub Resource is not loadable, try remove it from SDML or mount relative loader`);
			if (ref.attributes.url === undefined || ref.attributes.url === '') throw new Error("an SDML Component's sub Resource should always contain url attribute: <resource-type url=\"...\" />");
			if (ref.attributes.id === undefined || ref.attributes.id === '') throw new Error("an SDML Component's sub Resource should always contain id attribute: <resource-type id=\"...\" />");
			const id = ref.attributes.id;
			if (id in ALL_NODE_TYPES) throw new Error(`reserved SDML Component's sub Resource id '${id}' found in\n<refs>\n\t<${ref.tagName} id="${id}" />\n</refs>`);
			if (id in this.urlmap) throw new Error(`duplicate SDML Component's sub Resource id '${id}' found in\n<refs>\n\t<${ref.tagName} id="${id}" />\n</refs>`);
			const url = ref.attributes.url;
			this.urlmap[id] = url;
			promises.push(this.env.load(ref.tagName, url, ref))
		})
		Promise.all(promises).then(() => {
			this.onready(this);
			delete this.onready;
			delete this.onreject;
		}).catch((err) => {
			this.onreject(err);
			delete this.onready;
			delete this.onreject;
		});
	}

	pre_Compile() {
		// console.log(`>>>>> '${this.url}' pre compile`);
		console.log(` ${chalk.bold.magenta('Pre Parser')} : pre parsing file '${this.url}'`);

		console.log(`            : flags`);
		// flags
		if (this.xmlast.flags !== true)
			for (const flag in this.flags) {
				const data = this.xmlast.flags.attributes[flag];
				if (data !== undefined) this.flags[flag] = data ?? true;
			}

		console.log(`            : inputs`);
		// inputs
		const inputs = this.xmlast.inputs ?? [];
		for (let i of inputs) {
			const type = i.tagName;
			const { default: defaultval, name, hint } = i.attributes;
			if (name === undefined) {
				throw new Error(`input does not have a name in\n<inputs>\n\t<${type}/>\n</inputs>\nin ${this.url}`);
			}
			if (!test_IdentifierName(name)) {
				throw new Error(`input's name '${name}' in\n<inputs>\n\t<${type} name="${name}"/>\n</inputs>\nis invalid in ${this.url}`);
			}
			if (type in ALL_INPUTS_TYPES) {
				if (name in this.inputs) {
					throw new Error(`duplcate input found in\n<inputs>\n\t<${type} name="${name}"/>\n</inputs>\nis invalid in ${this.url}`);
				}
				const datatype = ALL_INPUTS_TYPES[type].datatype();
				if (defaultval === undefined) {
					this.inputs[name] = {
						uid: this.env.uid,
						datatype: datatype,
						hint
					}
				}
				else {
					const [code, opt, err] = parse_Constant(defaultval);
					if (err.length > 0) {
						throw new Error(`default value parse error in\n<inputs>\n\t<${type} name="${name}"/>\n</inputs>\nin ${this.url}:\n${err.join('\n\n')}`);
					}
					if (!opt.constant) {
						throw new Error(`default value is not constant in\n<inputs>\n\t<${type} name="${name}"/>\n</inputs>\nin ${this.url}`);
					}
					if (!typeCheck(datatype, opt.datatype)) {
						throw new Error(`default value is type of ${typeToString(opt.datatype)}, not type of ${type} in\n<inputs>\n\t<${type} name="${name}" default="${defaultval}"/>\n</inputs>\nin ${this.url}`);
					}
					this.inputs[name] = {
						uid: this.env.uid,
						default: code,
						datatype: datatype,
						hint
					}
				}
			}
			else {
				throw new Error(`input's type '${type}' in\n<inputs>\n\t<${type} name="${name}"/>\n</inputs>\nis invalid in ${this.url}`);
			}
		}
		if (this.flags.static) {
			if (Object.keys(this.inputs).length > 0) throw new Error(`a static component does not allow usage of inputs:\n<inputs>\n${inputs.map(i => `    <${i.tagName} name="${i.attributes.name}"/>`).join("\n")}\n</inputs>\nwhen <flags static/>`);
		}

		console.log(`            : outputs`);
		// outputs
		const outputs = this.xmlast.outputs ?? [];
		for (let i of outputs) {
			const type = i.tagName;
			const { name, value } = i.attributes;
			if (name === undefined) {
				throw new Error(`output does not have a name in\n<outputs>\n\t<${type}/>\n</outputs>\nin ${this.url}`);
			}
			if (value === undefined) {
				throw new Error(`output does not have a value expression in\n<outputs>\n\t<${type} name="${name}"/>\n</outputs>\nin ${this.url}`);
			}
			if (!test_IdentifierName(name)) {
				throw new Error(`output's name '${name}' in\n<outputs>\n\t<${type} name="${name}"/>\n</outputs>\nis invalid in ${this.url}`);
			}
			if (type in ALL_INPUTS_TYPES) {
				if (name in this.outputs) {
					throw new Error(`duplcate output found in\n<outputs>\n\t<${type} name="${name}"/>\n</outputs>\nis invalid in ${this.url}`);
				}
				else {
					this.outputs[name] = {
						uid: this.env.uid,
						datatype: ALL_INPUTS_TYPES[type].datatype(),
						str: value,
					}
				}
			}
			else {
				throw new Error(`output's type '${type}' in\n<outputs>\n\t<${type} name="${name}"/>\n</outputs>\nis invalid in ${this.url}`);
			}
		}

		console.log(`            : slots`);
		// slots
		const slots = this.xmlast.slots ?? [];
		for (let i of slots) {
			const name = i.tagName;
			if (!test_IdentifierName(name)) {
				throw new Error(`slot's name '${name}' in\n<slots>\n\t<${name}/>\n</slots>\nis invalid in ${this.url}`);
			}
			if (name in this.slots) {
				throw new Error(`duplcate slot found in\n<slots>\n\t<${name}/>\n</slots>\nis invalid in ${this.url}`);
			}
			if (name in ALL_INPUTS_TYPES || name in this.urlmap) {
				throw new Error(`reserved tagName '${name}' found in\n<refs>\n\t<${ref.tagName} id="${id}" />\n</refs>\nin ${this.url}`);
			}
			else {
				const slot = new Types();
				for (let t of i.children) {
					const type = t.tagName;
					const { count } = t.attributes;
					if (count === undefined) {
						slot.merge_TypesLocal(new Types({ [type]: Infinity }));
					}
					else if (test_Number(count)) {
						slot.merge_TypesLocal(new Types({ [type]: parseInt(count) }));
					}
					else {
						throw new Error(`slot's type's count '${count}' in\n<slots>\n\t<${name}>\n\t\t<${type} count="${count}"/>\n\t</${name}></slots>\nis invalid in ${this.url}`)
					}
				}
				this.slots[name] = { types: slot };
			}
		}

		console.log(` ${chalk.bold.magenta('Pre Parser')} ${chalk.bold.green('Ended')} : file '${this.url}' pre parsing finished`);
		// console.log(this.inputs, this.outputs);
	}

	compile() {
		//flags
		let class_name = this.class_name
		if (this.flags.static) class_name = `component_StaticComponent_${this.uid}`;
		// template types
		if (this.xmlast.type === null) {
			// self check
			const templates = this.xmlast.template ?? [];
			const type = new Types();
			for (let i of templates) {
				const name = i.tagName;
				let cut_type = null;
				if (name in ALL_NODE_TYPES) {
					const sub_type = ALL_NODE_TYPES[name].type ?? ALL_NODE_TYPES[name].get_OutputsTypes(i);
					if (sub_type === Types.NONE || sub_type === undefined) {
						throw new Error(`type of node <${name}/> can not but directly resolved in\n<template>\n\t<${name}/>\n</template>\nin ${this.url}\nyou may want to use <type/> entry to define component's type explicitly, so the type check pass will be delayed after compiled the whole component`);
					}
					cut_type = sub_type;
				}
				else if (name in this.urlmap) {
					const subcom = this.env.get(this.urlmap[name]);
					if (subcom === null) {
						throw new Error(`possible circular refs found in ${this.url} when referencing ${this.urlmap[name]} as ${name}`);
					}
					cut_type = subcom.types.clone();
				}
				else {
					throw new Error(`type of node <${name}/> can not but directly resolved in\n<template>\n\t<${name}/>\n</template>\nin ${this.url}\nyou may want to use <type/> entry to define component's type explicitly`);
				}
				type.merge_TypesLocal(cut_type);
			}
			this.types = type;
		}
		else {
			// use def type
			const types = this.xmlast.type ?? [];
			const type = new Types();
			for (let i of types) {
				const name = i.tagName;
				const { count } = i.attributes;
				if (count === undefined) {
					type.merge_TypesLocal(new Types({ [name]: Infinity }));
				}
				else if (test_Number(count)) {
					type.merge_TypesLocal(new Types({ [name]: parseInt(count) }));
				}
				else {
					throw new Error(`type's count '${count}' in\n<type>\n\t<${name} count="${count}"/>\n</type>\nis invalid in ${this.url}`)
				}
			}
			this.types = type;
		}
		try {
			console.log(` ${chalk.bold.redBright('Component Parsing')} : file '${this.url}' parsing`);
			this.compile_res = new SDML_Compile_Scope(this.env, this.urlmap, this.xmlast.template, this.inputs, this.outputs, this.slots, null, {});
			if (!this.types.match_Types(this.compile_res.types, false, true)) {
				throw new Error(`types do not match:\nthe desired types are:\n${this.types.to_List().map(i => `* ${i}`).join("\n")}\nbut the compiled results are:\n${this.compile_res.types.to_List().map(i => `* ${i}`).join("\n")}`);
			}
			this.types = this.compile_res.types;
			{
				const all_types = this.types.type_names;
				const type_maps = [];
				for (let i = 0; i < all_types.length - 1; i++) {
					for (let j = i + 1; j < all_types.length; j++) {
						const it = all_types[i];
						const jt = all_types[j];
						if (TypesManagerSingleton.instance_of(it, jt))
							type_maps.push(`${it} -> ${jt}`);
						else if (TypesManagerSingleton.instance_of(jt, it))
							type_maps.push(`${jt} -> ${it}`);
					}
				}
				if (type_maps.length > 0) {
					const err = new Error(`the types of the component '${this.url}' are:\n${this.types.to_List().map(i => `	${i}`).join('\n')}\nwhich can be map to some same types:\n${type_maps.map(i => `	${i}`).join('\n')}\nthis may cause ordering issues when using the component, because the sdmlc can not help you auto-cast/reorder the nodes in a component defination\nmore hint:\n	1. you should always use the component to output a single result or at least only one result of one specific type\n	2. if you know what you are doing, you may ignore this warning`);
					if (this.flags.strict) {
						throw err;
					}
					else
						this.env.warnings.push(err);
				}

			}
			// const mermaid = this.compile_res.to_Mermaid();
			// render_Graph(mermaid).then(svg => {
			//     console.log(`Graph Preview: ${this.url}\n\t%c %c`, `border: black 1px solid; background: url("data:image/svg+xml;base64,${btoa(svg)}") no-repeat center; padding: 180px 280px; background-size: contain;`, "");
			// })
			console.log(` ${chalk.bold.redBright('Component Parsing')} ${chalk.bold.green('Ended')} : file '${this.url}' parsing finished`);
			console.log(` ${chalk.bold.cyanBright('Component CodeGen')} : file '${this.url}' code generating`);
			const codegen = new SDML_Compile_CodeGen(this.env, class_name, this.compile_res, { ...this.env.opt, inputs_sign: this.flags["inputs-hint"] });
			const code = codegen.generate();
			this.env.add_Template(class_name, code);
			if (this.flags.static) {
				this.env.add_Template(this.class_name, `var ${this.class_name} = null;`);
				this.env.add_Template(`${this.class_name}_load`, `${this.env.load_template_name}.push(new Promise((s, r)=>{Promise.all([...${this.env.load_template_name}]).then(()=>{${this.class_name} = new ${class_name}(); s();})}));`);
			}
			if (!(this.flags.export === false)) {
				if (!test_IdentifierName(this.flags.export)) {
					throw new Error(`export name '${this.flags.export}' is not a valid identifier name`);
				}
				else {
					this.env.add_Export(this.flags.export, this.class_name);
				}
			}
			console.log(` ${chalk.bold.cyanBright('Component CodeGen')} ${chalk.bold.green('Ended')} : file '${this.url}' code generating finished`);
		}
		catch (err) {
			// console.log(err);
			throw new Error(`${err.message}\nin ${this.url}`);
		}
	}

	get_Entries() {
		return Object.keys(this.slots);
	}

	get_InputsTypes() {
		const slots = {};
		for (const slot in this.slots) {
			slots[slot] = this.slots[slot].types;
		}
		return {
			default: {
				default: new Types(),
				...slots
			}
		};
	}

	get_ExportsTypes() {
		const map = {};
		for (const name in this.outputs) {
			map[name] = this.outputs[name].datatype;
		}
		return map;
	}

	get_SDMLNodeInstance(scope, name, id, parent, ast) {
		return new SDML_ComponentNode(scope, name, id, parent, ast, this);
	}

	summary() {
		const inputs = [];
		for (let key in this.inputs) {
			inputs.push(`${typeToString(this.inputs[key].datatype)} ${key} = ${this.inputs[key].default} uid: ${this.inputs[key].uid}`)
		}
		const outputs = [];
		for (let key in this.outputs) {
			outputs.push(`${typeToString(this.outputs[key].datatype)} ${key} uid: ${this.outputs[key].uid}`)
		}
		const type = [];
		for (let item of this.types.to_List()) {
			type.push(item);
		}
		return `>| component_${this.uid.toString()} url: ${this.url}
>| inputs:${inputs.map(i => `\n * ${i}`).join("")}
>| outputs:${outputs.map(i => `\n * ${i}`).join("")}
>| type:${type.map(i => `\n * ${i}`).join("")}`;
	}
}

// SDML Compiler
export class SDML_Compile_Error extends Error {
	constructor(msg) {
		super(msg);
		this.name = "SDML_Compile_Error";
	}
}

export class SDML_Compile_Warning extends Error {
	constructor(msg) {
		super(msg);
		this.name = "SDML_Compile_Warning";
	}
}

function check_Params(params, params_templates, type_maps = [], reduced_types = {}) {
	// console.log(">>> check types!!", params, params_templates);
	const params_names = new Set(Object.keys(params));
	for (const key in params_templates) {
		if (!params_names.has(key)) return false;
		const extends_map = [];
		reduced_types[key] = {};
		if (!params[key].match_Types(params_templates[key], true, undefined, extends_map, reduced_types[key])) return false;
		params_names.delete(key);
		type_maps.push({ param: key, extends_map: extends_map });
	}
	if (params_names.size > 0) return false;
	return true;
}

export function get_ParamsString(params, arr) {
	// debugger
	const ans = [];
	for (const param_name in params) {
		if (param_name === 'default') {
			if (params.default.is_Empty()) ans.push("(empty)");
			else
				ans.push(...params.default.to_List());
		}
		else {
			ans.push(`<${param_name}>`);
			if (params[param_name].is_Empty()) ans.push("\t(empty)");
			else
				ans.push(...params[param_name].to_List().map(i => `\t${i}`));
			ans.push(`</${param_name}>`);
		}
	}
	return arr ? ans : ans.join("\n");
}

export class SDML_Compile_Scope {
	constructor(env, urlmap, template, inputs, outputs, slots, parent = null, opt) {
		this.env = env;
		this.uid = env.uid;
		this.urlmap = urlmap;
		this.nodemap = {};
		this.template = template.map((i, idx) => { return { ...i, key: idx } });
		this.opt = opt;
		this.inputs = inputs ?? {};
		this.outputs = outputs ?? {};
		this.slots = slots ?? {};
		for (const slot in this.slots) {
			this.slots[slot].used = false;
		}
		this.parent = parent;
		this.graph = new DepGraph();
		this.order = [];
		this.types = null;
		this.collection = null;
		this.inputs_type = this.get_InputsTypes();
		this.nodes_type = {};
		this.param_link = [];
		this.scope_deps = new Set();
		this.compile();
	}

	new_Scope(template, additional_inputs = {}, keep_slots = false, parent = this) {
		const scope = new SDML_Compile_Scope(this.env, this.urlmap, template, { ...this.inputs, ...additional_inputs }, null, keep_slots ? this.slots : {}, parent, this.opt);
		return scope;
	}

	registe_Node(id, node) {
		if (id === undefined) id = `$node_${this.env.uid}`;
		if (id in this.nodemap) {
			throw new SDML_Compile_Error(`dupicate id ${id} found`);
		}
		this.nodemap[id] = node;
		this.graph.add_Node(node);
	}

	check_Valid(nodename) {
		if (nodename in ALL_NODE_TYPES) {
			return true;
		}
		if (nodename in this.urlmap) {
			return true
		}
		return false;
	}

	get_TartgetInputs(nodename, ast) {
		if (nodename in ALL_NODE_TYPES) {
			return ALL_NODE_TYPES[nodename].get_InputsTypes(ast) ?? ALL_NODE_TYPES[nodename].inputs;
		}
		if (nodename in this.urlmap) {
			const node = this.env.get(this.urlmap[nodename]);
			return node.get_InputsTypes();
		}
	}

	get_TargetEntries(nodename) {
		if (nodename in ALL_NODE_TYPES) {
			return ALL_NODE_TYPES[nodename].entries;
		}
		if (nodename in this.urlmap) {
			const node = this.env.get(this.urlmap[nodename]);
			return node.get_Entries();
		}
	}

	get_TargetExports(nodename, ast) {
		if (nodename in ALL_NODE_TYPES) {
			return ALL_NODE_TYPES[nodename].get_ExportsTypes(ast) ?? ALL_NODE_TYPES[nodename].exports;
		}
		if (nodename in this.urlmap) {
			const node = this.env.get(this.urlmap[nodename]);
			return node.get_ExportsTypes();
		}
	}

	get_NodeInstance(id, tagName, parent = null, ast, key) {
		if (tagName in ALL_NODE_TYPES) {
			return new ALL_NODE_TYPES[tagName](this, tagName, id, parent, ast);
		}
		if (tagName in this.urlmap) {
			const component = this.env.get(this.urlmap[tagName]);
			return component.get_SDMLNodeInstance(this, tagName, id, parent, ast);
		}
	}
	/**
	 * walk method
	 * 1. recersive walk down
	 * 
	 */

	walk(nodes = [], param = 'default', parent = null) {
		const types = new Types();
		const collection = new Collection();
		for (const n of nodes) {
			const name = n.tagName;
			const key = n.key ?? 0;
			const { id = `$node_${this.env.uid}` } = n.attributes;
			// check valid
			if (!this.check_Valid(name)) {
				throw new SDML_Compile_Error(`<${name}/> is not a valid nodes that can be found in base-nodes or ref-nodes or slots instance`);
			}
			// get desire type and all entries
			let target_inputs = this.get_TartgetInputs(name, n);
			const target_entries = this.get_TargetEntries(name);
			// console.log(`${name} id:${id}`, ">>>> require", target_inputs, target_entries);
			// check types
			// if target_types is null
			if (target_inputs === Types.NONE) {
				if (n.children.length > 0) {
					throw new SDML_Compile_Error(`<${name}/> should not have any sub nodes:\n<${name}>${n.children.map(i => `\n\t<${i.tagName}>...</${i.tagName}>`).join("")}\n</${name}>`);
				}
				else {
					const child = this.get_NodeInstance(id, name, parent, n);
					child.$$key = key;
					this.registe_Node(id, child);
					child.add_ToCollection(collection, param);
					types.merge_TypesLocal(child.get_Type());
				}
			}
			else if (target_inputs === Types.IGNORE) {
				const child = this.get_NodeInstance(id, name, parent, n);
				child.$$key = key;
				this.registe_Node(id, child);
				child.add_ToCollection(collection, param);
				types.merge_TypesLocal(child.get_Type());
			}
			else {
				// collect params
				const params = { default: [] };
				target_entries.forEach(e => { params[e] = [] });
				function set_params(name, subs) {
					params[name].push(...subs);
				}
				// console.log(n)
				for (const child of n.children) {
					const child_name = child.tagName;
					const valid = this.check_Valid(child_name);
					const is_entry = target_entries.includes(child_name);
					let { param } = child.attributes;
					param = param !== undefined;
					if (valid && is_entry) {
						if (param) set_params(child_name, child.children);
						else {
							throw new SDML_Compile_Error(`<${child_name}/> is ambiguous which can be resolved either a node or and a parameter label in:\n<${name}>\n\t<${child_name}/>\n</${name}>\nyou can use a 'param' flag to specify it's purpose like: <${child_name} param/>`)
						}
					}
					else if (is_entry) {
						set_params(child_name, child.children);
					}
					else {
						set_params('default', [child]);
					}
				}

				// keyed
				for (const param in params) {
					params[param] = params[param].map((i, idx) => { return { ...i, key: idx } });
				}

				const children_collection = new Collection();
				const children_types = {};
				for (const key in params) {
					const nodes = params[key];
					// debugger
					const { types: sub_type, collection: sub_collection } = this.walk(nodes, key, n);
					children_collection.merge_Local(sub_collection);
					children_types[key] = sub_type;
				}
				if (target_inputs === Types.ANY) target_inputs = { default: children_types };
				// console.log(children_types, children_collection, target_inputs);
				// check types
				let match_params = null;
				let type_maps = [];
				let reduced_types = {};
				for (const template_name in target_inputs) {
					const template = { ...target_inputs[template_name] };
					for (const template_name of target_entries) {
						if (!(template_name in template)) template[template_name] = new Types();
					}
					const _type_maps = [];
					const _reduced_types = {};
					const matched = check_Params(children_types, template, _type_maps, _reduced_types);
					// console.log(template_name, matched);
					if (matched) {
						reduced_types = _reduced_types;
						match_params = template_name;
						type_maps = _type_maps;
						break;
					}
				}
				if (match_params === null) {
					const expect_types = [];
					let i = 1;
					for (const types in target_inputs) {
						expect_types.push(`${i}. ${types}:\n< >\n${get_ParamsString(target_inputs[types], true).map(i => `\t${i}`).join("\n")}\n</>`);
						i++;
					}
					throw new SDML_Compile_Error(`type check fail in <${name}/>\ncurrent sub types:\n<${name}>\n${get_ParamsString(children_types, true).map(i => `\t${i}`).join("\n")}\n<${name}/>\nexpect sub types:\n${expect_types.join("\n")}`);
				}

				const extends_collection = new Collection();
				const all_children = new Set();
				for (const { param, extends_map } of type_maps) {
					const param_collection = children_collection.get(param);
					// console.log(param, extends_map);
					for (const { target, subtypes } of extends_map) {
						const ans = new Set();
						for (const sub_type of subtypes) {
							param_collection[sub_type].forEach(n => {
								n.types_maps[sub_type] = target;
								all_children.add(n);
								ans.add(n);
							})
						}
						const sorted = [...ans].sort((a, b) => a.$$key - b.$$key);
						extends_collection.set(param, target, sorted);
					}
				}

				all_children.forEach(n => {
					n.after_TypeMapped();
				})

				// console.log(extends_collection.collection?.default.curve)

				const child = this.get_NodeInstance(id, name, parent, n);
				child.$$key = key;
				this.registe_Node(id, child);
				child.receive_Sub(children_types, extends_collection, match_params, reduced_types);
				child.add_ToCollection(collection, param);
				types.merge_TypesLocal(child.get_Type());
			}
		}
		return { types, collection };
	}

	get_InputsTypes() {
		const inputs = {};
		for (const key in this.inputs) {
			inputs[key] = this.inputs[key].datatype;
		}
		return inputs;
	}

	registe_NodeRefs(node, nodeset) {
		nodeset.forEach(id => {
			this.graph.add_Edge(this.nodemap[id], node);
			this.param_link.push(`Node_${this.nodemap[id].uid} --> |param| Node_${node.uid}`);
		})
	}

	registe_Deps(deps) {
		deps.forEach(i => {
			this.scope_deps.add(i);
		})
	}

	collect_Exports(ast) {
		for (const node of ast) {
			const vaild = this.check_Valid(node.tagName);
			if (vaild) {
				const { id } = node.attributes;
				if (id !== undefined) {
					if (!test_IdentifierName(id)) throw new SDML_Compile_Error(`id is not a valid identifier string in node <${node.tagName} id="${id}"/>`);
					this.nodes_type[id] = this.get_TargetExports(node.tagName, node) ?? {};
				}
			}
			this.collect_Exports(node.children);
		}
	}

	parse_Outputs() {
		if (this.outputs === null) return;
		for (const output in this.outputs) {
			const map = this.outputs[output];
			const [exp_code, exp_opt, exp_err] = parse_Expression(map.str, `${this.uis}_export_${output}`, this.inputs_type, this.nodes_type);
			if (exp_code === null) {
				throw new SDML_Compile_Error(`compiling output '${output}' failed in <output ${output}="${map.str}"/>, here are the error messages from the expression compile sub-module:\n${exp_err.join("\n\n")}`);
			}
			else if (!typeCheck(map.datatype, exp_opt.datatype)) {
				throw new SDML_Compile_Error(`type-checking output '${output}' failed in <output test="${map.str}"/>, here are the current types:\nrequired: ${typeToString(map.datatype)}\nbut has: ${typeToString(exp_opt.datatype)}`);
			}
			else {
				map.code = exp_code;
				map.opt = exp_opt;
				this.registe_Deps(map.opt.deps);
			}
		}
	}

	compile() {
		this.collect_Exports(this.template);
		this.parse_Outputs();
		const { types, collection } = this.walk(this.template);
		this.types = types;
		this.collection = collection;
		for (const id in this.nodemap) {
			const node = this.nodemap[id];
			this.registe_NodeRefs(node, node.noderefs);
			this.registe_Deps(node.deps);
		}
		try {
			this.order = this.graph.get_TopologicalOrder();
		}
		catch (err) {
			// render_Graph(err.graph).then(svg => {
			// 	console.error(`${err.to_String()}\nGraph Preview:\n\t%c %c`, `border: black 1px solid; background: url("data:image/svg+xml;base64,${btoa(svg)}") no-repeat center; padding: 180px 180px; background-size: contain;`, "");
			// })
			throw new SDML_Compile_Error(`${err.msg}, the err graph is as followed:\n${err.map}`);
			console.log(err);
		}
		return { types, collection };
	}

	reduce_CollectionAndTypes(map) {
		const collection = new Collection();
		const param = 'default';
		const _collection = this.collection.get(param);
		const types = Object.keys(_collection);
		const obj = {};
		for (const type of types) {
			obj[map[type] ?? type] = new Set();
		}
		for (const type of types) {
			if (map[type] === undefined) {
				obj[type] = _collection[type];
			}
			else {
				const _type = map[type];
				_collection[type].forEach(n => {
					obj[_type].add(n);
				})
			}
		}
		for (const type in obj) {
			const sorted = [...obj[type]].sort((a, b) => a.$$key - b.$$key);
			collection.set(param, type, sorted);
		}
		const type = {};
		const type_names = this.types.type_names;
		for (const t of type_names) {
			type[map[t] ?? t] = 0
		}
		for (const t of type_names) {
			if (map[t] === undefined) type[t] += this.types.get_Count(t);
			else type[map[t]] += this.types.get_Count(t);
		}
		return [collection, new Types(type)]
	}

	to_Mermaid() {
		const [nodes, links] = this.$to_Mermaid();
		return `graph LR\n${nodes}\n${[...links, ...this.param_link].join("\n")}`;
	}

	$to_Mermaid(ans = [], link = []) {
		const inputs = [];
		for (const input in this.inputs) {
			let flag = true;
			let _last = this;
			let cnt = this;
			while (true) {
				if (cnt === null) break;
				if (cnt.parent === null || !(input in cnt.parent.inputs));
				else {
					flag = false;
					if (cnt.parent === null) _last = cnt;
					else _last = cnt.parent;
					break;
				}
				cnt = cnt.parent;
			}
			if (flag)
				inputs.push(`Input_${input}_${_last.uid}((${input}))`);
		}
		for (const id in this.nodemap) {
			const node = this.nodemap[id];
			const deps = node.deps;
			deps.forEach(input => {
				let _last = this;
				let cnt = this;
				while (true) {
					// console.log(cnt, _last, input)
					if (cnt.parent === null) {
						_last = cnt;
						break;
					} else if (!(input in cnt.parent.inputs)) {
						break;
					}
					_last = cnt;
					cnt = cnt.parent;
				}
				link.push(`Input_${input}_${cnt.uid} --> |dep| Node_${node.uid}`)
			});
		}

		for (const slot in this.slots) {
			if (!this.parent || !(slot in this.parent.slots))
				inputs.push(`Slot_${slot}>${slot}]`)
		}
		for (const key in this.nodemap) {
			const node = this.nodemap[key];
			node.to_Mermaid(ans, link);
		}
		return [`${[...inputs, ...ans].join('\n')}`, link];
	}
}

export function create_Component(class_name,
	default_inputs = [],
	bit_masks = 0,
	nodes_decl = [],
	params_decl = [],
	init = [],
	diff = [],
	result,
	nodes_dispose = [],
	refs = [],
	updates = [],
	inputs_sign = null) {
	const bitmasks = [];
	for (let i = 0; i < bit_masks; i++) {
		bitmasks.push('0');
	}
	return `class ${class_name} extends ComponentBase {
	constructor(i = {}, c, s) {
		super({${default_inputs.join(', ')}${default_inputs.length === 0 ? '' : ', '}...i}, [${bitmasks.join(', ')}]);
		this.r = null;${nodes_decl.map(s => `\n\t\t${s}`).join('')}${params_decl.map(s => `\n\t\t${s}`).join('')}
		this.init(c, s);
	}
	init(c, s) {${init.map(s => `\n\t\t${s}`).join('')}${result === undefined ? '' : `\n		this.r = ${result};`}
	}
	diff(i) {
		this.b = [${bitmasks.join(', ')}];${diff.map(s => `\n\t\t${s}`).join('')}
	}
	update(i, c, s) {
		this.diff(i);${updates.map(s => `\n\t\t${s}`).join('')}
	}
	dispose() {${nodes_dispose.map(s => `\n\t\t${s}`).join('')}
		// console.log(">>>> dispose ${class_name}");
	}
	ref(id) {
		switch (id) { ${refs.map(([id, cache]) => `\n\t\t\tcase '${id}': return this.${cache};`).join('')}
		}
	}${inputs_sign === null ? '' : `\n	static INPUTS = ${inputs_sign};`}
}`
}

export class SDML_Compile_CodeGen {
	constructor(env, class_name, scope, opt) {
		this.opt = { for_diff: true, if_branch_cache: false, inline_contanst_exp: false, inputs_sign: false, types_maps: null, reduced_collection: null, ...opt };
		this.env = env;
		this.class_name = class_name;
		this.scope = scope;
		this.nodes = new Map();
		this.params = new Map();
		this.noderefs = new Set();
		this.nodemap = {};
		this.bitmasks = null;
	}

	get_NodeCache(node) {
		return this.nodes.get(node);
	}

	get_NodeCache_with_ID(id) {
		const node = this.scope.nodemap[id];
		return this.get_NodeCache(node);
	}

	get_NodeParamCache(node, param) {
		return this.params.get(node)?.[param];
	}

	registe_Template(template) {
		const { name, code } = template;
		this.env.add_Template(name, code);
		return name;
	}

	get_DefaultInputs(inputs = undefined) {
		if (inputs) {
			const arr = [];
			const map = this.scope.inputs;
			for (const param of inputs) {
				arr.push(`${param}: ${map[param]?.default ?? 'null'}`);
			}
			return arr;
		}
		else {
			const arr = [];
			const deps = [...this.scope.scope_deps];
			const map = this.scope.inputs;
			for (const param of deps) {
				arr.push(`${param}: ${map[param].default ?? 'null'}`);
			}
			return arr;
		}
	}

	get_InputsSign() {
		const arr = [];
		const deps = [...this.scope.scope_deps];
		const map = this.scope.inputs;
		for (const param of deps) {
			arr.push(`${param}: {datatype: '${typeToString(map[param].datatype)}', default: ${map[param].default ?? 'null'}, hint: ${map[param].hint ?? "null"}}`);
		}
		return `{${arr.join(', ')}}`;
	}

	get_NodesDeclaration() {
		const ans = [];
		this.nodes.forEach((val, key) => {
			ans.push(`this.${val} = null;`)
		})
		return ans;
	}

	get_ParamsDeclaration() {
		const ans = [];
		this.params.forEach((val, key) => {
			for (const param in val) {
				if (this.opt.inline_contanst_exp && key.params[param].opt.constant);
				else
					ans.push(`this.${val[param]} = null;`);
			}
		})
		return ans;
	}

	get_Refs() {
		return [...this.noderefs].map(id => [id, this.get_NodeCache_with_ID(id)]);
	}

	get_Diffs() {
		const ans = [];
		const bitmasks = [];
		for (let i = 0; i < this.bitmasks.mask_count; i++) {
			bitmasks.push('0');
		}
		// ans.push(`this.b = [${bitmasks.join(', ')}];`);
		for (const dep of this.scope.scope_deps) {
			const datatype = this.scope.inputs[dep].datatype;
			let diff = `i.${dep} !== this.i.${dep}`;
			if (datatype.datatype === 'base') {
				diff = ALL_INPUTS_TYPES?.[datatype.value]?.diff?.(dep) ?? diff;
			}
			ans.push(`if (i.${dep} !== undefined && ${diff}) {`);
			const arr = this.bitmasks.get_Masks([dep]);
			for (const [idx, mask] of arr) {
				ans.push(`	this.i.${dep} = i.${dep};`);
				ans.push(`	this.b[${idx}] |= ${mask};`);
			}
			ans.push(`}`);
		}
		return ans;
	}

	get_Init() {
		const ans = [];
		for (const node of this.scope.order) {
			const nodename = this.get_NodeCache(node);
			const obj_name = node.get_NewNode(this);
			const custom_init = node.get_CustomInit(this, nodename);
			// param init
			const params = this.params.get(node)
			for (const param in params) {
				if (this.opt.inline_contanst_exp && node.params[param].opt.constant);
				else
					ans.push(`this.${params[param]} = ${node.params[param].code};`);
			}

			if (custom_init !== null)
				ans.push(`this.${nodename} = ${custom_init};`)
			else
				ans.push(`this.${nodename} = new ${obj_name}(${this.get_NodeInputs(node)}, ${this.get_NodeChildren(node)}, ${this.get_NodeSlots(node, true)});`)
		}
		return ans;
	}

	get_ReducedType(node, target_type, origin_collection, types_maps) {
		if (node.auto_reduced) return target_type;
		const could_contain = [];
		for (const key in types_maps) {
			if (types_maps[key] === target_type) could_contain.push(key);
		}
		const type_set = new Set();
		for (const t of could_contain) {
			if (origin_collection?.[t]?.has(node) ?? false) {
				type_set.add(t);
			}
		}
		if (type_set.size === 0) {
			return null;
		}
		if (type_set.size > 1) {
			throw new Error(`multiple reduce source types appeared when try to reduce <${node.name} id="${node.id}" /> to parent type '${target_type}'\nthis node provides:\n${[...type_set].map(i => `	${i}`).join('\n')}\nwhich can not be easily reduced to a single type '${target_type}', because it may cause ordering issues`);
		}
		return [...type_set][0];
	}

	get_TypedResult(children, type) {
		const nodes_arr = [];
		for (const node of children[type]) {
			const node_name = this.get_NodeCache(node);
			if (this.opt.types_maps === null)
				nodes_arr.push(`...this.${node_name}.r.n.${type}`);
			else {
				const new_type = this.get_ReducedType(node, type, this.scope.collection.get('default'), this.opt.types_maps);
				if (new_type !== null)
					nodes_arr.push(`...this.${node_name}.r.n.${new_type}`);
				else
					nodes_arr.push(`...this.${node_name}.r.n.${type}`);
			}
		}
		return nodes_arr;
	}

	get_Result() {
		const collection = (this.opt.reduced_collection ?? this.scope.collection).get('default');
		const arr = [];
		for (const type in collection) {
			const nodes_arr = this.get_TypedResult(collection, type);
			arr.push(`${type}: [${nodes_arr.join(', ')}]`);
		}
		const arr2 = [];
		for (const output in this.scope.outputs) {
			const map = this.scope.outputs[output];
			arr2.push(`${output}: ${map.code}`);
		}
		return `{n:{${arr.join(', ')}}, e:{${arr2.join(', ')}}}`
	}

	get_NodeInputs(node) {
		const arr = [];
		const map = this.params.get(node);
		const custom_inputs = node.get_CustomInputs();
		for (const param in custom_inputs) {
			const input = custom_inputs[param];
			arr.push(`${param}: ${input.code}`);
		}
		for (const param in map) {
			if (this.opt.inline_contanst_exp && node.params[param].opt.constant)
				arr.push(`${param}: ${node.params[param].code}`);
			else
				arr.push(`${param}: this.${map[param]}`);
		}
		return `{${arr.join(', ')}}`;
	}

	get_NodeChildren(node) {
		// debugger
		const children_template = node.get_NodeChildren(this);
		const arr = [];
		// console.log(node.name, children_template.default)
		for (const param in children_template) {
			const params = children_template[param];
			const types_arr = [];
			for (const type in params) {
				const subs_arr = params[type].map(subs => {
					const { node, type: subtype } = subs;
					const node_name = this.get_NodeCache(node);
					const custom_get = node.get_CustomChildrenParam(node_name, subtype);
					if (custom_get !== null) {
						return custom_get;
					}
					return `...this.${node_name}.r.n.${subtype}`;
				})
				types_arr.push(`${type}: [${subs_arr.join(', ')}]`);
			}
			arr.push(`${param}: {${types_arr.join(', ')}}`)
		}
		return `{${arr.join(', ')}}`;
	}

	get_NodeSlots(node, init = false) {
		const slots_template = node.get_NodeSlots(this);
		const arr = [];
		for (const param in slots_template) {
			const refs_nodes = new Set();
			const params = slots_template[param];
			const types_arr = [];
			for (const type in params) {
				const subs_arr = params[type].map(subs => {
					const { node, type: subtype } = subs;
					const node_name = this.get_NodeCache(node);
					refs_nodes.add(node_name);
					return `...this.${node_name}.r.n.${subtype}`;
				})

				types_arr.push(`${type}: [${subs_arr.join(', ')}]`);
			}
			const bitmasks = this.bitmasks.get_Masks([...refs_nodes].map(n => this.get_MaskedName(n)));
			const bitmask_test = bitmasks.map(([layer, mask], idx, arr) => {
				const len = arr.length === 1;
				return `${len ? '' : '('}this.b[${layer}] & /* ${[...refs_nodes]} */ ${mask}${len ? '' : ')'}`;
			});
			if (init)
				arr.push(`${param}: {${types_arr.join(', ')}}`);
			else
				arr.push(`${param}: (${bitmask_test.join(" || ")}) ? {${types_arr.join(', ')}} : null`);
		}
		return `{${arr.join(', ')}}`;
	}

	get_NodeUpdate(node) {
		const node_name = this.get_NodeCache(node);
		const custom_update = node.get_CustomUpdate(this, node_name);
		if (custom_update !== null) return custom_update;
		const ans = [];
		// console.log(node);
		// console.group(node_name);

		const [[n_layer, n_mask]] = this.bitmasks.get_Masks([this.get_MaskedName(node_name)]);
		// console.log(`layer: ${n_layer}, mask: ${n_mask}`);

		const params = this.params.get(node);
		// param update
		const param_updates = [];
		for (const param in params) {
			if (this.opt.inline_contanst_exp && node.params[param].opt.constant) continue;
			const masks = [];
			const param_name = params[param];
			const [[p_layer, p_mask]] = this.bitmasks.get_Masks([this.get_MaskedName(param_name)]);
			{
				const masked_deps = [...node.params[param].opt.deps];
				const bitmasks = this.bitmasks.get_Masks(masked_deps);
				masks.push(...bitmasks.map(([layer, mask], idx, arr) => {
					const len = arr.length === 1;
					return `${len ? '' : '('}this.b[${layer}] & /* ${masked_deps} */ ${mask}${len ? '' : ')'}`;
				}));
			}
			{
				const masked_deps = [...node.params[param].opt.ids].map(i => this.get_MaskedName(this.get_NodeCache_with_ID(i)));
				const bitmasks = this.bitmasks.get_Masks(masked_deps);
				masks.push(...bitmasks.map(([layer, mask], idx, arr) => {
					const len = arr.length === 1;
					return `${len ? '' : '('}this.b[${layer}] & /* ${masked_deps} */ ${mask}${len ? '' : ')'}`;
				}));
			}
			if (masks.length > 0) {
				const sp_masks = node.bitmasks.get_Masks([param])
				param_updates.push(`if (${masks.join(" || ")}) {`, `	this.${param_name} = ${node.params[param].code};`, `	this.b[${p_layer}] |= ${p_mask};`,
					// `	// ${node.name} - param : ${param} is component : ${node instanceof SDML_ComponentNode} bitmasks : ${node.bitmasks.inputs} this.${this.get_NodeCache(node)}.b[${sp_layer}] |= ${sp_mask};`,
					...(sp_masks.length === 0 || !node.auto_bitmasks ? [] : [`	this.${this.get_NodeCache(node)}.b[${sp_masks[0][0]}] |= ${sp_masks[0][1]};`]),
					// debug
					// `	console.log(">> update ${node.name} uid: ${node.uid} - ${param}", this.b[${p_layer}]);`,
					`}`)
			}
		}
		// console.log(node.name, param_updates.join('\n'));
		ans.push(...param_updates);

		// param init
		const masked_params = param_updates.length === 0 ? [] : Object.entries(params).filter(([name, cachename]) => !this.opt.inline_contanst_exp || !node.params[name].opt.constant).map(([n, c]) => c).map(i => this.get_MaskedName(i));
		const params_templates = node.get_ScopedInputs(this);
		const children_template = node.get_NodeChildren(this);
		const slots_template = node.get_NodeSlots(this);
		const children = Object.values(children_template).map(i => Object.values(i)).flat(2).map(({ node }) => this.get_MaskedName(this.get_NodeCache(node)));
		const slots = Object.values(slots_template).map(i => Object.values(i)).flat(2).map(({ node }) => this.get_MaskedName(this.get_NodeCache(node)));
		masked_params.push(...children, ...slots, ...params_templates);
		const bitmasks = this.bitmasks.get_Masks(masked_params);
		const if_test = bitmasks.map(([layer, mask], idx, arr) => {
			const len = arr.length === 1;
			return `${len ? '' : '('}this.b[${layer}] & /* ${masked_params} */ ${mask}${len ? '' : ')'}`;
		});
		if (if_test.length > 0) {
			const node_name = this.get_NodeCache(node);
			// const [[c_layer = 0, c_mask = 0]] = node.bitmasks.get_Masks(['$default']);
			const entries = ['default', ...node.constructor.entries].map(i => { return { entry: i, bitmasks: node.bitmasks.get_Masks([`$${i}`])[0] } });
			const entries_test = entries.map(({ entry, bitmasks: [layer, mask] }) => {
				if (children_template[entry] === undefined) return undefined;
				const nodes = Object.values(children_template[entry]).map(i => Object.values(i)).flat(2).map(({ node }) => this.get_MaskedName(this.get_NodeCache(node)));
				// console.log(nodes);
				const nodes_test = this.bitmasks.get_Masks(nodes).map(([layer, mask], idx, arr) => {
					const len = arr.length === 1;
					return `${len ? '' : '('}this.b[${layer}] & ${mask}${len ? '' : ')'}`;
				});
				if (nodes_test.length === 0) return undefined;
				return `if (${nodes_test.join(" || ")}) this.${node_name}.b[${layer}] |= ${mask};`;
			}).filter(i => i !== undefined);
			ans.push(`if (${if_test.join(" || ")}) {`,
				// debug
				`	// ${node.name} children : ${children}`,
				...(entries_test.length === 0 || !node.auto_bitmasks ? [] : entries_test.map(i => `	${i}`)),
				// `	console.log(">> update ${node.name} uid: ${node.uid}");`,
				`	this.b[${n_layer}] |= ${n_mask} & (this.${node_name}.update(${this.get_NodeInputs(node)}, ${this.get_NodeChildren(node)}, ${this.get_NodeSlots(node)}) ? 2147483647 : 0);`,
				`}`)
		}

		// console.log(masked_params);

		// console.groupEnd(node_name);
		return ans;
	}

	get_Update() {
		const ans = [`let $changed = false;`];
		for (const node of this.scope.order) {
			// console.log(node);
			const node_update = this.get_NodeUpdate(node);
			if (node.auto_bitmasks && node_update.length > 0)
				ans.push(`this.${this.get_NodeCache(node)}.b = ${node.bitmasks.get_EmptyArrayString()};`)
			ans.push(...node_update);
		}
		// update result
		for (const output in this.scope.outputs) {
			const map = this.scope.outputs[output];
			const masked_node = [...map.opt.ids].map(i => this.get_MaskedName(this.get_NodeCache_with_ID(i)));
			const deps = [...map.opt.deps];
			// console.log(output, masked_node, deps);
			const masked_deps = [...masked_node, ...deps];
			const bitmasks = this.bitmasks.get_Masks(masked_deps);
			const if_test = bitmasks.map(([layer, mask], idx, arr) => {
				const len = arr.length === 1;
				return `${len ? '' : '('}this.b[${layer}] & /* ${masked_deps} */ ${mask}${len ? '' : ')'}`;
			});
			if (if_test.length > 0)
				ans.push(`if (${if_test.join(" || ")}) {`,
					`	$changed = true;`,
					`	this.r.e.${output} = ${map.code};`,
					`}`)
		}
		// update nodes
		// console.log(this.scope.collection);
		const slots = (this.opt.reduced_collection ?? this.scope.collection).get('default');
		for (const type_name in slots) {
			const nodes = [...slots[type_name]];
			const masked_nodes = nodes.map(i => this.get_MaskedName(this.get_NodeCache(i)));
			const bitmasks = this.bitmasks.get_Masks(masked_nodes);
			const if_test = bitmasks.map(([layer, mask], idx, arr) => {
				const len = arr.length === 1;
				return `${len ? '' : '('}this.b[${layer}] & /* ${masked_nodes} */ ${mask}${len ? '' : ')'}`;
			});
			if (if_test.length > 0)
				ans.push(`if (${if_test.join(" || ")}) {`,
					`	$changed = true;`,
					`	this.r.n.${type_name} = [${this.get_TypedResult(slots, type_name).join(', ')}];`,
					`}`)
		}

		// ans.push(`console.log(">>> updated component_${this.scope.uid}", $changed);`);
		ans.push('return $changed;');
		// for (const output in this.scope.outputs) {
		// 	const map = this.scope.outputs[output];
		// 	const masked_node = [...map.opt.ids].map(i => this.get_MaskedName(this.get_NodeCache_with_ID(i)));
		// 	const deps = [...map.opt.deps];
		// 	// console.log(output, masked_node, deps);
		// 	const masked_deps = [...masked_node, deps];
		// 	const bitmasks = this.bitmasks.get_Masks(masked_deps);
		// 	const if_test = bitmasks.map(([layer, mask], idx, arr) => {
		// 		const len = arr.length === 1;
		// 		return `${len ? '' : '('}this.b[${layer}] & ${mask}${len ? '' : ')'}`;
		// 	});
		// 	if (if_test.length > 0)
		// 		ans.push(`if (${if_test.join(" || ")}) {`,
		// 			`	this.r.e.${output} = ${map.code};`,
		// 			`}`)
		// }
		// console.log(ans.join('\n'));
		return ans;
	}

	get_NodesDispose() {
		const ans = [];
		for (const node of [...this.nodes.keys()]) {
			const node_name = this.get_NodeCache(node);
			const custom_dispose = node.get_CustomDispose(this, node_name);
			if (custom_dispose !== null) {
				if (custom_dispose !== '')
					ans.push(custom_dispose);
			}
			else
				ans.push(`this.${node_name}.dispose();`);
		}
		// ans.push(`console.log(\`dispose ${this.class_name}\`);`);
		return ans;
	}

	get_MaskedName(name) {
		return `$$${name}`;
	}

	generate() {
		const deps_nodes_arr = [...this.scope.scope_deps];
		for (const output in this.scope.outputs) {
			this.scope.outputs[output].opt.ids.forEach(n => {
				this.noderefs.add(n);
			});
		}
		for (const node of this.scope.order) {
			const node_name = `node_${node.uid}`;
			deps_nodes_arr.push(this.get_MaskedName(node_name));
			node.generate(this);
			this.nodes.set(node, node_name);
			const map = {};
			this.params.set(node, map);
			node.noderefs.forEach(n => {
				this.noderefs.add(n);
			});
			for (const param in node.params) {
				const param_name = `node_${node.uid}_param_${param}`
				map[param] = param_name;
				// console.log(param, param_name, node.params[param].opt.constant);
				if (this.opt.inline_contanst_exp && node.params[param].opt.constant);
				else
					deps_nodes_arr.push(this.get_MaskedName(param_name));
			}
			// console.log(this.get_NodeInputs(node));
		}
		this.bitmasks = new BitMask(deps_nodes_arr);
		return create_Component(this.class_name,
			this.get_DefaultInputs(),
			this.bitmasks.mask_count,
			this.get_NodesDeclaration(),
			this.get_ParamsDeclaration(),
			this.get_Init(),
			this.get_Diffs(),
			this.get_Result(),
			this.get_NodesDispose(),
			this.get_Refs(),
			this.get_Update(),
			this.opt.inputs_sign ? this.get_InputsSign() : null);
	}
}