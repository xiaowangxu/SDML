import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [r	, s	    , children  ]
// BITMASKS = [1	, 2		, 128       ]

export const TAG_THREE_IcosahedronGeometry_0 =
{
    name: 'component_THREE_IcosahedronGeometry', code: `class component_THREE_IcosahedronGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = new THREE.IcosahedronGeometry(i.r, i.s);
        this.r = {
            n: { icosahedrongeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.icosahedrongeometry[0];
        if (this.b[0] & 3) {
            geo.dispose();
            this.r.n.icosahedrongeometry[0] = new THREE.IcosahedronGeometry(i.r, i.h);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.icosahedrongeometry[0].dispose();
        this.r.n.icosahedrongeometry = undefined;
        // console.log("dispose component_THREE_IcosahedronGeometry");
    }
}`}

class SDML_THREE_IcosahedronGeometry extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('icosahedrongeometry'), ['r', 's']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(icosahedron-geometry id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'icosahedrongeometry', this);
    }

    get_Type() {
        return SDML_THREE_IcosahedronGeometry.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_IcosahedronGeometry_0);
    }

    static get type() {
        return new Types({ icosahedrongeometry: 1 });
    }
}

registe_Tag('icosahedrongeometry', SDML_THREE_IcosahedronGeometry);