import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [rs	, ps        , ts	, tl    , default   ]
// BITMASKS = [1	, 2         , 4		, 8 	, 16        ]

export const TAG_THREE_LatheGeometry_0 =
{
	name: 'component_THREE_LatheGeometry', code: `class component_THREE_LatheGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
        this.points = [];
    }
    init(i, c, s) {
        this.points = c.default.curve[0].getPoints(i.ps);
        const geo = new THREE.LatheGeometry(this.points, i.rs, i.ts, i.tl);
        this.r = {
            n: { lathegeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.lathegeometry[0];
        if (this.b[0] & 16) {
            geo.dispose();
            this.points = c.default.curve[0].getPoints(i.ps);
            this.r.n.lathegeometry[0] = new THREE.LatheGeometry(this.points, i.rs, i.ts, i.tl);
            return true;
        }
        else if (this.b[0] & 15) {
            geo.dispose();
            this.r.n.lathegeometry[0] = new THREE.LatheGeometry(this.points, i.rs, i.ts, i.tl);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.lathegeometry[0].dispose();
        // console.log("dispose component_THREE_LatheGeometry");
    }
}`}

class SDML_THREE_LatheGeometry extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, TypesManagerSingleton.param('lathegeometry'), ['rs', 'ps', 'ts', 'tl']);
		this.curve = null;
		this.matched = null;
	}

	static inputs = {
		default: {
			default: new Types({
				curve: 1
			}),
		}
	};

	to_Mermaid(ans, link) {
		ans.push(`Node_${this.uid}(lathe-geometry id=${this.id} match=${this.matched})`);
		if (this.matched === 'default') {
			link.push(`Node_${this.curve.uid} -->|curve| Node_${this.uid}`);
		}
	}

	receive_Sub(types, collection, match_type) {
		this.matched = match_type;
		switch (match_type) {
			case 'default': {
				const curve = collection.get_Class('default', 'curve');
				this.curve = curve[0];
				this.scope.graph.add_Edge(this.curve, this);
				break;
			}
		}
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'lathegeometry', this);
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_LatheGeometry_0);
	}

	get_NodeChildren(codegen) {
		switch (this.matched) {
			case 'default': {
				const ans = { default: { curve: [...this.curve.get_TypeMapped('curve')] } };
				return ans;
			}
		}
	}

	get_Type() {
		return SDML_THREE_LatheGeometry.type;
	}

	static get type() {
		return new Types({ lathegeometry: 1 });
	}
}

registe_Tag('lathegeometry', SDML_THREE_LatheGeometry);