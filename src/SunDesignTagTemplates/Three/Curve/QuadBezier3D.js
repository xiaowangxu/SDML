import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [s	, c     , e 	, children	]
// BITMASKS = [1	, 2     , 4		, 8		    ]

export const TAG_THREE_CurveQuadBezier3D_0 =
{
    name: 'component_THREE_CurveQuadBezier3D', code: `class component_THREE_CurveQuadBezier3D extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curvequadbezier3d: [new THREE.QuadraticBezierCurve3(i.s, i.c, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 7) {
            this.r.n.curvequadbezier3d[0] = new THREE.QuadraticBezierCurve3(i.s, i.c, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveQuadBezier3D");
    }
}`}

class component_THREE_CurveQuadBezier3D extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curvequadbezier3d'), ['s', 'c', 'e']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(curve-quad-bezier-3d id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curvequadbezier3d', this);
    }

    get_Type() {
        return component_THREE_CurveQuadBezier3D.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CurveQuadBezier3D_0);
    }

    static get type() {
        return new Types({ curvequadbezier3d: 1 });
    }
}

registe_Tag('curvequadbezier3d', component_THREE_CurveQuadBezier3D);