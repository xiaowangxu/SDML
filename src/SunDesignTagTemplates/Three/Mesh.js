import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../SunDesign/Core.js';
import { typeCheck } from '../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error, get_ParamsString } from '../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../SunDesign/TagCollection.js';

// BITMASKS = [pos	, rot	, scale , name    , castshadow, receiveshadow, visible, default	, children	, materials ]
// BITMASKS = [1	, 2		, 4 	, 8       , 16        , 32           , 64     , 128		, 256		, 512       ]

export const TAG_THREE_Mesh_0 =
{
    name: 'component_THREE_Mesh', code: `class component_THREE_Mesh extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const mesh = new THREE.Mesh(c.default.geometry[0], c.default.material[0]);
        mesh.name = i.name;
        mesh.castShadow = i.castshadow;
        mesh.receiveShadow = i.receiveshadow;
        mesh.visible = i.visible;
        mesh.position.copy(i.pos);
        mesh.rotation.copy(i.rot);
        mesh.scale.copy(i.scale);
        c.children.object3d.forEach(o=>mesh.add(o));
        this.r = {
            n: { mesh: [mesh] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const mesh = this.r.n.mesh[0];
        if (this.b[0] & /* pos */ 1){
            mesh.position.copy(i.pos);
        }
        if (this.b[0] & /* rot */ 2){
            mesh.rotation.copy(i.rot);
        }
        if (this.b[0] & /* scale */ 4){
            mesh.scale.copy(i.scale);
        }
        if (this.b[0] & /* name */ 8){
            mesh.name = i.name;
        }
        if (this.b[0] & /* castshadow */ 16){
            mesh.castShadow = i.castshadow;
        }
        if (this.b[0] & /* receiveshadow */ 32){
            mesh.receiveShadow = i.receiveshadow;
        }
        if (this.b[0] & /* visible */ 64){
            mesh.visible = i.visible;
        }
        if (this.b[0] & /* default */ 128) {
            if (mesh.geometry !== c.default.geometry[0])
                mesh.geometry = c.default.geometry[0];
            if (mesh.material !== c.default.material[0])
                mesh.material = c.default.material[0];
        }
        if (this.b[0] & /* children */ 256) {
            mesh.clear();
            c.children.object3d.forEach(o=>mesh.add(o));
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Mesh");
    }
}`}

export const TAG_THREE_Mesh_1 =
{
    name: 'component_THREE_Mesh1', code: `class component_THREE_Mesh1 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const mesh = new THREE.Mesh(c.default.geometry[0], c.materials.material);
        mesh.name = i.name;
        mesh.castShadow = i.castshadow;
        mesh.receiveShadow = i.receiveshadow;
        mesh.visible = i.visible;
        mesh.position.copy(i.pos);
        mesh.rotation.copy(i.rot);
        mesh.scale.copy(i.scale);
        c.children.object3d.forEach(o=>mesh.add(o));
        this.r = {
            n: { mesh: [mesh] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        const mesh = this.r.n.mesh[0];
        if (this.b[0] & /* pos */ 1){
            mesh.position.copy(i.pos);
        }
        if (this.b[0] & /* rot */ 2){
            mesh.rotation.copy(i.rot);
        }
        if (this.b[0] & /* scale */ 4){
            mesh.scale.copy(i.scale);
        }
        if (this.b[0] & /* name */ 8){
            mesh.name = i.name;
        }
        if (this.b[0] & /* castshadow */ 16){
            mesh.castShadow = i.castshadow;
        }
        if (this.b[0] & /* receiveshadow */ 32){
            mesh.receiveShadow = i.receiveshadow;
        }
        if (this.b[0] & /* visible */ 64){
            mesh.visible = i.visible;
        }
        if (this.b[0] & /* default */ 128) {
            if (mesh.geometry !== c.default.geometry[0])
                mesh.geometry = c.default.geometry[0];
        }
        if (this.b[0] & /* children */ 256) {
            mesh.clear();
            c.children.object3d.forEach(o=>mesh.add(o));
        }
        if (this.b[0] & /* materials */ 512) {
            mesh.material = c.materials.material;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Mesh");
    }
}`}

