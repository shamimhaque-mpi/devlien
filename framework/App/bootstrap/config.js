import System from "deepline/system";

const app = (await import('file:///Users/shamimhaque/Desktop/WEB/nextjsapp/server/config/app.js')).default;
const database = (await import('file:///Users/shamimhaque/Desktop/WEB/nextjsapp/server/config/database.js')).default;


export const configs = {
  app : app,
  database : database,
}