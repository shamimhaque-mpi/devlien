import readline from 'readline';
import process from 'process';
import { exec } from 'child_process';
import Package from './package.js';
import Migration from './migration.js';
import Model from './model.js';
import Controller from './controller.js';
import Resource from './resource.js';
import path from 'path';
import Cache from './cache.js';

export default class Execution {

    constructor(){
        this.base_path = process.cwd();
    }


    static start(fn){
        fn(new Execution(), process.argv.slice(2))
    }


    async createMigration(name){
        Migration.create(name);
    }


    async createModel(modelName){
        Model.create(modelName);
    }


    async createController(modelName){
        Controller.create(modelName);
    }


    async createResource(modelName){
        Resource.create(modelName);
    }


    runMigrate(){
        Migration.execute();
    }

    runMigrateRollback(param=null){
        Migration.rollback(param);
    }

    cacheClear(){
        Cache.clear();
    }

    copyDemo(){
        exec(`cp -R ${this.base_path}/node_modules/deepline/libraries/demo/. ${this.base_path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }




    copyNuxtDemo(){
        exec(`cp -R ${this.base_path}/node_modules/deepline/libraries/core/* ${path.join(this.base_path, 'server/')}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            else {
                exec(`cp -R ${path.join(this.base_path, '/node_modules/deepline/libraries/nuxt/*')} ${path.join(this.base_path, 'server/')}`, ()=>{});
                exec(`cp ${path.join(this.base_path, '/node_modules/deepline/libraries/nuxt/.env')} ${this.base_path}`, ()=>{});
            }
        });
    }

    copyNextDemo(){
        
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