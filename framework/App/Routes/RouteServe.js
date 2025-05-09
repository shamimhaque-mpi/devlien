const map  = require('./RouteMap');


module.exports = class extends map
{
    _ROUTES   = {};
    _ROUTE    = {};
    _REQUEST  = {};
    _RESPONSE = {};

    constructor({request, response, system}){
        super();

        let route = require(system.path("routes/web"));

        this._ROUTES   = route.fetch();

        this._REQUEST  = request;
        this._RESPONSE = response;
        this._ROUTE    = this.setOrigin();
    }


    route(){
        return this._ROUTE;
    }
}
