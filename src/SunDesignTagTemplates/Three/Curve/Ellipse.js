import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [center	, rx    , ry    , as    , ae 	, clockwise , children	]
// BITMASKS = [1	    , 2		, 4	    , 8     , 16    , 32        , 64        ]

export const TAG_THREE_CurveEllipse_0 =
{
    name: 'component_THREE_CurveEllipse', code: `class component_THREE_CurveEllipse extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curveellipse: [new THREE.EllipseCurve(i.center.x, i.center.y, i.rx, i.ry, i.as, i.ae, i.clockwise)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 63) {
            this.r.n.curveellipse[0] = new THREE.EllipseCurve(i.center.x, i.center.y, i.rx, i.ry, i.as, i.ae, i.clockwise);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveEllipse");
    }
}`}

class SDML_THREE_CurveEllipse extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curveellipse'), ['center', 'rx', 'ry', 'as', 'ae', 'clockwise']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(curve-ellipse id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curveellipse', this);
    }

    get_Type() {
        return SDML_THREE_CurveEllipse.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CurveEllipse_0);
    }

    static get type() {
        return new Types({ curveellipse: 1 });
    }
}

registe_Tag('curveellipse', SDML_THREE_CurveEllipse);