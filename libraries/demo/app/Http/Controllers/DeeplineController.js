import Controller from "deepline/controller" 


export default class DeeplineController extends Controller
{
    constructor(){
        super();
    }

    /**
     * Display the welcome or home page.
     * Route: GET /
     */
    index(request){
        return view("welcome");
    }

    /**
     * Display the documentation page.
     * Route: GET /docs
     */
    docs(request){
        return view("docs");
    }

    /**
     * Display the resources page.
     * Route: GET /resources
     */
    resources(request){
        return view("resources");
    }

    /**
     * Display the products page.
     * Route: GET /products
     */
    products(request){
        return view("products");
    }

    /**
     * Display the blog page.
     * Route: GET /blog
     */
    blog(request){
        return view("blog");
    }
}
