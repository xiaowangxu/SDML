import { TypesManagerSingleton, ExpTypes } from "../../SunDesign/Core.js";

// object3d
TypesManagerSingleton.extends(null, 'object3d', {
    name: {
        datatype: ExpTypes.base(ExpTypes.string),
        default: "'unnamed'"
    },
    castshadow: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: "true"
    },
    receiveshadow: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: "true"
    },
    visible: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: "true"
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
TypesManagerSingleton.extends('object3d', 'light', {
    color: {
        datatype: ExpTypes.base(ExpTypes.color),
        default: 'color(1,1,1)'
    },
    intensity: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
});
TypesManagerSingleton.extends('light', 'ambientlight', {
    castshadow: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: "false"
    },
});
TypesManagerSingleton.extends('light', 'directionallight', {
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
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
    hs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
    ds: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
});
TypesManagerSingleton.extends('geometry', 'spheregeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    hs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '16'
    },
    ds: {
        datatype: ExpTypes.base(ExpTypes.int),
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
TypesManagerSingleton.extends('geometry', 'conegeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    h: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    rs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '16'
    },
    hs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
    capped: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'true'
    },
    ts: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    tl: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: 'TAU'
    },
});
TypesManagerSingleton.extends('geometry', 'lathegeometry', {
    rs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '16'
    },
    ps: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '12'
    },
    ts: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    tl: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: 'TAU'
    },
});
TypesManagerSingleton.extends('geometry', 'octahedrongeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    s: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '0'
    },
});
TypesManagerSingleton.extends('geometry', 'icosahedrongeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    s: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '0'
    },
});
TypesManagerSingleton.extends('geometry', 'dodecahedrongeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    s: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '0'
    },
});
TypesManagerSingleton.extends('geometry', 'tetrahedrongeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    s: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '0'
    },
});
TypesManagerSingleton.extends('geometry', 'cylindergeometry', {
    rt: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    rb: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    h: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    rs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '16'
    },
    hs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '1'
    },
    capped: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'true'
    },
    ts: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    tl: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: 'TAU'
    },
});
TypesManagerSingleton.extends('geometry', 'torusgeometry', {
    r: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '2'
    },
    t: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    rs: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '16'
    },
    ts: {
        datatype: ExpTypes.base(ExpTypes.int),
        default: '16'
    },
    l: {
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
TypesManagerSingleton.extends(null, 'geometry-transform', {
    transform: {
        datatype: ExpTypes.base(ExpTypes.mat4)
    },
});
TypesManagerSingleton.extends(null, 'csg-union', {
});
TypesManagerSingleton.extends(null, 'csg-sub', {
});
TypesManagerSingleton.extends(null, 'csg-intersect', {
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
TypesManagerSingleton.extends('curve', 'curveellipse', {
    center: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0)'
    },
    rx: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    ry: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '1'
    },
    as: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    ae: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: 'TAU'
    },
    clockwise: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'false'
    },
});
TypesManagerSingleton.extends('curve', 'curvequadbezier', {
    s: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0)'
    },
    c: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0.5, 1)'
    },
    e: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(1, 0)'
    },
});
TypesManagerSingleton.extends('curve', 'curvecubicbezier', {
    s: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0)'
    },
    c1: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0.25, 1)'
    },
    c2: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(0.75, -1)'
    },
    e: {
        datatype: ExpTypes.base(ExpTypes.vec2),
        default: 'vec2(1, 0)'
    },
});
TypesManagerSingleton.extends('curve', 'curvespline', {
    points: {
        datatype: ExpTypes.array(ExpTypes.base(ExpTypes.vec2)),
        default: '[vec2(0)]'
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
//curve3d
TypesManagerSingleton.extends(null, 'curve3d', {
});
TypesManagerSingleton.extends('curve3d', 'curveline3d', {
    s: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0)'
    },
    e: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(1)'
    },
});
TypesManagerSingleton.extends('curve3d', 'curvequadbezier3d', {
    s: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0)'
    },
    c: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0.5, 1, 0)'
    },
    e: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(1, 0, 0)'
    },
});
TypesManagerSingleton.extends('curve3d', 'curvecubicbezier3d', {
    s: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0)'
    },
    c1: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0.25, 1, 0)'
    },
    c2: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(0.75, -1, 0)'
    },
    e: {
        datatype: ExpTypes.base(ExpTypes.vec3),
        default: 'vec3(1, 0, 0)'
    },
});
TypesManagerSingleton.extends('curve3d', 'curvespline3d', {
    points: {
        datatype: ExpTypes.array(ExpTypes.base(ExpTypes.vec3)),
        default: '[vec3(0)]'
    },
    closed: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'false'
    },
    type: {
        datatype: ExpTypes.base(ExpTypes.string),
        default: "'centripetal'"
    },
    tension: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0.5'
    },
});
TypesManagerSingleton.extends('curve3d', 'curvepath3d', {
    closed: {
        datatype: ExpTypes.base(ExpTypes.bool),
        default: 'false'
    }
});
TypesManagerSingleton.extends('curvepath3d', 'path3d', {
});
// loader
TypesManagerSingleton.extends(null, 'loader', {
    url: { datatype: ExpTypes.base(ExpTypes.string) }
});
TypesManagerSingleton.extends('loader', 'stl', {
});
TypesManagerSingleton.extends('loader', 'obj', {
});

