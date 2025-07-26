import path from "path";
import fs from "fs";
import url from "url";


export default class PublicFile 
{
    accept = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.pdf': 'application/pdf',
        '.html': 'text/html',
        '.json': 'application/json',
        '.txt': 'text/plain',
        '.ico': 'image/ico',
    }

    static hasExtension(request){
        const parsedUrl = url.parse(request.url);
        const pathname = parsedUrl.pathname;
        return path.extname(pathname);
    }

    static async provide(request, response){

        const urlPath = decodeURIComponent(request.url);
        const filePath = path.join(process.cwd(), 'public', urlPath);

        fs.stat(filePath, (err, stat) => {
          if (urlPath.replace('/', '')!='app.js' && !err && stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = new this().accept[ext] || 'application/octet-stream';

            response.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(response);
          }
          else {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found: The requested file does not exist.');
          }
        })
    }
}