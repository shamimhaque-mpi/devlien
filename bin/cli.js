#!/usr/bin/env node
import readline from 'readline';
import { exec } from 'child_process';


import Package from './package.js';



const base_path = process.cwd();



(async () => {




    var answer = await askChoice(
        'Are you using Deepline with another framework ?',
        ['No', 'Yes']
    );

    if(answer.toLowerCase() =='yes'){
        // console.clear();
        var answer = await askChoice(
            'Which framework are you using ?',
            ['Nuxt', 'Next', 'Nest']
        );

        console.log(answer)
    }
    else {


        Package.add((json)=>{
            delete json.scripts.test;
            json.type="module";
            json.scripts.dev = "nodemon ./server.js";
        })
        .save();



        exec(`cp -R ${base_path}/node_modules/deepline/libraries/demo/. ${base_path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(stderr);
        });
    }
})();











function askChoice(question, choices) {
    return new Promise(resolve => {
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let currentIndex = 0;

        function render() {
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