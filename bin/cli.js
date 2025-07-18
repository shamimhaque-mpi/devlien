#!/usr/bin/env node
import Cache from './cache.js';
Cache.clear();

const { default: Execution } = await import('./execution.js');

Execution.start((system, param)=>{

    if(param.includes('make:migration')){
        system.createMigration(param[1]);
    }


    if(param.includes('make:model')){
        system.createModel(param[1]);
    }


    if(param.includes('make:controller')){
        system.createController(param[1]);
    }


    if(param.includes('make:resource')){
        system.createResource(param[1]);
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


    else if(param.includes('setup')){
        system.ask('Are you using Devlien with another framework ?', ['No', 'Yes'])
        .then(ans=>{
            if(ans.toLowerCase()=='no'){
                system.updatePackageJson();
                system.copyDemo();
            }
            else {
                system.ask('Which framework are you using ?', ['NuxtJs', 'NextJs'])
                .then(ans=>{
                    if(ans.toLowerCase()=='nuxtjs'){
                        system.updatePackageJson();
                        system.copyNuxtDemo();
                    }
                    else if(ans.toLowerCase()=='nextjs'){
                        system.updatePackageJson();
                        system.copyNextDemo();
                    }
                })
            }
        });
    }
});