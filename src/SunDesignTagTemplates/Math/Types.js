import { TypesManagerSingleton, ExpTypes } from "../../SunDesign/Core.js";

// math
TypesManagerSingleton.extends(null, 'vec3', {
    x: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    y: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    z: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
});
TypesManagerSingleton.extends(null, 'vec2', {
    x: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
    y: {
        datatype: ExpTypes.base(ExpTypes.number),
        default: '0'
    },
});