class SDML_THREE_Mesh extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('mesh'), ['pos', 'rot', 'scale', 'name', 'castshadow', 'receiveshadow', 'visible']);
        this.matched = null;
        this.geo = null;
        this.mats = [];
        this.children = [];
    }

    static entries = ['children', 'materials'];
    static inputs = {
        default: {
            default: new Types({
                geometry: 1,
                material: Infinity,
            }),
            children: new Types({
                object3d: Infinity,
            }),
        },
        materials: {
            default: new Types({
                geometry: 1,
            }),
            materials: new Types({
                material: Infinity,
            }),
            children: new Types({
                object3d: Infinity,
            }),
        }
    };
    static exports = {};

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(mesh id=${this.id} match=${this.matched})`);
        if (this.matched === 'default') {
            for (const sub of this.mats) {
                link.push(`Node_${sub.uid} -->|material| Node_${this.uid}`);
            }
            link.push(`Node_${this.geo.uid} -->|geometry| Node_${this.uid}`);
            for (const sub of this.children) {
                link.push(`Node_${sub.uid} -->|object3d| Node_${this.uid}`);
            }
        }
        else if (this.matched === 'materials') {
            for (const sub of this.mats) {
                link.push(`Node_${sub.uid} -->|material| Node_${this.uid}`);
            }
            link.push(`Node_${this.geo.uid} -->|geometry| Node_${this.uid}`);
            for (const sub of this.children) {
                link.push(`Node_${sub.uid} -->|object3d| Node_${this.uid}`);
            }
        }
    }

    receive_Sub(types, collection, match_type, reduced_types) {
        this.matched = match_type;
        switch (match_type) {
            case 'default': {
                if (reduced_types.default.material > 1)
                    throw new SDML_Compile_Error(`when using 'default' inputs for <mesh /> node, materials type can appears only zero or once, but now is:\n<mesh>\n${get_ParamsString(types, true).map(i => `\t${i}`).join("\n")}\n</mesh>`);
                const mats = collection.get_Class('default', 'material');
                this.mats = mats;
                const children = collection.get_Class('children', 'object3d');
                this.children = children;
                this.geo = collection.get_Class('default', 'geometry')[0];
                this.scope.graph.add_Edge(this.geo, this);
                for (const node of mats) {
                    this.scope.graph.add_Edge(node, this);
                }
                for (const node of children) {
                    this.scope.graph.add_Edge(node, this);
                }
                break;
            }
            case 'materials': {
                const mats = collection.get_Class('materials', 'material');
                this.mats = mats;
                const children = collection.get_Class('children', 'object3d');
                this.children = children;
                this.geo = collection.get_Class('default', 'geometry')[0];
                this.scope.graph.add_Edge(this.geo, this);
                for (const node of mats) {
                    this.scope.graph.add_Edge(node, this);
                }
                for (const node of children) {
                    this.scope.graph.add_Edge(node, this);
                }
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'mesh', this);
    }

    get_NewNode(codegen) {
        return this.matched === 'default' ? codegen.registe_Template(TAG_THREE_Mesh_0) : codegen.registe_Template(TAG_THREE_Mesh_1);
    }

    get_NodeChildren(codegen) {
        switch (this.matched) {
            case 'default': {
                const ans = { default: { geometry: [...this.geo.get_TypeMapped('geometry')], material: [] }, children: { object3d: [] } };
                this.mats.forEach(s => ans.default.material.push(...s.get_TypeMapped('material')));
                this.children.forEach(s => ans.children.object3d.push(...s.get_TypeMapped('object3d')));
                return ans;
            }
            case 'materials': {
                const ans = { default: { geometry: [...this.geo.get_TypeMapped('geometry')] }, materials: { material: [] }, children: { object3d: [] } };
                this.mats.forEach(s => ans.materials.material.push(...s.get_TypeMapped('material')));
                this.children.forEach(s => ans.children.object3d.push(...s.get_TypeMapped('object3d')));
                return ans;
            }
        }
    }

    get_Type() {
        return SDML_THREE_Mesh.type;
    }

    static get type() {
        return new Types({ mesh: 1 });
    }
}

registe_Tag('mesh', SDML_THREE_Mesh);