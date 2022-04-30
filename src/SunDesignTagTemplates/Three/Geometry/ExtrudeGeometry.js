import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [curvesegments, steps     , depth    , bevelthickness , bevelsize    , beveloffset , bevelsegments, children  ]
// BITMASKS = [1	        , 2	        , 4 	   , 8		        , 16           , 32          , 64           , 128        ]

export const TAG_THREE_ExtrudeGeometry_0 =
{
	name: 'component_THREE_ExtrudeGeometry', code: `class component_THREE_ExtrudeGeometry extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const extrudeSettings = {
            curveSegments: i.curvesegments,
            steps: i.steps,
            depth: i.depth,
            bevelEnabled: i.bevelthickness !== 0,
            bevelThickness: i.bevelthickness,
            bevelSize: i.bevelsize,
            bevelOffset: i.beveloffset,
            bevelSegments: i.bevelsegments,
            extrudePath: c.default.curve3d[0],
        };
        const geo = new THREE.ExtrudeGeometry(c.default.shape[0], extrudeSettings);
        this.r = {
            n: { extrudegeometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.extrudegeometry[0];
        if (this.b[0] & 255) {
            geo.dispose();
            const extrudeSettings = {
                curveSegments: i.curvesegments,
                steps: i.steps,
                depth: i.depth,
                bevelEnabled: i.bevelthickness !== 0,
                bevelThickness: i.bevelthickness,
                bevelSize: i.bevelsize,
                bevelOffset: i.beveloffset,
                bevelSegments: i.bevelsegments,
                extrudePath: c.default.curve3d[0],
            };
            this.r.n.extrudegeometry[0] = new THREE.ExtrudeGeometry(c.default.shape[0], extrudeSettings);
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.extrudegeometry[0].dispose();
        this.r.n.extrudegeometry = undefined;
        // console.log("dispose TAG_THREE_ExtrudeGeometry_0");
    }
}`}

class SDML_THREE_ExtrudeGeometry extends SDML_Compiler_Visitor {
	constructor(scope, name, id, parent, ast) {
		super(scope, name, id, parent, ast, TypesManagerSingleton.param('extrudegeometry'), ['curvesegments', 'steps', 'depth', 'bevelthickness', 'bevelsize', 'beveloffset', 'bevelsegments']);
		this.matched = null;
		this.shape = null;
		this.curve = null;
	}

	static entries = [];
	static inputs = {
		default: {
			default: new Types({
				shape: 1,
				curve3d: 1,
			})
		},
	};
	static exports = {};

	to_Mermaid(ans, link) {
		ans.push(`Node_${this.uid}(extrude-geometry id=${this.id} match=${this.matched})`);
		if (this.matched === 'default') {
			link.push(`Node_${this.shape.uid} -->|shape| Node_${this.uid}`);
			link.push(`Node_${this.curve.uid} -->|curve| Node_${this.uid}`);
		}
	}

	receive_Sub(types, collection, match_type) {
		this.matched = match_type;
		switch (match_type) {
			case 'default': {
				const shape = collection.get_Class('default', 'shape');
				this.shape = shape[0];
				const curve = collection.get_Class('default', 'curve3d');
				this.curve = curve[0];
				this.scope.graph.add_Edge(this.shape, this);
				this.scope.graph.add_Edge(this.curve, this);
				break;
			}
		}
	}

	add_ToCollection(collection, param) {
		collection.add(param, 'extrudegeometry', this);
	}

	get_NewNode(codegen) {
		return codegen.registe_Template(TAG_THREE_ExtrudeGeometry_0);
	}

	get_NodeChildren(codegen) {
		switch (this.matched) {
			case 'default': {
				const ans = { default: { shape: [...this.shape.get_TypeMapped('shape')], curve3d: [...this.curve.get_TypeMapped('curve3d')] } };
				return ans;
			}
		}
	}

	get_Type() {
		return SDML_THREE_ExtrudeGeometry.type;
	}

	static get type() {
		return new Types({ extrudegeometry: 1 });
	}
}

registe_Tag('extrudegeometry', SDML_THREE_ExtrudeGeometry);