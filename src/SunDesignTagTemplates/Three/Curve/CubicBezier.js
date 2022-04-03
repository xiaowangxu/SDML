import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [s	, c1     , c2   , e 	, children	]
// BITMASKS = [1	, 2      , 4    , 8		, 16		    ]

export const TAG_THREE_CurveCubicBezier_0 =
{
    name: 'component_THREE_CurveCubicBezier', code: `class component_THREE_CurveCubicBezier extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curvecubicbezier: [new THREE.CubicBezierCurve(i.s, i.c1, i.c2, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 15) {
            this.r.n.curvecubicbezier[0] = new THREE.CubicBezierCurve(i.s, i.c1, i.c2, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveCubicBezier");
    }
}`}

class component_THREE_CurveCubicBezier extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curvecubicbezier'), ['s', 'c1', 'c2', 'e']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(curve-cubic-bezier id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curvecubicbezier', this);
    }

    get_Type() {
        return component_THREE_CurveCubicBezier.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CurveCubicBezier_0);
    }

    static get type() {
        return new Types({ curvecubicbezier: 1 });
    }
}

registe_Tag('curvecubicbezier', component_THREE_CurveCubicBezier);