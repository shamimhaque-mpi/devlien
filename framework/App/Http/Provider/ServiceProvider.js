

export default class ServiceProvider {
    ROUTE_SERVICE = [];
    async route(route){
        this.ROUTE_SERVICE.push(route);
    }
}