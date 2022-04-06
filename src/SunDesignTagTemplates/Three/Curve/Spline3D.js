import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [points	, closed     , type   , tension 	, children	    ]
// BITMASKS = [1	    , 2          , 4      , 8		    , 16		    ]

export const TAG_THREE_CurveSpline3D_0 =
{
    name: 'component_THREE_CurveSpline3D_0', code: `class component_THREE_CurveSpline3D_0 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curvespline3d: [new THREE.CatmullRomCurve3(i.points, i.closed, i.type, i.tension)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 15) {
            this.r.n.curvespline3d[0] = new THREE.CatmullRomCurve3(i.points, i.closed, i.type, i.tension);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveSpline3D");
    }
}`}

export const TAG_THREE_CurveSpline3D_1 =
{
    name: 'component_THREE_CurveSpline3D_1', code: `class component_THREE_CurveSpline3D_1 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: { curvespline3d: [new THREE.CatmullRomCurve3(c.default.vec3, i.closed, i.type, i.tension)] },
            e: {}
        }
    }
    update(i, c, s) {
        let $changed = false;
        if (this.b[0] & 30) {
            this.r.n.curvespline3d[0] = new THREE.CatmullRomCurve3(c.default.vec3, i.closed, i.type, i.tension);
            $changed ||= true;
        }
        return $changed;
    }
    dispose() {
        // console.log("dispose component_THREE_CurveSpline3D");
    }
}`}

class component_THREE_CurveSpline3D extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('curvespline3d'), ['points', 'closed', 'type', 'tension']);
        this.has_points = ast.attributes.points === undefined ? false : true;
        this.points_str = ast.attributes.points;
        this.matched = null;
        this.vec3 = null;
    }

    static inputs = {
        empty: {
            default: new Types()
        },
        default: {
            default: new Types({
                vec3: Infinity
            })
        },

    };

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(curve-spline-3d id=${this.id} match=${this.matched})`);
        if (this.matched === 'default')
            for (const sub of this.vec3) {
                link.push(`Node_${sub.uid} -->|vec3| Node_${this.uid}`);
            }
    }

    receive_Sub(types, collection, match_type) {
        this.matched = match_type;
        switch (match_type) {
            case 'default': {
                const defaults = collection.get_Class('default', 'vec3');
                this.vec3 = defaults;
                for (const node of defaults) {
                    this.scope.graph.add_Edge(node, this);
                }
                if (this.has_points) throw new SDML_Compile_Error(`in node <curvespline3d points="${this.points_str}"/> it is using <vec3 /> sub nodes to define the spline so you should not used inline exp 'points'`)
                delete this.params.points;
                break;
            }
            case 'empty': {
                break;
            }
        }
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'curvespline3d', this);
    }

    get_NewNode(codegen) {
        return this.matched === 'default' ? codegen.registe_Template(TAG_THREE_CurveSpline3D_1) : codegen.registe_Template(TAG_THREE_CurveSpline3D_0);
    }

    get_NodeChildren(codegen) {
        switch (this.matched) {
            case 'default': {
                const ans = { default: { vec3: [] } };
                this.vec3.forEach(s => ans.default.vec3.push(...s.get_TypeMapped('vec3')));
                return ans;
            }
            case 'empty': {
                return {};
            }
        }
    }

    get_Type() {
        return component_THREE_CurveSpline3D.type;
    }

    static get type() {
        return new Types({ curvespline3d: 1 });
    }
}

registe_Tag('curvespline3d', component_THREE_CurveSpline3D);