import fs from "fs";
import path from "path";

export default class DIR 
{
    constructor(){}

    static async copy(source, destination) {
        try {
            fs.cp(source, destination, { recursive: true }, (err) => {
                if (err) throw err;
            });
        } catch (err) {
            throw err;
        }
    }
}