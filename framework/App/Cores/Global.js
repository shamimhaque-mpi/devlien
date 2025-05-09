module.exports = gbl = {
    url(){
        
    },
    path(uri=""){
        return process.cwd()+"/"+gbl.uriSanitize(uri);
    },
    use(namespace){
        return require(process.cwd()+"/node_modules/deepline/framework/"+gbl.uriSanitize(namespace));
    },
    asset(){

    },
    env(){

    },
    config(){
        
    },
    view(path="", $param=false)
    {
        const view = new (require("../View/View"));
        return view.getSource(path);
    },
    uriSanitize(uri=""){
        return uri.split('/').filter(row=>(row?row:false)).join('/');
    }
}