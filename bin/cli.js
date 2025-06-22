#!/usr/bin/env node
import Execution from './execution.js';


Execution.start((system, param)=>{


    if(param.includes('make:migration')){
        system.createMigration(param[1]);
    }


    else if(param.includes('migrate')){
        system.runMigrate(param[1]);
    }


    else if(param.includes('install')){
        system.ask('Are you using Deepline with another framework ?', ['No', 'Yes'])
        .then(ans=>{
            if(ans.toLowerCase()=='no'){
                system.updatePackageJson();
                system.copyDemo();
            }
            else {
                system.ask('Which framework are you using ?', ['NuxtJs', 'NextJs', 'NestJs'])
                .then(ans=>{
                    if(ans.toLowerCase()=='nuxtjs'){
                        system.updatePackageJson();
                        system.copyNuxtDemo();
                    }
                })
            }
        })
    }
});