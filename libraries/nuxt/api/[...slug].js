import run from "deepline/run";

export default defineEventHandler(async (event) => {
  return (new run(event.node.req)).getResponse();
})