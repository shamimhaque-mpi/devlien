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
import os from "os";

export default class Execution {

    constructor(){
        this.base_path = process.cwd();
        this.os = os.platform();
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

        var cmd_core_files = `cp -R ${this.base_path}/node_modules/deepline/libraries/core/* ${path.join(this.base_path, 'server/')}`;
        var cmd_nuxt_files = `cp -R ${path.join(this.base_path, '/node_modules/deepline/libraries/nuxt/*')} ${path.join(this.base_path, 'server/')}`;
        var cmd_env_clone  = `cp ${path.join(this.base_path, '/node_modules/deepline/libraries/nuxt/.env')} ${this.base_path}`;
        var cmd_env_remov  = `rm -rf ${path.join(this.base_path, 'server/.env')}`;


        if(this.os=='win32'){
            cmd_core_files = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/core')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_nuxt_files = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/nuxt')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_env_clone  = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/nuxt/.env')}" "${this.base_path}" /Y`;
            cmd_env_remov = `del /F /Q "${path.join(this.base_path, 'server/.env')}"`;
        }


        exec(cmd_core_files, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            else {
                exec(cmd_nuxt_files, (error)=>{
                    if(!error)
                    exec(cmd_env_clone, (error)=>{
                        if(!error)
                        exec(cmd_env_remov, (error)=>{
                            // if(!error)
                            // setTimeout(()=>{Cache.clear();}, 5000)
                        });
                    });
                });
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