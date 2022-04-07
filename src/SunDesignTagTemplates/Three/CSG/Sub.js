import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [children , with ]
// BITMASKS = [1        , 2    ]

export const TAG_THREE_CSGSub_0 =
{
    name: 'component_THREE_CSGSub', code: `class component_THREE_CSGSub extends ComponentBase {
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
        this.geo_b = c.with.geometry[0];
        this.bsp_a = CSG.fromGeometry(this.geo_a);
        this.bsp_b = CSG.fromGeometry(this.geo_b);
        const geo = CSG.toGeometry(this.bsp_a.subtract(this.bsp_b));
        this.r = {
            n: { geometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.geometry[0];
        if (this.b[0] & 1) {
            this.geo_a = c.default.geometry[0];
            this.bsp_a = CSG.fromGeometry(this.geo_a);
        }
        if (this.b[0] & 2) {
            this.geo_b = c.with.geometry[0];
            this.bsp_b = CSG.fromGeometry(this.geo_b);
        }
        if (this.b[0] & 3) {
            geo.dispose();
            this.r.n.geometry[0] = CSG.toGeometry(this.bsp_a.subtract(this.bsp_b));
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.geometry[0].dispose();
        this.r.n.geometry = undefined;
        // console.log("dispose TAG_THREE_CSGSub_0");
    }
}`}

class SDML_THREE_CSGSub extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('csg-sub'), []);
        this.matched = null;
        this.sub = null;
        this.with = null;
    }

    static entries = ['with'];
    static inputs = {
        default: {
            default: new Types({
                geometry: 1,
            }),
            with: new Types({
                geometry: 1,
            }),
        },
    };
    static exports = {};

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(csg-union id=${this.id} match=${this.matched})`);
        if (this.matched === 'default') {
            link.push(`Node_${this.sub.uid} -->|geometry| Node_${this.uid}`);
            link.push(`Node_${this.with.uid} -->|geometry:with| Node_${this.uid}`);
        }
    }

    receive_Sub(types, collection, match_type) {
        this.matched = match_type;
        switch (match_type) {
            case 'default': {
                const defaults = collection.get_Class('default', 'geometry');
                const withs = collection.get_Class('with', 'geometry');
                this.sub = defaults[0];
                this.with = withs[0];
                this.scope.graph.add_Edge(this.sub, this);
                this.scope.graph.add_Edge(this.with, this);
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'geometry', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_CSGSub_0);
    }

    get_NodeChildren(codegen) {
        switch (this.matched) {
            case 'default': {
                const ans = { default: { geometry: [...this.sub.get_TypeMapped('geometry')] }, with: { geometry: [...this.with.get_TypeMapped('geometry')] } };
                return ans;
            }
        }
    }

    get_Type() {
        return SDML_THREE_CSGSub.type;
    }

    static get type() {
        return new Types({ geometry: 1 });
    }
}

registe_Tag('csg-sub', SDML_THREE_CSGSub);