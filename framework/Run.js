import kernel from "./App/Kernel"

export default class Run {
    #request;
    #config;
    constructor(request, config={path:''}){
        this.#config = config;
        this.#request = request; 
    }


    async getResponse(){
        return new kernel(this.#request, null, this.#config);
    }
}