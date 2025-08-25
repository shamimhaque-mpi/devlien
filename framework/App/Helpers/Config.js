import loader from "../../../utilities/loader.js";



var configs = loader.config;
let isSetuping = process.argv.length > 2 && process.argv[2]=='setup';


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