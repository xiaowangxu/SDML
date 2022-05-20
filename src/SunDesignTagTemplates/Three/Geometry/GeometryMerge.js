import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [children  ]
// BITMASKS = [1         ]

export const TAG_THREE_GeometryMerge_0 =
{
	name: 'component_THREE_GeometryMerge', code: `class component_THREE_GeometryMerge extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = UTILS.BufferGeometryUtils.mergeBufferGeometries(c.default.geometry);
        this.r = {
            n: { geometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.geometry[0];
        if (this.b[0] & 1) {
            geo.dispose();
            this.r.n.geometry[0] = UTILS.BufferGeometryUtils.mergeBufferGeometries(c.default.geometry);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.geometry[0].dispose();
        // console.log("dispose component_THREE_GeometryMerge");
    }
}`}

class SDML_THREE_GeometryMerge extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, {}, []);
		this.geos = null;
	}

	static inputs = {
		default: {
			default: new Types({
				geometry: Infinity
			})
		}
	};

	to_Mermaid(ans, link) {
		ans.push(`Node_${this.uid}(geometry-transform id=${this.id} match=${this.matched})`);
		for (const geo of this.geos)
			link.push(`Node_${geo.uid} -->|geometry| Node_${this.uid}`);
	}

	receive_Sub(types, collection, match_type) {
		switch (match_type) {
			case 'default': {
				const defaults = collection.get_Class('default', 'geometry');
				this.geos = defaults;
				for (const geo of this.geos)
					this.scope.graph.add_Edge(geo, this);
				break;
			}
		}
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'geometry', this);
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_GeometryMerge_0);
	}

	get_NodeChildren(codegen) {
		const ans = { default: { geometry: [] } };
		this.geos.forEach(s => ans.default.geometry.push(...s.get_TypeMapped('geometry')));
		return ans;
	}

	get_Type() {
		return SDML_THREE_GeometryMerge.type;
	}

	static get type() {
		return new Types({ geometry: 1 });
	}
}

registe_Tag('geometry-merge', SDML_THREE_GeometryMerge);