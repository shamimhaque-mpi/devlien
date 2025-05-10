import Validator from "./Validator.js";

let archive = {}

export default class Request extends Validator {


    static instance(body) {
        const app = new this(body);
        return app;
    }


    constructor(request){
        //
        archive  = request;
        super(request);
        
        // INIT CORE FIELDS
        const { fields } = request;
        for(const key in fields) this[key]=fields[key];
    }


    // GET ALL FILES
    files(){
        const { files } = archive;
        return files;
    }


    // GET AUTHORIZED USER
    user(){
        const { user } = archive;
        return user;
    }

    // 
    all(){
        const { fields } = archive;
        return fields;
    }
}