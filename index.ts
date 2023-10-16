import PooongClient from "./src/client";

export default PooongClient;
export * from "./src/client";
export * from "./src/error";
export * from "./src/commands";
export type * from "./src/types";

window.PoongClient = PooongClient;

// import { BroascastCommand } from "./src/commands";

// async function main() {
//   const pooong = await new PooongClient({
//     public_key: "pk_test_VTKWynld1D4k3dJUknhOR7hGfTjsiY5RuNw8qiw5",
//     client_name: "4d0142b3-40f9-478f-80e8-b2ce58214eb1",
//   }).ready;

//   console.log("ready");

//   console.log(pooong.getNamespace()?.id);

//   await pooong
//     .subscribe("test", (data: CustomEvent) => {
//       console.log("Received data", data.detail);
//     })
//     .then(() => {
//       console.log("subscribed");
//     });

//   const command = new BroascastCommand({
//     channel: "test",
//     payload: { test: "test" },
//   });

//   setInterval(() => {
//     pooong.sendCommand(command).then(() => {
//       console.log("broadcasted");
//     });
//   }, 5_000);

//   await pooong.sendCommand(command).then(() => {
//     console.log("broadcasted");
//   });
//   setInterval(() => {
//     pooong.destroy().then(() => {
//       console.log("destroyed");
//     });
//   }, 15_000);
// }

// main();
