import { ALL_INPUTS_TYPES, DepGraph, Types, Collection, ExpTypes, TypesManagerSingleton, BitMask } from '../../../SunDesign/Core.js';
import { parse_Constant, parse_Expression, test_IdentifierName, test_Number } from '../../../SunDesign/Core.js';
import { typeCheck } from '../../../SunDesign/sPARks.js';
import { SDML_Compile_CodeGen, create_Component } from '../../../SunDesign/Compiler.js';
import { SDML_Compiler_Visitor } from '../../../SunDesign/TagVisitor.js';
import { registe_Tag } from '../../../SunDesign/TagCollection.js';

// BITMASKS = [color	, emissive	, roughness , metalness , flat  , wireframe	, children  ]
// BITMASKS = [1	    , 2		    , 4 	    , 8		    , 16    , 32        , 64        ]

export const STLLoader = `class STLLoader extends THREE.Loader {
    constructor(manager) {
        super(manager);
    }

    load(url, onLoad, onProgress, onError) {
        const scope = this;
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(url, function (text) {
            try {
                onLoad(scope.parse(text));
            } catch (e) {
                if (onError) {
                    onError(e);
                } else {
                    console.error(e);
                }
                scope.manager.itemError(url);
            }
        }, onProgress, onError);
    }

    parse(data) {
        function isBinary(data) {
            const reader = new DataView(data);
            const face_size = (32 / 8 * 3) + ((32 / 8 * 3) * 3) + (16 / 8);
            const n_faces = reader.getUint32(80, true);
            const expect = 80 + (32 / 8) + (n_faces * face_size);
            if (expect === reader.byteLength) {
                return true;
            }
            
            const solid = [115, 111, 108, 105, 100];
            for (let off = 0; off < 5; off++) {
                if (matchDataViewAt(solid, reader, off)) return false;
            }
            return true;
        }
        function matchDataViewAt(query, reader, offset) {
            for (let i = 0, il = query.length; i < il; i++) {
                if (query[i] !== reader.getUint8(offset + i)) return false;
            }
            return true;
        }
        function parseBinary(data) {
            const reader = new DataView(data);
            const faces = reader.getUint32(80, true);
            let r, g, b, hasColors = false, colors;
            let defaultR, defaultG, defaultB, alpha;
            for (let index = 0; index < 80 - 10; index++) {
                if ((reader.getUint32(index, false) == 0x434F4C4F /*COLO*/) &&
                    (reader.getUint8(index + 4) == 0x52 /*'R'*/) &&
                    (reader.getUint8(index + 5) == 0x3D /*'='*/)) {
                    hasColors = true;
                    colors = new Float32Array(faces * 3 * 3);
                    defaultR = reader.getUint8(index + 6) / 255;
                    defaultG = reader.getUint8(index + 7) / 255;
                    defaultB = reader.getUint8(index + 8) / 255;
                    alpha = reader.getUint8(index + 9) / 255;
                }
            }
            const dataOffset = 84;
            const faceLength = 12 * 4 + 2;
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(faces * 3 * 3);
            const normals = new Float32Array(faces * 3 * 3);
            for (let face = 0; face < faces; face++) {
                const start = dataOffset + face * faceLength;
                const normalX = reader.getFloat32(start, true);
                const normalY = reader.getFloat32(start + 4, true);
                const normalZ = reader.getFloat32(start + 8, true);
                if (hasColors) {
                    const packedColor = reader.getUint16(start + 48, true);
                    if ((packedColor & 0x8000) === 0) {
                        r = (packedColor & 0x1F) / 31;
                        g = ((packedColor >> 5) & 0x1F) / 31;
                        b = ((packedColor >> 10) & 0x1F) / 31;
                    } else {
                        r = defaultR;
                        g = defaultG;
                        b = defaultB;
                    }
                }
                for (let i = 1; i <= 3; i++) {
                    const vertexstart = start + i * 12;
                    const componentIdx = (face * 3 * 3) + ((i - 1) * 3);
                    vertices[componentIdx] = reader.getFloat32(vertexstart, true);
                    vertices[componentIdx + 1] = reader.getFloat32(vertexstart + 4, true);
                    vertices[componentIdx + 2] = reader.getFloat32(vertexstart + 8, true);
                    normals[componentIdx] = normalX;
                    normals[componentIdx + 1] = normalY;
                    normals[componentIdx + 2] = normalZ;
                    if (hasColors) {
                        colors[componentIdx] = r;
                        colors[componentIdx + 1] = g;
                        colors[componentIdx + 2] = b;
                    }
                }
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
            if (hasColors) {
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geometry.hasColors = true;
                geometry.alpha = alpha;
            }
            return geometry;
        }
        function parseASCII(data) {
            const geometry = new THREE.BufferGeometry();
            const patternSolid = /solid([\s\S]*?)endsolid/g;
            const patternFace = /facet([\s\S]*?)endfacet/g;
            let faceCounter = 0;
            const patternFloat = /[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source;
            const patternVertex = new RegExp('vertex' + patternFloat + patternFloat + patternFloat, 'g');
            const patternNormal = new RegExp('normal' + patternFloat + patternFloat + patternFloat, 'g');
            const vertices = [];
            const normals = [];
            const normal = new THREE.Vector3();
            let result;
            let groupCount = 0;
            let startVertex = 0;
            let endVertex = 0;
            while ((result = patternSolid.exec(data)) !== null) {
                startVertex = endVertex;
                const solid = result[0];
                while ((result = patternFace.exec(solid)) !== null) {
                    let vertexCountPerFace = 0;
                    let normalCountPerFace = 0;
                    const text = result[0];
                    while ((result = patternNormal.exec(text)) !== null) {
                        normal.x = parseFloat(result[1]);
                        normal.y = parseFloat(result[2]);
                        normal.z = parseFloat(result[3]);
                        normalCountPerFace++;
                    }
                    while ((result = patternVertex.exec(text)) !== null) {
                        vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                        normals.push(normal.x, normal.y, normal.z);
                        vertexCountPerFace++;
                        endVertex++;
                    }
                    if (normalCountPerFace !== 1) {
                        console.error('THREE.STLLoader: Something isn\\\'t right with the normal of face number ' + faceCounter);
                    }
                    if (vertexCountPerFace !== 3) {
                        console.error('THREE.STLLoader: Something isn\\\'t right with the vertices of face number ' + faceCounter);
                    }
                    faceCounter++;
                }
                const start = startVertex;
                const count = endVertex - startVertex;
                geometry.addGroup(start, count, groupCount);
                groupCount++;
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            return geometry;
        }

        function ensureString(buffer) {
            if (typeof buffer !== 'string') {
                return THREE.LoaderUtils.decodeText(new Uint8Array(buffer));
            }
            return buffer;
        }

        function ensureBinary(buffer) {
            if (typeof buffer === 'string') {
                const array_buffer = new Uint8Array(buffer.length);
                for (let i = 0; i < buffer.length; i++) {
                    array_buffer[i] = buffer.charCodeAt(i) & 0xff; // implicitly assumes little-endian
                }
                return array_buffer.buffer || array_buffer;
            } else {
                return buffer;
            }
        }
        const binData = ensureBinary(data);
        return isBinary(binData) ? parseBinary(binData) : parseASCII(ensureString(data));
    }
}`

