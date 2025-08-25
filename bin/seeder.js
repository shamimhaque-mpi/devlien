import System from "devlien/system";
import fs from "fs";
import path from "path";

export default class Seeder {
    /**
     * Execute the given database seeder.
     *
     * This method loads and runs a seeder file located in the
     * `database/seeders` directory. If no file is provided,
     * it defaults to `DatabaseSeeder.js`. The seeder is executed
     * using the framework's Database instance, and the process
     * is logged in the terminal.
     *
     * @param {string|null} file      The seeder file to run (default: DatabaseSeeder.js).
     * @param {object} terminal       The terminal instance used to print the message on the termiinal.
     * @return {Promise<void>}
     */
    static async execute(file=null, terminal) {
        try{
            const baseEnv = (await import("devlien/env")).baseEnv;
            const Database = (await import("devlien/database")).default;

            if(!file) file='DatabaseSeeder.js';
            
            terminal.addLine('database/seeders/'+file+' @space PROCESSING');
            let seeder = await System.import(path.join(baseEnv.BASE_PATH, 'database/seeders/', file));
            await seeder.run(new Database);
            terminal.addLine('database/seeders/'+file+' @space PROCESSED', 'success');
        }
        catch(e){
            console.log(e);
        }
        process.exit();
    }
    

    /**
     * Create a new database seeder file.
     *
     * This method generates a new seeder file inside the `database/seeders`
     * directory using a standard seeder template. The placeholder `@seeder`
     * inside the template will be replaced with the given seeder name.
     * Progress is logged to the terminal.
     *
     * @param {string} name        The name of the seeder class to create.
     * @param {object} terminal    The terminal instance used to print the message on the termiinal.
     * @return {Promise<void>}
     */
    static async create(name, terminal){

        try {
            const file = `database/seeders/${name}.js`

            terminal.addLine(`${file} @space GENERATING`);

            let path = System.vendorPath('libraries/standard/seeder.js');

            var content = fs.readFileSync(path, 'utf-8');
                content = content.replaceAll('@seeder', name)

            fs.writeFileSync(System.path(file), content);

            terminal.addLine(`${file} @space GENERATED`, 'success');
        }
        catch(e){
            console.log(e);
        }
    }
}