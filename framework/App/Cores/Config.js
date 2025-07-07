import {configs} from "../bootstrap/config.js";


//
export default function(segments='') {

    if(segments) {
        const file = segments.split('.')[0];
        
        var result = configs[file];

        segments.split('.').forEach((key, index)=>{
            if(index!=0){
                result = result[key];
            }
        })


        return result;
    }
}