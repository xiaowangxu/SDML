import { TypesManagerSingleton, ExpTypes } from "../../SunDesign/Core.js";

// object3d
TypesManagerSingleton.extends(null, 'object3d', {
    name: {
        datatype: ExpTypes.base(ExpTypes.string),
        default: "'unnamed'"
    },
    pos: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0)'
    },
    rot: {
        datatype: ExpTypes.base(ExpTypes.euler),
        default: 'euler(0,0,0)'
    },
    scale: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(1)'
    }
});
TypesManagerSingleton.extends('object3d', 'scene', {
    bg: {
        datatype: ExpTypes.base(ExpTypes.color),
        default: 'color(0,0,0)'
    }
});
TypesManagerSingleton.extends('object3d', 'mesh', {

});
TypesManagerSingleton.extends('object3d', 'camera', {

});
TypesManagerSingleton.extends('camera', 'perspectivecamera', {
    fov: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '75'
    },
    near: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0.01'
    },
    far: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1000'
    }
});
//math
TypesManagerSingleton.extends(null, 'vec2', {
    x: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    y: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    }
});
// geo
TypesManagerSingleton.extends(null, 'geometry', {

});
TypesManagerSingleton.extends('geometry', 'boxgeometry', {
    w: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    h: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    d: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    ws: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    hs: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    ds: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
});
TypesManagerSingleton.extends('geometry', 'spheregeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    hs: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '16'
    },
    ds: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '16'
    },
    ps: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    pe: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: 'TAU'
    },
    ts: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    te: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: 'TAU'
    },
});
TypesManagerSingleton.extends('geometry', 'extrudegeometry', {
    curvesegments: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '12'
    },
    steps: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
    depth: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    bevelthickness: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    bevelsize: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0.'
    },
    beveloffset: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    bevelsegments: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
});
//material
TypesManagerSingleton.extends(null, 'material', {
});
TypesManagerSingleton.extends('material', 'standardmaterial', {
    color: {
        datatype: ExpTypes.base(ExpTypes.color),
        default: 'color(1,0,0)'
    },
    emissive: {
        datatype: ExpTypes.base(ExpTypes.color),
        default: 'color(0,0,0)'
    },
    roughness: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    metalness: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    flat: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'false'
    },
    wireframe: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'false'
    }
});
//curve
TypesManagerSingleton.extends(null, 'curve', {
});
TypesManagerSingleton.extends('curve', 'curveline', {
    s: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0)'
    },
    e: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(1)'
    },
});
TypesManagerSingleton.extends('curve', 'curvepath', {
    closed: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'false'
    }
});
TypesManagerSingleton.extends('curvepath', 'path', {
});
TypesManagerSingleton.extends('path', 'shape', {
});