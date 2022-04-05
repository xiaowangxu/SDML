import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [name, pos	, rot	, scale , castshadow, visible      , color   , intensity, children	]
// BITMASKS = [1   , 2	    , 4		, 8 	, 16        , 32           , 64      , 128	    , 256	    ]

export const TAG_THREE_DirectionalLight_0 =
{
    name: 'component_THREE_DirectionalLight', code: `class component_THREE_DirectionalLight extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const directionallight = new THREE.DirectionalLight();
        directionallight.shadow.mapSize.width = 1024;
        directionallight.shadow.mapSize.height = 1024;
        directionallight.shadow.camera.near = 0.5;
        directionallight.shadow.camera.far = 500;
        directionallight.shadow.camera.top = 10;
        directionallight.shadow.camera.right = 10;
        directionallight.shadow.camera.bottom = -10;
        directionallight.shadow.camera.left = -10;
        directionallight.name = i.name;
        directionallight.castShadow = i.castshadow;
        directionallight.color = i.color;
        directionallight.visible = i.visible;
        directionallight.intensity = i.intensity;
        directionallight.position.copy(i.pos);
        directionallight.rotation.copy(i.rot);
        directionallight.scale.copy(i.scale);
        this.r = {
            n: { directionallight: [directionallight] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const directionallight = this.r.n.directionallight[0];
        if (this.b[0] & /* name */ 1){
            directionallight.name = i.name;
        }
        if (this.b[0] & /* pos */ 2){
            directionallight.position.copy(i.pos);
        }
        if (this.b[0] & /* rot */ 4){
            directionallight.rotation.copy(i.rot);
        }
        if (this.b[0] & /* scale */ 8){
            directionallight.scale.copy(i.scale);
        }
        if (this.b[0] & /* castshadow */ 16){
            directionallight.castShadow = i.castshadow;
        }
        if (this.b[0] & /* visible */ 32){
            directionallight.visible = i.visible;
        }
        if (this.b[0] & /* color */ 64){
            directionallight.color = i.color;
        }
        if (this.b[0] & /* color */ 128){
            directionallight.intensity = i.intensity;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_DirectionalLight");
    }
}`}

class SDML_THREE_DirectionalLight extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('directionallight'), ['name', 'pos', 'rot', 'scale', 'castshadow', 'visible', 'color', 'intensity']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(directionallight id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'directionallight', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_DirectionalLight_0);
    }
    get_Type() {
        return SDML_THREE_DirectionalLight.type;
    }

    static get type() {
        return new Types({ directionallight: 1 });
    }
}

registe_Tag('directionallight', SDML_THREE_DirectionalLight);