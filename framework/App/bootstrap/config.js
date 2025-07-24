import System from "devlien/system";

const app = (await import('file:///Users/shamimhaque/Desktop/Nuxt/my-app/server/config/app.js')).default;
const database = (await import('file:///Users/shamimhaque/Desktop/Nuxt/my-app/server/config/database.js')).default;


export const configs = {
  app : app,
  database : database,
}