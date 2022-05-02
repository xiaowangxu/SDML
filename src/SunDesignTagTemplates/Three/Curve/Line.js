import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [s	, e 	, children	]
// BITMASKS = [1	, 2		, 4		    ]

export const TAG_THREE_CurveLine_0 =
{
	name: 'component_THREE_CurveLine', code: `class component_THREE_CurveLine extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curveline: [new THREE.LineCurve(i.s, i.e)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            this.r.n.curveline[0] = new THREE.LineCurve(i.s, i.e);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveLine");
    }
}`}

class SDML_THREE_CurveLine extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, TypesManagerSingleton.param('curveline'), ['s', 'e']);
	}

	static inputs = Types.NONE;

	to_Mermaid(ans) {
		ans.push(`Node_${this.uid}(curve-line id=${this.id})`);
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'curveline', this);
	}

	get_Type() {
		return SDML_THREE_CurveLine.type;
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_CurveLine_0);
	}

	static get type() {
		return new Types({ curveline: 1 });
	}
}

registe_Tag('curveline', SDML_THREE_CurveLine);