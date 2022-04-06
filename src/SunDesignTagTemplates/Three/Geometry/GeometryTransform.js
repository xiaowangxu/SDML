import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [transform     , children  ]
// BITMASKS = [1             , 2         ]

export const TAG_THREE_GeometryTransform_0 =
{
    name: 'component_THREE_GeometryTransform', code: `class component_THREE_GeometryTransform extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geo = c.default.geometry[0].clone();
        geo.applyMatrix4(i.transform);
        this.r = {
            n: { geometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.geometry[0];
        if (this.b[0] & 3) {
            geo.dispose();
            const _geo = c.default.geometry[0].clone();
            _geo.applyMatrix4(i.transform);
            this.r.n.geometry[0] = _geo;
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.geometry[0].dispose();
        this.r.n.geometry = undefined;
        // console.log("dispose component_THREE_GeometryTransform");
    }
}`}

class SDML_THREE_GeometryTransform extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, {
            transform: {
                datatype: ExpTypes.base(ExpTypes.mat4)
            }
        }, ['transform']);
        this.geo = null;
    }

    static inputs = {
        default: {
            default: new Types({
                geometry: 1
            })
        }
    };

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(geometry-transform id=${this.id} match=${this.matched})`);
        link.push(`Node_${this.geo.uid} -->|geometry| Node_${this.uid}`);
    }

    receive_Sub(types, collection, match_type) {
        switch (match_type) {
            case 'default': {
                const defaults = collection.get_Class('default', 'geometry');
                this.geo = defaults[0];
                this.scope.graph.add_Edge(this.geo, this);
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'geometry', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_GeometryTransform_0);
    }

    get_NodeChildren(codegen) {
        const ans = { default: { geometry: [...this.geo.get_TypeMapped('geometry')] } };
        return ans;
    }

    get_Type() {
        return SDML_THREE_GeometryTransform.type;
    }

    static get type() {
        return new Types({ geometry: 1 });
    }
}

registe_Tag('geometry-transform', SDML_THREE_GeometryTransform);