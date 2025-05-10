const server = require("./framework/Server.js");


module.exports = class extends server {
    serve(){
        return ["Server Started on port "+this.port];
    }
}