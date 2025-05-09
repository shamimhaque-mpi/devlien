var route = {
    records : {},
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
            route.records[url] = {
                PATH:url,
                CONTROLLER:implode[0],
                METHOD:implode[1],
                REQUEST_METHOD:method,
            };
        }
        else return false
    }
};

module.exports = route;