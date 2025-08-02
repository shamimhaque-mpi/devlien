import path from "path";
import Template from "./Template.js";
import Compiler from "./Compiler.js";

export default async function view ($path=''){
	$path = ($path).split('.').join('/');
	let $base = path.join(process.cwd(), '/resources/views/');

	let template = new Template($base, true);
	let component = await template.build($path+'.dl');

	let view = {
		viewEngine:true,
		html : await Compiler.execute(component),
	}

	return view;
}









