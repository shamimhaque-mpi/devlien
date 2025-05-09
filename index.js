const server = require("deepline/framework/Server");


module.exports = class extends server {
    serve(){
        return ["Server Started on port "+this.port];
    }
}