import { baseEnv } from "devlien/env";
import System from "devlien/system";
import path from "path";


var configs = {};
let isSetuping = process.argv.length > 2 && process.argv[2]=='setup';

if(!isSetuping)
    var {configs} = (await import(System.toFilePath(path.join(baseEnv.BASE_PATH, 'bootstrap/cache/config.js'))));
//
export default function(segments='', _default=null) {
    
    if(!isSetuping && segments) {
        
        const file = segments.split('.')[0];
        
        var result = configs[file];

        segments.split('.').forEach((key, index)=>{
            if(index!=0){
                result = result[key];
            }
        })

        return result ? result : _default;
    }
    return _default;
}