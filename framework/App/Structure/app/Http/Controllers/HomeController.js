const controller = use("App/Http/Controllers/Controller");

module.exports = class extends controller
{
    models = {
        User:'User'
    }

    constructor(){
        super();
    }


    index(){
        return view("welcome");
    }

    about(){
        return "dfsdfsdf";
    }

    tutorials(){    
        return view("welcome");
    }

    create(){
        return view("about");
    }


    store(){

    }


    edit(){

    }


    update(){
        return view("contact");
    }


    view(){

    }
}