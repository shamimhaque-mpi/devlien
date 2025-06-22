import route from "deepline/route"


export default route.serve(route=>{
    route.get('/', 'DeeplineController@index');
    route.get('docs', 'DeeplineController@docs');
    route.get('resouces', 'DeeplineController@resouces');
    route.get('products', 'DeeplineController@products');
    route.get('blog', 'DeeplineController@blog');
});