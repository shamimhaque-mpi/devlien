import path from "path";

export const methods = {
    url(){
        
    },
    path(uri=""){
        return path.join(process.cwd(), uri);
    },
    
    async use(namespace){
        let file = namespace.split('/').filter(e=>e).join('/')+'.js';
        return (await import(process.cwd()+'/'+file)).default;
    },
    asset(){

    },
    env(){

    },
    config(){
        
    },
    async view(path="", $param=false)
    {
        const view = new (await import("../View/View.js")).default;
        return view.getSource(path);
    },
    uriSanitize(uri=""){
        return uri.split('/').filter(row=>row).join('/');
    }
}