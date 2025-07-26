import readline from 'readline';
import process from 'process';
import { exec } from 'child_process';
import Package from './package.js';
import Migration from './migration.js';
import Model from './model.js';
import Controller from './controller.js';
import Resource from './resource.js';
import Seeder from './seeder.js';
import path from 'path';
import Cache from './cache.js';
import os from "os";
import { promisify } from 'util';
import Terminal from "./terminal.js";
import DIR from '../framework/App/Core/Helpers/DIR.js';

export default class Execution {

    execPromise = promisify(exec);

    constructor(){
        this.base_path = process.cwd();
        this.os = os.platform();
        this.terminal = new Terminal;
    }


    static start(fn){
        fn(new Execution(), process.argv.slice(2))
    }


    async createMigration(name){
        Migration.create(name, this.terminal);
    }


    runMigrate(){
        Migration.execute(this.terminal);
    }

    runMigrateRollback(param=null){
        Migration.rollback(param, this.terminal);
    }


    async createModel(modelName){
        Model.create(modelName, this.terminal);
    }


    async createController(modelName){
        Controller.create(modelName, this.terminal);
    }


    async createResource(modelName){
        Resource.create(modelName, this.terminal);
    }


    async createSeeder(modelName){
        Seeder.create(modelName, this.terminal);
    }


    async DBSeed(modelName=null){
        Seeder.execute(modelName, this.terminal);
    }

    cacheClear(){
        this.terminal.addLine('cache @space clearing')
        Cache.clear();
        this.terminal.addLine('cache @space cleared', 'success')
    }

    async copyDemo(){
        try {
            this.terminal.addLine('Core files are being generated @space processing');
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/core/`, `${path.join(this.base_path, '')}`);
            this.terminal.addLine('Core files have been generated @space done', 'success');
            
            await this.createEnv();

            this.terminal.addLine('package.json is updating @space processing');
            await Package.add((json)=>{
                delete json.scripts.dev;
                json.type="module";
                json.scripts = {...{dev:"devlien dev"}, ...json.scripts};
            })
            .save();
            await this.delay(500);
            this.terminal.addLine('package.json have been updated @space procesed', 'success');


            this.terminal.addLine('System is preparing @space processing');
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space done', 'success');

        } catch (error) {
            console.error("Error occurred:", error);
        }
    }




    async copyNuxtDemo(){

        try {
            this.terminal.addLine('Nuxtjs config is being updated @space processing');
            await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/nuxt/')}`, `${this.base_path}`);
            this.terminal.addLine('Nuxtjs config has been updated @space done', 'success');


            this.terminal.addLine('Core files are being generated @space processing');
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/core/`, `${path.join(this.base_path, '/server')}`);
            this.terminal.addLine('Core files have been generated @space done', 'success');


            await this.createEnv();


            this.terminal.addLine('package.json is updating @space processing');
            await Package.add((json)=>{
                delete json.scripts.dev;
                json.type="module";
                json.scripts = {...{dev:"devlien dev nuxt"}, ...json.scripts};
            })
            .save();
            await this.delay(500);
            this.terminal.addLine('package.json have been updated @space procesed', 'success');
            
            this.terminal.addLine('System is preparing @space processing');
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space done', 'success');


        } 
        catch (error) {
            console.error("Error occurred:", error);
        }
    }

    async copyNextDemo(){

        try {

            this.terminal.addLine('Nextjs config is being updated @space processing');
            await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/next/')}`, `${this.base_path}`);
            this.terminal.addLine('Nextjs config has been updated @space done', 'success');


            this.terminal.addLine('Core files are being generated @space processing');
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/core/`, `${path.join(this.base_path, '/server')}`);
            this.terminal.addLine('Core files have been generated @space done', 'success');

            await this.createEnv();

            this.terminal.addLine('package.json is updating @space processing');
            await Package.add((json)=>{
                delete json.scripts.dev;
                json.type="module";
                json.scripts = {...{dev:"devlien dev next"}, ...json.scripts};
            })
            .save();
            await this.delay(500);
            this.terminal.addLine('package.json have been updated @space procesed', 'success');

            
            this.terminal.addLine('System is preparing updated... @space processing');
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space done', 'success');

        } catch (error) {
            console.error("Error occurred:", error);
        }
        
    }


    async createEnv(){
        this.terminal.addLine('Environment variables are being updated @space processing');
        await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/standard/env.example')}`, `${this.base_path}/.env`);
        this.terminal.addLine('Environment variables have been updated @space done', 'success');
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
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}