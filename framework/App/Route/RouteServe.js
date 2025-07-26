export default class RouteServe {
    _ROUTES   = {};
    _ROUTE    = {};
    _REQUEST  = {};
    _RESPONSE = {};

    #request;
    #response;
    #system;
    #routes;

    constructor({request, response, system, routes}){
        this.#request = request;
        this.#response = response;
        this.#system = system;
        this.#routes = routes;
    }

    async setConfig(request, response){

        var _ROUTES = {};
        this.#routes.forEach(router=>{
            for(const path in router._ROUTES){
                _ROUTES[path] = router._ROUTES[path];
            }
        });
        
        this._ROUTES   = _ROUTES;
        this._REQUEST  = request;
        this._RESPONSE = response;

        return this._ROUTE = await this.getOrigin();
    }



    async getOrigin(){

        for (const pattern in this._ROUTES){
            const match_route = this.matchRoute(pattern, this._REQUEST.url);
            
            if(match_route) {
                this._ROUTES[this._REQUEST.url] = this._ROUTES[pattern];
                this._ROUTES[this._REQUEST.url].PARAMS = match_route;
                break;
            }
        }

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


    matchRoute(pattern, url) {
        const PATTERN_PARTS = pattern.split('/');
        const urlParts = url.split('/');
        
        // First, extract all parameter info
        const paramInfo = [];
        PATTERN_PARTS.forEach((part, index) => {
            if (part.startsWith(':')) {
                const PARAM_NAME = part.slice(1);
                const IS_OPTIONAL = PARAM_NAME.endsWith('?');
                const CLEAN_NAME = IS_OPTIONAL ? PARAM_NAME.slice(0, -1) : PARAM_NAME;
                paramInfo.push({ name: CLEAN_NAME, optional: IS_OPTIONAL, index });
            }
        });
        
        // Try to match - use backtracking for optional parameters
        function tryMatch(patternIndex, urlIndex, params) {
            if (patternIndex >= PATTERN_PARTS.length) {
                return urlIndex === urlParts.length ? params : null;
            }
            
            const part = PATTERN_PARTS[patternIndex];
            
            if (part.startsWith(':')) {
                const PARAM_NAME = part.slice(1);
                const IS_OPTIONAL = PARAM_NAME.endsWith('?');
                const CLEAN_NAME = IS_OPTIONAL ? PARAM_NAME.slice(0, -1) : PARAM_NAME;
                
                if (IS_OPTIONAL) {
                    // Try skipping this optional parameter
                    const skipResult = tryMatch(patternIndex + 1, urlIndex, { ...params, [CLEAN_NAME]: null });
                    if (skipResult) return skipResult;
                }
                
                // Try using this parameter
                if (urlIndex < urlParts.length) {
                    return tryMatch(patternIndex + 1, urlIndex + 1, { ...params, [CLEAN_NAME]: urlParts[urlIndex] });
                }
                
                return null;
            } 
            else {
                // Static part
                if (urlIndex >= urlParts.length || urlParts[urlIndex] !== part) {
                    return null;
                }
                return tryMatch(patternIndex + 1, urlIndex + 1, params);
            }
        }
        
        return tryMatch(0, 0, {});
    }

}
