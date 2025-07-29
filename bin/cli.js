#!/usr/bin/env node

import Watcher from './server/Watcher.js';
import Execution from './execution.js';

new Execution().start(async (system, param, terminal)=>{

    if(param.includes('dev')){
        Watcher.start(param[1]);
    }

    else if(param.includes('make:migration')){
        system.createMigration(param[1]);
    }

    else if(param.includes('make:model')){
        system.createModel(param[1]);
    }


    else if(param.includes('make:controller')){
        system.createController(param[1]);
    }


    else if(param.includes('make:resource')){
        system.createResource(param[1]);
    }


    else if(param.includes('make:seeder')){
        system.createSeeder(param[1]);
    }


    else if(param.includes('migrate')){
        system.runMigrate(param[1]);
    }


    else if(param.includes('migrate:rollback')){
        system.runMigrateRollback(param[1]);
    }


    else if(param.includes('cache:clear')){
        system.cacheClear(param[1]);
    }


    else if(param.includes('db:seed')){
        system.DBSeed(param[1]);
    }


    else if(param.includes('setup')){

        if(param.includes('--init')){
            system.copyDemo(param);
        }
        else{
            let questionOne = 'Are you using Devlien with another framework ?';
            terminal.ask(questionOne, ['No', 'Yes']).then(ans=>{

                terminal.addLine(questionOne + '\nAnswer : '+terminal.COLORS.success.replace('%s', ans));

                if(ans.toLowerCase()=='no'){
                    system.copyDemo();
                }
                else {
                    let questionTwo = 'Which framework are you using ?';
                    terminal.ask(questionTwo, ['NuxtJs', 'NextJs'])
                    .then(ans=>{
                        terminal.addLine(questionTwo + '\nAnswer : '+terminal.COLORS.success.replace('%s', ans));
                        if(ans.toLowerCase()=='nuxtjs'){
                            system.copyNuxtDemo();
                        }
                        else if(ans.toLowerCase()=='nextjs'){
                            system.copyNextDemo();
                        }
                    })
                }
            });
        }
    }
});