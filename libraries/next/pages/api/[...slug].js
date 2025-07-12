import run from "deepline/run";

export default function handler(req, res) {
  res.status(200).json((new run(req)).getResponse());
}