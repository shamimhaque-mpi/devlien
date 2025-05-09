module.exports = class
{
	getSource(path="")
	{
		if(path!="")
		{
			const realPath = this.getRealPath(path);

			const content = this.contents(realPath);

			return content;
		}
		return false;
	}




	getRealPath($path)
	{
		$path = ($path).split('.').join('/');
		return process.cwd()+'/views/'+($path+'.html');
	}



	async contents($path)
	{
		const fs = require("fs");
		//
		if(fs.existsSync($path))
		{
			return await new Promise((resolve, reject)=>
			{
				fs.readFile($path, (err, data)=>{
					resolve(data);
				});
			});
		}
		else {
			return "Not Found";
		}
	}

}












