import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../SunDesign/Core.js';
import { typeCheck } from '../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../SunDesign/TagCollection.js';

export const TAG_THREE_Vector3_0 =
{
    name: 'component_THREE_Vector3', code: `class component_THREE_Vector3 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { vec3: [new THREE.Vector3(i.x, i.y, i.z)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & /* x */ 1 && i.x !== this.r.n.vec3[0].x) {
            this.r.n.vec3[0].x = i.x;
            $changed ||= true;
        }
        if (this.b[0] & /* y */ 2 && i.y !== this.r.n.vec3[0].y) {
            this.r.n.vec3[0].y = i.y;
            $changed ||= true;
        }
        if (this.b[0] & /* z */ 4 && i.z !== this.r.n.vec3[0].z) {
            this.r.n.vec3[0].y = i.y;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Vector3");
    }
}`}

class SDML_Math_Vector3 extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('vec3'), ['x', 'y', 'z']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(vec3 id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'vec3', this);
    }

    get_Type() {
        return SDML_Math_Vector3.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_Vector3_0);
    }

    static get type() {
        return new Types({ vec3: 1 });
    }
}

registe_Tag('vec3', SDML_Math_Vector3);
