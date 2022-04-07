import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [children  ]
// BITMASKS = [1         ]

export const TAG_THREE_CSGUnion_0 =
{
    name: 'component_THREE_CSGUnion', code: `class component_THREE_CSGUnion extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.bsp_a = null;
        this.bsp_b = null;
        this.geo_a = null;
        this.geo_b = null;
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.geo_a = c.default.geometry[0];
        this.geo_b = c.default.geometry[1];
        this.bsp_a = CSG.fromGeometry(this.geo_a);
        this.bsp_b = CSG.fromGeometry(this.geo_b);
        const geo = CSG.toGeometry(this.bsp_a.union(this.bsp_b));
        this.r = {
            n: { geometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.geometry[0];
        if (this.b[0] & 1) {
            if (this.geo_a !== c.default.geometry[0]) {
                this.geo_a = c.default.geometry[0];
                this.bsp_a = CSG.fromGeometry(this.geo_a);
            }
            if (this.geo_b !== c.default.geometry[0]) {
                this.geo_b = c.default.geometry[1];
                this.bsp_b = CSG.fromGeometry(this.geo_b);
            }
            geo.dispose();
            this.r.n.geometry[0] = CSG.toGeometry(this.bsp_a.union(this.bsp_b));
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.geometry[0].dispose();
        this.r.n.geometry = undefined;
        // console.log("dispose TAG_THREE_CSGUnion_0");
    }
}`}

class SDML_THREE_CSGUnion extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('csg-union'), []);
        this.matched = null;
        this.subs = null;
    }

    static entries = [];
    static inputs = {
        default: {
            default: new Types({
                geometry: 2,
            })
        },
    };
    static exports = {};

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(csg-union id=${this.id} match=${this.matched})`);
        if (this.matched === 'default') {
            for (const sub of this.subs)
                link.push(`Node_${sub.uid} -->|geometry| Node_${this.uid}`);
        }
    }

    receive_Sub(types, collection, match_type) {
        this.matched = match_type;
        switch (match_type) {
            case 'default': {
                const defaults = collection.get_Class('default', 'geometry');
                this.subs = defaults;
                for (const node of defaults)
                    this.scope.graph.add_Edge(node, this);
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'geometry', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CSGUnion_0);
    }

    get_NodeChildren(codegen) {
        switch (this.matched) {
            case 'default': {
                const ans = { default: { geometry: [] } };
                this.subs.forEach(s => ans.default.geometry.push(...s.get_TypeMapped('geometry')));
                return ans;
            }
        }
    }

    get_Type() {
        return SDML_THREE_CSGUnion.type;
    }

    static get type() {
        return new Types({ geometry: 1 });
    }
}

registe_Tag('csg-union', SDML_THREE_CSGUnion);