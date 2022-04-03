import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [s	, e 	, children	]
// BITMASKS = [1	, 2		, 4		    ]

export const TAG_THREE_CurveLine3D_0 =
{
    name: 'component_THREE_CurveLine3D', code: `class component_THREE_CurveLine3D extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curveline3d: [new THREE.LineCurve3(i.s, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            this.r.n.curveline3d[0] = new THREE.LineCurve3(i.s, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveLine3D");
    }
}`}

class SDML_THREE_CurveLine3D extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curveline3d'), ['s', 'e']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(curve-line-3d id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curveline3d', this);
    }

    get_Type() {
        return SDML_THREE_CurveLine3D.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CurveLine3D_0);
    }

    static get type() {
        return new Types({ curveline3d: 1 });
    }
}

registe_Tag('curveline3d', SDML_THREE_CurveLine3D);