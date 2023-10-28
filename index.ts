import PooongClient from "./src/client";
export default PooongClient;
export * from "./src/client";
export * from "./src/error";
export * from "./src/commands";
export type * from "./src/types";

if ("window" in globalThis) window.PooongClient = PooongClient;
