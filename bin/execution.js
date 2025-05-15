import readline from 'readline';
import process from 'process';
import { exec } from 'child_process';
import Package from './package.js';
import Migration from './migration.js';

export default class Execution {

    constructor(){
        this.base_path = process.cwd();
    }


    static start(fn){
        fn(new Execution(), process.argv.slice(2))
    }


    runMigrate(){
        Migration.execute();
    }




    async createMigration(name){
        Migration.create(name);
    }


    copyDemo(){
        exec(`cp -R ${this.base_path}/node_modules/deepline/libraries/demo/. ${this.base_path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }




    updatePackageJson(){
        Package.add((json)=>{
            json.type="module";
            json.scripts = {...{dev:"nodemon ./server.js"}, ...json.scripts};
        })
        .save();
    }




    ask(question, choices) {
        return new Promise(resolve => {
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
    
            let currentIndex = 0;
    
            function render() {
                console.clear();
                console.log(question+'\n');
                choices.forEach((choice, i) => {
                    const selected = i === currentIndex ? '◉' : '◯';
                    console.log(` ${selected} ${choice}`);
                });
                console.log('\nUse arrow keys (↑ ↓) and press Enter');
            }
    
            render();
    
            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);
    
            process.stdin.on('keypress', (_, key) => {
                if (key.name === 'up') {
                    currentIndex = (currentIndex - 1 + choices.length) % choices.length;
                    render();
                } 
                else if (key.name === 'down') {
                    currentIndex = (currentIndex + 1) % choices.length;
                    render();
                } 
                else if (key.name === 'return') {
                    rl.close();
                    process.stdin.setRawMode(false);
                    resolve(choices[currentIndex]);
                } 
                else if (key.ctrl && key.name === 'c') {
                    rl.close();
                    process.exit();
                }
            });
        });
    }
}