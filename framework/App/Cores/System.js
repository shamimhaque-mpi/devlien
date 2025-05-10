// const config = require(path("config/app"));

module.exports = class 
{
    base_path = '';
    constructor() 
    {
        
    }
    

    path($string=""){
        return process.cwd()+($string!='' ? ('/'+$string) : '');
    }
}