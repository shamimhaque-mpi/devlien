import System from "devlien/system";

const app = (await import('file:///home/shamim-haque/Desktop/RND/appV1.0.1/server/config/app.js')).default;
const database = (await import('file:///home/shamim-haque/Desktop/RND/appV1.0.1/server/config/database.js')).default;


export const configs = {
  app : app,
  database : database,
}