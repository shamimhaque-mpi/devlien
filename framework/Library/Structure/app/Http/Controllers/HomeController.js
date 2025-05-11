import Controller from "deepline/controller" 

export default class HomeController extends Controller
{
    constructor(){
        super();
    }


    index(){
        return view("welcome");
    }

    create(){
        return view("about");
    }


    store(){

    }

    update(){
        return view("contact");
    }

    view(){

    }
}