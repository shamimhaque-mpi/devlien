import System from "deepline/system";

const app = (await import('file:///home/shamim-haque/Desktop/nodeTest/nuxtApp/server/config/app.js')).default;
const database = (await import('file:///home/shamim-haque/Desktop/nodeTest/nuxtApp/server/config/database.js')).default;


export const configs = {
  app : app,
  database : database,
}