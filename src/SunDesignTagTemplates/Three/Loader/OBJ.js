import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [color	, emissive	, roughness , metalness , flat  , wireframe	, children  ]
// BITMASKS = [1	    , 2		    , 4 	    , 8		    , 16    , 32        , 64        ]

export const TAG_THREE_OBJ_0 =
{
    name: 'component_THREE_OBJ', code: `class component_THREE_OBJ extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const object3d = new THREE.Object3D();
        const on_loaded = (obj) => {
            this.r.n.object3d[0].add(obj);
        }
        new THREE.OBJLoader().load(i.url, on_loaded);
        this.r = {
            n: { object3d: [object3d] },
            e: {}
        }
    }
    update(i, c, s) {
        return false;
    }
    dispose() {
        this.r.n.object3d[0].dispose();
        this.r.n.object3d = undefined;
        // console.log("dispose component_THREE_OBJ");
    }
}`}

class SDML_THREE_OBJ extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('obj'), ['url']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(object3d id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'object3d', this);
    }

    get_Type() {
        return SDML_THREE_OBJ.type;
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_OBJ_0);
    }

    static get type() {
        return new Types({ object3d: 1 });
    }
}

registe_Tag('obj', SDML_THREE_OBJ);