import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [closed   , children	]
// BITMASKS = [1        , 2 	    ]

export const TAG_THREE_Path_0 =
{
    name: 'component_THREE_Path', code: `class component_THREE_Path extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        const path = new THREE.Path();
        path.autoClose = i.closed;
        path.curves = c.default.curve;
        this.r = {
            n: { path: [path] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 3) {
            const path = new THREE.Path();
            path.autoClose = i.closed;
            path.curves = c.default.curve;
            this.r.n.path[0] = path;
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_Path");
    }
}`}

class SDML_THREE_Path extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('path'), ['closed']);
        this.matched = null;
        this.subs = [];
    }

    static entries = [];
    static inputs = {
        default: {
            default: new Types({
                curve: Infinity
            })
        },
    };
    static exports = {};

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(path id=${this.id} match=${this.matched})`);
        if (this.matched === 'default')
            for (const sub of this.subs) {
                link.push(`Node_${sub.uid} -->|curve| Node_${this.uid}`);
            }
    }

    receive_Sub(types, collection, match_type) {
        this.matched = match_type;
        switch (match_type) {
            case 'default': {
                const defaults = collection.get_Class('default', 'curve');
                this.subs = defaults;
                for (const node of defaults) {
                    this.scope.graph.add_Edge(node, this);
                }
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'path', this);
    }

    get_NewNode(codegen) {
        return codegen.registe_Template(TAG_THREE_Path_0);
    }

    get_NodeChildren(codegen) {
        switch (this.matched) {
            case 'default': {
                const ans = { default: { curve: [] } };
                this.subs.forEach(s => ans.default.curve.push(...s.get_TypeMapped('curve')));
                return ans;
            }
        }
    }

    get_Type() {
        return SDML_THREE_Path.type;
    }

    static get type() {
        return new Types({ path: 1 });
    }
}

registe_Tag('path', SDML_THREE_Path);