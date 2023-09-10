'use strict';

export interface WebpackEnvironment {
    NODE_ENV: string;
}

class Context {
    public mode: string = "";
    public env: WebpackEnvironment | null = null;
   
    public prepareEnv(env: WebpackEnvironment, mode: string) {
        this.mode = mode;
        this.env = env;
    }

    public getMode() {
        return this.mode;
    }

    public getEnv() {
        return this.env;
    }
}

const context =  new Context();
export {
    context
}

