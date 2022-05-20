import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [r	, s	    , children  ]
// BITMASKS = [1	, 2		, 128       ]

export const TAG_THREE_DodecahedronGeometry_0 =
{
	name: 'component_THREE_DodecahedronGeometry', code: `class component_THREE_DodecahedronGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = new THREE.DodecahedronGeometry(i.r, i.s);
        this.r = {
            n: { dodecahedrongeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.dodecahedrongeometry[0];
        if (this.b[0] & 3) {
            geo.dispose();
            this.r.n.dodecahedrongeometry[0] = new THREE.DodecahedronGeometry(i.r, i.h);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.dodecahedrongeometry[0].dispose();
        // console.log("dispose component_THREE_DodecahedronGeometry");
    }
}`}

class SDML_THREE_DodecahedronGeometry extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, TypesManagerSingleton.param('dodecahedrongeometry'), ['r', 's']);
	}

	static inputs = Types.NONE;

	to_Mermaid(ans) {
		ans.push(`Node_${this.uid}(dodecahedron-geometry id=${this.id})`);
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'dodecahedrongeometry', this);
	}

	get_Type() {
		return SDML_THREE_DodecahedronGeometry.type;
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_DodecahedronGeometry_0);
	}

	static get type() {
		return new Types({ dodecahedrongeometry: 1 });
	}
}

registe_Tag('dodecahedrongeometry', SDML_THREE_DodecahedronGeometry);