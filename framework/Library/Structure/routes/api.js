import route from "deepline/route"


export default route.serve(route=>{
    route.get('about', 'HomeController@about');
    route.get('gallery', 'HomeController@gallery');
    route.get('contact', 'HomeController@contact');
});