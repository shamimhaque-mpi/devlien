const http   = require('http');
const kernel = require('./App/Kernel');

module.exports = class {
    port = 3080;
    constructor(){
        const app = http.createServer((req, res)=>{
            new kernel.default(req, res);
        });
        
        
        app.listen(this.port, ()=>{
            console.log("http://localhost:"+this.port);
        });
    }
}
