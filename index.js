import Server from "devlien/server";


export default class devlien extends Server {
    serve(){
        return ["Server Started on port "+this.port];
    }
}