export const TAG_THREE_STL_0 =
{
    name: 'component_THREE_STL', code: `class component_THREE_STL extends ComponentBase {
    constructor(i, c, s) {
        super();
        this.b = [0];
        this.init(i, c, s);
    }
    init(i, c, s) {
        const geometry = new THREE.BufferGeometry();
        const on_loaded = (geo) => {
            this.r.n.geometry[0].copy(geo);
            geo.dispose();
        }
        new THREE.STLLoader().load(i.url, on_loaded);
        this.r = {
            n: { geometry: [geometry] },
            e: {}
        }
    }
    update(i, c, s) {
        const geometry = this.r.n.geometry[0];
        
        return false;
    }
    dispose() {
        this.r.n.geometry[0].dispose();
        this.r.n.geometry = undefined;
        // console.log("dispose component_THREE_STL");
    }
}`}

class SDML_THREE_STL extends SDML_Compiler_Visitor {
    constructor(scope, name, id, parent, ast) {
        super(scope, name, id, parent, ast, TypesManagerSingleton.param('stl'), ['url']);
    }

    static inputs = Types.NONE;

    to_Mermaid(ans) {
        ans.push(`Node_${this.uid}(geometry id=${this.id})`);
    }

    add_ToCollection(collection, param) {
        collection.add(param, 'geometry', this);
    }

    get_Type() {
        return SDML_THREE_STL.type;
    }

    get_NewNode(codegen) {
        // codegen.env.add_Template('$STLLoader', STLLoader);
        return codegen.registe_Template(TAG_THREE_STL_0);
    }

    static get type() {
        return new Types({ geometry: 1 });
    }
}

registe_Tag('stl', SDML_THREE_STL);