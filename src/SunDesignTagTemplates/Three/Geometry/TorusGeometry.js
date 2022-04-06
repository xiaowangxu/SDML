import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [r	, t	    , rs    , ts        , l	    , children  ]
// BITMASKS = [1	, 2		, 4 	, 8         , 16    , 32       ]

export const TAG_THREE_TorusGeometry_0 =
{
    name: 'component_THREE_TorusGeometry', code: `class component_THREE_TorusGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = new THREE.TorusGeometry(i.r, i.t, i.rs, i.ts, i.l);
        this.r = {
            n: { torusgeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.torusgeometry[0];
        if (this.b[0] & 31) {
            geo.dispose();
            this.r.n.torusgeometry[0] = new THREE.TorusGeometry(i.r, i.t, i.rs, i.ts, i.l);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.torusgeometry[0].dispose();
        this.r.n.torusgeometry = undefined;
        // console.log("dispose component_THREE_TorusGeometry");
    }
}`}

class SDML_THREE_TorusGeometry extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('torusgeometry'), ['r', 't', 'rs', 'ts', 'l']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(torus-geometry id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'torusgeometry', this);
    }

    get_Type() {
        return SDML_THREE_TorusGeometry.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_TorusGeometry_0);
    }

    static get type() {
        return new Types({ torusgeometry: 1 });
    }
}

registe_Tag('torusgeometry', SDML_THREE_TorusGeometry);