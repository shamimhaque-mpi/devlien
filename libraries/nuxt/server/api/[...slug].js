import run from "devlien/run";

export default defineEventHandler(async (event) => {
  return (new run(event.node.req)).getResponse();
})