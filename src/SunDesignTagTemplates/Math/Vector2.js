import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../SunDesign/Core.js';
import { typeCheck } from '../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../SunDesign/TagCollection.js';

export const TAG_THREE_Vector2_0 =
{
    name: 'component_THREE_Vector2', code: `class component_THREE_Vector2 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { vec2: [new THREE.Vector2(i.x, i.y)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & /* x */ 1 && i.x !== this.r.n.vec2[0].x) {
            this.r.n.vec2[0].x = i.x;
            $changed ||= true;
        }
        if (this.b[0] & /* y */ 2 && i.y !== this.r.n.vec2[0].y) {
            this.r.n.vec2[0].y = i.y;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Vector2");
    }
}`}

class SDML_Math_Vector2 extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('vec2'), ['x', 'y']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(vec2 id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'vec2', this);
    }

    get_Type() {
        return SDML_Math_Vector2.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_Vector2_0);
    }

    static get type() {
        return new Types({ vec2: 1 });
    }
}

registe_Tag('vec2', SDML_Math_Vector2);
