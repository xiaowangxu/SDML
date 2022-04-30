import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [closed   , children	]
// BITMASKS = [1        , 2 	    ]

export const TAG_THREE_Path3D_0 =
{
	name: 'component_THREE_Path3D', code: `class component_THREE_Path3D extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const path = new THREE.CurvePath();
        path.autoClose = i.closed;
        path.curves = c.default.curve3d;
        this.r = {
            n: { path3d: [path] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            const path = new THREE.CurvePath();
            path.autoClose = i.closed;
            path.curves = c.default.curve3d;
            this.r.n.path3d[0] = path;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Path3D");
    }
}`}

class SDML_THREE_Path3D extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, TypesManagerSingleton.param('path3d'), ['closed']);
		this.matched = null;
		this.subs = [];
	}

	static entries = [];
	static inputs = {
		default: {
			default: new Types({
				curve3d: Infinity
			})
		},
	};
	static exports = {};

	to_Mermaid(ans, link) {
		ans.push(`Node_${this.uid}(path id=${this.id} match=${this.matched})`);
		if (this.matched === 'default')
			for (const sub of this.subs) {
				link.push(`Node_${sub.uid} -->|curve3d| Node_${this.uid}`);
			}
	}

	receive_Sub(types, collection, match_type) {
		this.matched = match_type;
		switch (match_type) {
			case 'default': {
				const defaults = collection.get_Class('default', 'curve3d');
				this.subs = defaults;
				for (const node of defaults) {
					this.scope.graph.add_Edge(node, this);
				}
				break;
			}
		}
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'path3d', this);
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_Path3D_0);
	}

	get_NodeChildren(codegen) {
		switch (this.matched) {
			case 'default': {
				const ans = { default: { curve3d: [] } };
				this.subs.forEach(s => ans.default.curve3d.push(...s.get_TypeMapped('curve3d')));
				return ans;
			}
		}
	}

	get_Type() {
		return SDML_THREE_Path3D.type;
	}

	static get type() {
		return new Types({ path3d: 1 });
	}
}

registe_Tag('path3d', SDML_THREE_Path3D);