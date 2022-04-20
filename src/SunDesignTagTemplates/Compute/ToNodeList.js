import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../SunDesign/Core.js';
import { typeCheck } from '../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component, SDML_Compile_Error } from '../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../SunDesign/TagCollection.js';

const TAG_ToNodeList = {
    name: `component_ToNodeList`, code: `class component_ToNodeList extends ComponentBase {
    constructor(i, c, s, t) {
        super();
        this.t = t;
        this.init(i, c, s);
    }
    init(i, c, s) {
        this.r = {
            n: {[this.t]:i.array},
            e: {}
        }
    }
    update(i, c, s) {
        this.r.n[this.t] = i.array;
        return true;
    }
    dispose() {
        // console.log("dispose component_ToNodeList");
    }
}`}

class SDML_ToNodeList extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        const { type, datatype } = SDML_ToNodeList.get_HintType(ast)[0];
        super(scope, name, id, parent, ast, {
            array: {
                datatype: ExpTypes.array(datatype)
            }
        });
        this.exp_type = type;
    }

    static inputs = Types.NONE;

    to_Mermaid(ans, link) {
        ans.push(`Node_${this.uid}(to-node-list id=${this.id})`);
    }

    receive_Sub(types, collection, match_type) { }

    add_ToCollection(collection, param) {
        collection.add(param, this.exp_type, this);
    }

    get_CustomInit(codegen, nodename) {
        codegen.env.add_Template(TAG_ToNodeList.name, TAG_ToNodeList.code);
        return `new ${TAG_ToNodeList.name}(${codegen.get_NodeInputs(this)},{},{},'${this.exp_type}')`;
    }

    get_Type() {
        return new Types({ [this.exp_type]: Infinity });
    }

    static get type() {
        return undefined;
    }

    static get_HintType(ast) {
        const types = [];
        for (const type in ALL_INPUTS_TYPES) {
            if (type in ast.attributes) types.push({ type, datatype: ALL_INPUTS_TYPES[type].datatype() });
        }
        return types;
    }

    static get_OutputsTypes(ast) {
        const types = SDML_ToNodeList.get_HintType(ast);
        if (types.length === 0)
            throw new SDML_Compile_Error(`to-node-list node required a type hint like: <to-node-list int array="..." />`);
        if (types.length > 1)
            throw new SDML_Compile_Error(`multiple type hints appear in node <to-node-list ${types.map(i => i.type).join(' ')} array="..." />`);
        return new Types({ [types[0].type]: Infinity });
    }
}

registe_Tag('to-node-list', SDML_ToNodeList);