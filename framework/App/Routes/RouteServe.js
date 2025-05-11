export default class RouteServe {
    _ROUTES   = {};
    _ROUTE    = {};
    _REQUEST  = {};
    _RESPONSE = {};

    #request;
    #response;
    #system;

    constructor({request, response, system}){
        this.#request = request;
        this.#response = response;
        this.#system = system;
    }

    async setConfig(request, response, system){

        let route = await import(system.path("Routes/api.js"));
        
        let routes = route.default.fetch();
        let _ROUTE = {};
        for(const url in routes){
            routes[url].PATH = "/api"+routes[url].PATH;
            _ROUTE['/api'+url] = routes[url];
        }


        this._ROUTES = _ROUTE
        this._REQUEST  = request;
        this._RESPONSE = response;
        
        return this._ROUTE = await this.getOrigin();
    }



    async getOrigin()
    {
        if(Object.keys(this._ROUTES).length>0) {
            for(const path in this._ROUTES){
                let isRequestAccept = this._REQUEST.method.toLocaleLowerCase() == this._ROUTES[path].REQUEST_METHOD.toLocaleLowerCase() || this._ROUTES[path].REQUEST_METHOD.toLocaleLowerCase()=='any';
                if(path==this._REQUEST.url && isRequestAccept) {
                    return this._ROUTES[path];
                }
            }
            return {};
        }
        else return {};
    }


    async route(){
        return await this.setConfig(this.#request, this.#response, this.#system)
    }
}
