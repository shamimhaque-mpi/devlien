import ResouceCollection from "devlien/resouceCollection";

export default class UserResource extends ResouceCollection {
    
    async toJson(user){
        return {
            username:user.username,
            name:user.name,
            email:user.email
        }
    }
}