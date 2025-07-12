import System from "deepline/system";

const app = (await import('file:///Users/shamimhaque/Desktop/WEB/newApp/server/config/app.js')).default;
const database = (await import('file:///Users/shamimhaque/Desktop/WEB/newApp/server/config/database.js')).default;


export const configs = {
  app : app,
  database : database,
}