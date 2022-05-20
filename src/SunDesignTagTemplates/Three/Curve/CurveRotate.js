import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [default	, normals ]
// BITMASKS = [1	    , 2     ]

export const TAG_THREE_CurveRotation_0 =
{
	name: 'component_THREE_CurveRotation', code: `class component_THREE_CurveRotation extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const curve = new UTILS.CurveRotation(c.default.curve3d[0], c.normals.vec3);
        this.r = {
            n: { curve3d: [curve] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            const curve = new UTILS.CurveRotation(c.default.curve3d[0], c.normals.vec3);
            this.r.n.curve3d[0] = curve;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveRotation");
    }
}`}

class SDML_THREE_CurveRotation extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, /*TypesManagerSingleton.param('shape')*/ {}, []);
		this.matched = null;
		this.curve3d = null;
		this.vec3s = [];
	}

	static entries = ['normals'];
	static inputs = {
		default: {
			default: new Types({
				curve3d: 1,
			}),
			normals: new Types({
				vec3: Infinity
			})
		},
	};
	static exports = {};

	to_Mermaid(ans, link) {
		ans.push(`Node_${this.uid}(shape id=${this.id} match=${this.matched})`);
		if (this.matched === 'default') {
			link.push(`Node_${this.curve3d.uid} -->|curve3d| Node_${this.uid}`);
			for (const sub of this.vec3s) {
				link.push(`Node_${sub.uid} -->|vec3| Node_${this.uid}`);
			}
		}
	}

	receive_Sub(types, collection, match_type) {
		this.matched = match_type;
		switch (match_type) {
			case 'default': {
				const defaults = collection.get_Class('default', 'curve3d');
				this.curve3d = defaults[0];
				const vec3s = collection.get_Class('normals', 'vec3');
				this.vec3s = vec3s;
				this.scope.graph.add_Edge(this.curve3d, this);
				for (const node of vec3s) {
					this.scope.graph.add_Edge(node, this);
				}
				break;
			}
		}
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'curve3d', this);
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_CurveRotation_0);
	}

	get_NodeChildren(codegen) {
		switch (this.matched) {
			case 'default': {
				const ans = { default: { curve3d: [...this.curve3d.get_TypeMapped('curve3d')] }, normals: { vec3: [] } };
				this.vec3s.forEach(s => ans.normals.vec3.push(...s.get_TypeMapped('vec3')));
				return ans;
			}
		}
	}

	get_Type() {
		return SDML_THREE_CurveRotation.type;
	}

	static get type() {
		return new Types({ curve3d: 1 });
	}
}

registe_Tag('curve-rotate', SDML_THREE_CurveRotation);