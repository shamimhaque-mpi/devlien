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

        let route_api = await import(system.path("Routes/api.js"));
        let route_web = await import(system.path("Routes/web.js"));

        let _API_ROUTES = {};
        for(const path in route_api.default._ROUTES){
            _API_ROUTES['/api'+path] = route_api.default._ROUTES[path];
        }
        
        this._ROUTES = {..._API_ROUTES, ...route_web.default._ROUTES}
        this._REQUEST  = request;
        this._RESPONSE = response;
        
        return this._ROUTE = await this.getOrigin();
    }



    async getOrigin(){

        let _TARGET_PATH =  this._ROUTES[this._REQUEST.url];
        let _IS_ACCEPT   = _TARGET_PATH && (_TARGET_PATH.REQUEST_METHOD.includes(this._REQUEST.method.toLocaleUpperCase()) || _TARGET_PATH.REQUEST_METHOD.includes('ANY'))

        if(_IS_ACCEPT){
            return _TARGET_PATH;
        }
        return {};
    }


    async route(){
        return await this.setConfig(this.#request, this.#response, this.#system)
    }
}
