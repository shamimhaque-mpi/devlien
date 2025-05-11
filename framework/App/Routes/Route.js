

var route = {
    records : {},
    config  : {},
    get(url, namespace) {
        route.sanitize(url, namespace, 'get');
    },
    post(url, namespace) {
        route.sanitize(url, namespace, 'post');
    },
    any(url, namespace) {
        route.sanitize(url, namespace, 'any');
    },
    match(url, namespace) {
        route.sanitize(url, namespace, 'match');
    },
    fetch(){
        return route.records;
    },


    sanitize(url, namespace="", method) {
        let implode = namespace.split("@");
        
        if(implode.length>1){

            let mkpath = "";
            if(route.config.prefix) mkpath += '/'+route.config.prefix.split('/').join('/');

            let _middleware = [];
            if(route.config.middleware){
                _middleware = route.config.middleware;
            }


            route.records[mkpath + url] = {
                PATH:mkpath + url,
                CONTROLLER:implode[0],
                METHOD:implode[1],
                REQUEST_METHOD:method,
                MIDDLEWARE:_middleware
            };

        }
        else return false
    },


    group(config, fn){
        route.config = config;
        fn(route);
    }
};

export default route;