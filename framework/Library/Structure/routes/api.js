import route from "deepline/route"


route.group({'prefix':'user', 'middleware':[]}, (route)=>{
    route.get('/', 'HomeController@index');
    route.any('/about', 'HomeController@about');
    route.get('/tutorials', 'HomeController@tutorials');
    route.get('/issue', 'HomeController@issue');
})


export default route;