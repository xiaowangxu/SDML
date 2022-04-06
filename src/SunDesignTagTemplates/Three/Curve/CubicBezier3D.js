import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [s	, c1     , c2   , e 	, children	]
// BITMASKS = [1	, 2      , 4    , 8		, 16		    ]

export const TAG_THREE_CurveCubicBezier3D_0 =
{
    name: 'component_THREE_CurveCubicBezier3D', code: `class component_THREE_CurveCubicBezier3D extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curvecubicbezier3d: [new THREE.CubicBezierCurve3(i.s, i.c1, i.c2, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 15) {
            this.r.n.curvecubicbezier3d[0] = new THREE.CubicBezierCurve3(i.s, i.c1, i.c2, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveCubicBezier3D");
    }
}`}

class component_THREE_CurveCubicBezier3D extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curvecubicbezier3d'), ['s', 'c1', 'c2', 'e']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(curve-cubic-bezier-3d id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curvecubicbezier3d', this);
    }

    get_Type() {
        return component_THREE_CurveCubicBezier3D.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CurveCubicBezier3D_0);
    }

    static get type() {
        return new Types({ curvecubicbezier3d: 1 });
    }
}

registe_Tag('curvecubicbezier3d', component_THREE_CurveCubicBezier3D);