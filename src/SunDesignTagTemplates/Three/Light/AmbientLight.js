import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [name, pos	, rot	, scale , castshadow, visible      , color   , intensity, children	]
// BITMASKS = [1   , 2	    , 4		, 8 	, 16        , 32           , 64      , 128	    , 256	    ]

export const TAG_THREE_AmbientLight_0 =
{
    name: 'component_THREE_AmbientLight', code: `class component_THREE_AmbientLight extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const ambientlight = new THREE.AmbientLight();
        ambientlight.name = i.name;
        ambientlight.castShadow = i.castshadow;
        ambientlight.color = i.color;
        ambientlight.visible = i.visible;
        ambientlight.intensity = i.intensity;
        ambientlight.position.copy(i.pos);
        ambientlight.rotation.copy(i.rot);
        ambientlight.scale.copy(i.scale);
        this.r = {
            n: { ambientlight: [ambientlight] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const ambientlight = this.r.n.ambientlight[0];
        if (this.b[0] & /* name */ 1){
            ambientlight.name = i.name;
        }
        if (this.b[0] & /* pos */ 2){
            ambientlight.position.copy(i.pos);
        }
        if (this.b[0] & /* rot */ 4){
            ambientlight.rotation.copy(i.rot);
        }
        if (this.b[0] & /* scale */ 8){
            ambientlight.scale.copy(i.scale);
        }
        if (this.b[0] & /* castshadow */ 16){
            ambientlight.castShadow = i.castshadow;
        }
        if (this.b[0] & /* visible */ 32){
            ambientlight.visible = i.visible;
        }
        if (this.b[0] & /* color */ 64){
            ambientlight.color = i.color;
        }
        if (this.b[0] & /* color */ 128){
            ambientlight.intensity = i.intensity;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_AmbientLight");
    }
}`}

class SDML_THREE_AmbientLight extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('ambientlight'), ['name', 'pos', 'rot', 'scale', 'castshadow', 'visible', 'color', 'intensity']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(ambientlight id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'ambientlight', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_AmbientLight_0);
    }
    get_Type() {
        return SDML_THREE_AmbientLight.type;
    }

    static get type() {
        return new Types({ ambientlight: 1 });
    }
}

registe_Tag('ambientlight', SDML_THREE_AmbientLight);