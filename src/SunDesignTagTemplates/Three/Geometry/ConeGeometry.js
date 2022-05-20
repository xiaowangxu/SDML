import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [r	, h	    , rs    , hs        , capped, ts    , tl	, children  ]
// BITMASKS = [1	, 2		, 4 	, 8         , 16	, 32    , 64    , 128       ]

export const TAG_THREE_ConeGeometry_0 =
{
	name: 'component_THREE_ConeGeometry', code: `class component_THREE_ConeGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = new THREE.ConeGeometry(i.r, i.h, i.rs, i.hs, !i.capped, i.ts, i.tl);
        this.r = {
            n: { conegeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.conegeometry[0];
        if (this.b[0] & 127) {
            geo.dispose();
            this.r.n.conegeometry[0] = new THREE.ConeGeometry(i.r, i.h, i.rs, i.hs, !i.capped, i.ts, i.tl);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.conegeometry[0].dispose();
        // console.log("dispose component_THREE_ConeGeometry");
    }
}`}

class SDML_THREE_ConeGeometry extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, TypesManagerSingleton.param('conegeometry'), ['r', 'h', 'rs', 'hs', 'capped', 'ts', 'tl']);
	}

	static inputs = Types.NONE;

	to_Mermaid(ans) {
		ans.push(`Node_${this.uid}(cone-geometry id=${this.id})`);
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'conegeometry', this);
	}

	get_Type() {
		return SDML_THREE_ConeGeometry.type;
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_ConeGeometry_0);
	}

	static get type() {
		return new Types({ conegeometry: 1 });
	}
}

registe_Tag('conegeometry', SDML_THREE_ConeGeometry);