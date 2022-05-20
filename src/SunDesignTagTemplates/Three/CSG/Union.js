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
	name: 'component_THREE_CSGUnion_0', code: `class component_THREE_CSGUnion_0 extends ComponentBase {
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
        // console.log("dispose TAG_THREE_CSGUnion_0");
    }
}`}

export const TAG_THREE_CSGUnion_1 =
{
	name: 'component_THREE_CSGUnion_1', code: `class component_THREE_CSGUnion_1 extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        let geo = null;
        if (c.default.geometry.length === 0) throw new Error("CSG.union required at least one geometry");
        if (c.default.geometry.length === 1) geo = c.default.geometry[0];
        else {
            const bsp = c.default.geometry.reduce((bsp, geo, idx)=>{
                if (idx === 1) bsp = CSG.fromGeometry(bsp);
                const geo_bsp = CSG.fromGeometry(geo);
                return bsp.union(geo_bsp);
            });
            geo = CSG.toGeometry(bsp);
        }
        this.r = {
            n: { geometry: [geo] },
            e: {}
        }
    }
    update(i, c, s) {
        const geo = this.r.n.geometry[0];
        if (this.b[0] & 1) {
            geo.dispose();
            if (c.default.geometry.length === 0) throw new Error("CSG.union required at least one geometry");
            if (c.default.geometry.length === 1) this.r.n.geometry[0] = c.default.geometry[0];
            else {
                const bsp = c.default.geometry.reduce((bsp, _geo, idx)=>{
                    if (idx === 1) bsp = CSG.fromGeometry(bsp);
                    const geo_bsp = CSG.fromGeometry(_geo);
                    return bsp.union(geo_bsp);
                });
                this.r.n.geometry[0] = CSG.toGeometry(bsp);
            }
            return true;
        }
        return false;
    }
    dispose() {
        this.r.n.geometry[0]?.dispose();
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
		multiple: {
			default: new Types({
				geometry: Infinity,
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
		if (this.matched === 'multiple') {
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
			case 'multiple': {
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
		return this.matched === 'default' ? codegen.registe_Template(TAG_THREE_CSGUnion_0) : codegen.registe_Template(TAG_THREE_CSGUnion_1);
	}

	get_NodeChildren(codegen) {
		switch (this.matched) {
			case 'default': {
				const ans = { default: { geometry: [] } };
				this.subs.forEach(s => ans.default.geometry.push(...s.get_TypeMapped('geometry')));
				return ans;
			}
			case 'multiple': {
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