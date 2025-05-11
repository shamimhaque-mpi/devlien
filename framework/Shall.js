#!/usr/bin/env node
// const args = process.argv;
// const lib  = require("./Library/Repository");
// const fs   = require("fs");
// const { exec } = require('child_process');

// const readline = require('readline');

// console.log(readline);

// function askQuestion(query) {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
  
//     return new Promise(resolve => {
//       rl.question(query, answer => {
//         rl.close();
//         resolve(answer.trim());
//       });
//     });
// }

// (async () => {
//     console.log('📦 Deepline setup:');
  
//     const answer = await askQuestion('Which framework are you using? (nuxt/next/none): ');
  
//     switch (answer.toLowerCase()) {
//       case 'nuxt':
//         console.log('✅ Nuxt support selected.');
//         // run logic here
//         break;
//       case 'next':
//         console.log('✅ Next support selected.');
//         // run logic here
//         break;
//       default:
//         console.log('⚠ No framework selected.');
//     }
// })();


/*
    jfiojfildgjildfj
*/

// exec(`cp -R ./framework/App/Structure/* ../../`, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//     }
//     console.log(stderr);
// });



// CHECK DIR IN ROOT FROM SYSTEM MAP
// if(lib.map){
//     for(let key in lib.map){
//         existscheck(lib.map[key], key);
//     }
// }


// function existscheck(map, key){
//     if(map.path){
//         let path = "../../"+map.path;
//         if(!fs.existsSync(path)){

//             if(map.type=='dir'){
//                 fs.mkdir(path, (err)=>{
//                     if (err) throw err;
//                         console.log(`Directory ${path} was created`);
//                 });
//             }
//             else if(map.type=='fs')
//             {

//                 exec(`touch ${path}`, (error, stdout, stderr) => {
//                     if (error) {
//                       console.error(`exec error: ${error}`);
//                       return;
//                     }
//                 });




//                 let data = "Just Test";
//                 fs.writeFile(path, data, (err) => {
//                     if (err) throw err;
//                     console.log(`Data was written to ${path}`);
//                 });
//             }
//         }
//     }
//     if(map.children){
//         existscheck(map.children);
//     }
// }