import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [s	, c     , e 	, children	]
// BITMASKS = [1	, 2     , 4		, 8		    ]

export const TAG_THREE_CurveQuadBezier_0 =
{
    name: 'component_THREE_CurveQuadBezier', code: `class component_THREE_CurveQuadBezier extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curvequadbezier: [new THREE.QuadraticBezierCurve(i.s, i.c, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 7) {
            this.r.n.curvequadbezier[0] = new THREE.QuadraticBezierCurve(i.s, i.c, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveQuadBezier");
    }
}`}

class component_THREE_CurveQuadBezier extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curvequadbezier'), ['s', 'c', 'e']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(curve-quad-bezier id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curvequadbezier', this);
    }

    get_Type() {
        return component_THREE_CurveQuadBezier.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CurveQuadBezier_0);
    }

    static get type() {
        return new Types({ curvequadbezier: 1 });
    }
}

registe_Tag('curvequadbezier', component_THREE_CurveQuadBezier);