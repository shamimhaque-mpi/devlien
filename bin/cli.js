#!/usr/bin/env node
import Watcher from './server/watcher.js';

const { default: Execution } = await import('./execution.js');

Execution.start((system, param)=>{

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
        system.ask('Are you using Devlien with another framework ?', ['No', 'Yes'])
        .then(ans=>{
            if(ans.toLowerCase()=='no'){
                system.copyDemo();
            }
            else {
                system.ask('Which framework are you using ?', ['NuxtJs', 'NextJs'])
                .then(ans=>{
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
});