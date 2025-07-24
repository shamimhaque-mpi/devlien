import System from "devlien/system";

const app = (await import('file:///Users/shamimhaque/Desktop/TEST/config/app.js')).default;
const database = (await import('file:///Users/shamimhaque/Desktop/TEST/config/database.js')).default;


export const configs = {
  app : app,
  database : database,
}