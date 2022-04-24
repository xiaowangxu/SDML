export class ResourceLoader {
    constructor(env) {
        this.env = env;
    }

    load(url, ast) {
        return Promise.resolve(null);
    }
}
