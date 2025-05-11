import Server from "deepline/server";


export default class deepline extends Server {
    serve(){
        return ["Server Started on port "+this.port];
    }
}