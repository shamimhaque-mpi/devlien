import ResouceCollection from "devlien/resouceCollection";

export default class @resource extends ResouceCollection {

    static namespace = @namespace;

    static collection = false;
    
    async toJson(model){
        return model;
    }
}