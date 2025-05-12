import fs from "fs";

/**
 * Package class for handling read-modify-write operations
 * on the local package.json file.
 */
export default new class Package {

    #_PATH = './package.json';
    _JSON;

    /**
     * Constructor: Reads and 
     * parses package.json into _JSON.
     */
    constructor(){
        const content = fs.readFileSync(this.#_PATH, 'utf-8');
        this._JSON = JSON.parse(content);
    }
    
    /**
     * Accepts a callback function to modify the package.json content.
     * @param {Function} fn - A function that receives the JSON object for modification.
     * @returns {Package} - Returns 'this' for method chaining.
     */
    add(fn){
        fn(this._JSON);
        return this;
    }

    /**
     * Saves the modified JSON back to package.json with indentation.
     */
    save(){
        fs.writeFileSync(this.#_PATH, JSON.stringify(this._JSON, null, 2));
    }
}
