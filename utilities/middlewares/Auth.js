import AccessToken from "devlien/accessToken";

export default class Auth {

    async next(request){
        
        const token = request.headers.authorization?.split(' ')[1];
        const user = await AccessToken.token(token).verify();
        
        if(token && user){
            request.user = user;
            return true;
        }
        throw {
            status  : 401,
            error   : 'unauthorized',
            message :'Unauthorized Access'
        }
    }
}