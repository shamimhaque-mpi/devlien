const route = use("App/Routes/Route");


route.get('/', 'HomeController@index');
route.get('/about', 'HomeController@about');
route.get('/tutorials', 'HomeController@tutorials');
route.get('/issue', 'HomeController@issue');


module.exports = route;



