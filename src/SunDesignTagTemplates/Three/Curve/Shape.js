import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [closed   , default	, holes ]
// BITMASKS = [1        , 2	         , 4     ]

export const TAG_THREE_Shape_0 =
{
    name: 'component_THREE_Shape', code: `class component_THREE_Shape extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const shape = new THREE.Shape();
        shape.autoClose = i.closed;
        shape.curves = c.default.curve;
        shape.holes = c.holes.path;
        this.r = {
            n: { shape: [shape] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 7) {
            const shape = new THREE.Shape();
            shape.autoClose = i.closed;
            shape.curves = c.default.curve;
            shape.holes = c.holes.path;
            this.r.n.shape[0] = shape;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Shape");
    }
}`}

class SDML_THREE_Shape extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('shape'), ['closed']);
        this.matched = null;
        this.subs = [];
        this.holes = [];
    }

    static entries = ['holes'];
    static inputs = {
        default: {
            default: new Types({
                curve: Infinity
            }),
            holes: new Types({
                path: Infinity
            })
        },
    };
    static exports = {};

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(shape id=${this.id} match=${this.matched})`);
        if (this.matched === 'default') {
            for (const sub of this.subs) {
                link.push(`Node_${sub.uid} -->|curve| Node_${this.uid}`);
            }
            for (const sub of this.holes) {
                link.push(`Node_${sub.uid} -->|holes:path| Node_${this.uid}`);
            }
        }
    }

    receive_Sub(types, collection, match_type) {
        this.matched = match_type;
        switch (match_type) {
            case 'default': {
                const defaults = collection.get_Class('default', 'curve');
                this.subs = defaults;
                const holes = collection.get_Class('holes', 'path');
                this.holes = holes;
                for (const node of defaults) {
                    this.scope.graph.add_Edge(node, this);
                }
                for (const node of holes) {
                    this.scope.graph.add_Edge(node, this);
                }
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'shape', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_Shape_0);
    }

    get_NodeChildren(codegen) {
        switch (this.matched) {
            case 'default': {
                const ans = { default: { curve: [] }, holes: { path: [] } };
                this.subs.forEach(s => ans.default.curve.push(...s.get_TypeMapped('curve')));
                this.holes.forEach(s => ans.holes.path.push(...s.get_TypeMapped('path')));
                return ans;
            }
        }
    }

    get_Type() {
        return SDML_THREE_Shape.type;
    }

    static get type() {
        return new Types({ shape: 1 });
    }
}

registe_Tag('shape', SDML_THREE_Shape);