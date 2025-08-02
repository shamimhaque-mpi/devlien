import path from "path";
import Template from "./Template.js";
import Compiler from "./Compiler.js";

export default async function view ($path='', dataset={}){
	$path = ($path).split('.').join('/');
	let $base = path.join(process.cwd(), '/resources/views/');

	let template = new Template($base, '.dl');
	let component = await template.build($path+'.dl', true);

	if(typeof component != 'object')
		return component;

	let view = {
		viewEngine:true,
		html : await Compiler.execute(component, dataset),
	}

	return view;
}









