import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [r	, s	    , children  ]
// BITMASKS = [1	, 2		, 128       ]

export const TAG_THREE_OctahedronGeometry_0 =
{
    name: 'component_THREE_OctahedronGeometry', code: `class component_THREE_OctahedronGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = new THREE.OctahedronGeometry(i.r, i.s);
        this.r = {
            n: { octahedrongeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.octahedrongeometry[0];
        if (this.b[0] & 3) {
            geo.dispose();
            this.r.n.octahedrongeometry[0] = new THREE.OctahedronGeometry(i.r, i.h);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.octahedrongeometry[0].dispose();
        this.r.n.octahedrongeometry = undefined;
        // console.log("dispose component_THREE_OctahedronGeometry");
    }
}`}

class SDML_THREE_OctahedronGeometry extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('octahedrongeometry'), ['r', 's']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(octahedron-geometry id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'octahedrongeometry', this);
    }

    get_Type() {
        return SDML_THREE_OctahedronGeometry.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_OctahedronGeometry_0);
    }

    static get type() {
        return new Types({ octahedrongeometry: 1 });
    }
}

registe_Tag('octahedrongeometry', SDML_THREE_OctahedronGeometry);