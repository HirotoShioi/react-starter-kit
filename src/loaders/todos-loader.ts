import { Params } from "react-router-dom";

export default async function todosLoader(params: Params<string>) {
  console.log("todosLoader", params);
  return {};
}
