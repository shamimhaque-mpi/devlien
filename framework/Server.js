import http from "http";
import kernel from "./App/Kernel";

export default class Server {
    port = 3080;
    constructor(){
        const app = http.createServer((req, res)=>{
            new kernel(req, res);
        });
        
        
        app.listen(this.port, ()=>{
            console.log("http://localhost:"+this.port);
        });
    }
}
