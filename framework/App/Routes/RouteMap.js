module.exports = class
{
    _ROUTES  = {};
    _REQUEST = {};

    setOrigin()
    {
        if(Object.keys(this._ROUTES).length>0)
        {
            for(const path in this._ROUTES){
                if(path==this._REQUEST.url) {
                    return this._ROUTES[path];
                }
            }
            return {};
        }
        else return {};
    }
    
}
