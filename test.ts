import PooongClient, { BroascastCommand } from "./index";

const latencies: number[] = [];
async function main() {
  const pooong = await new window.PooongClient({
    public_key: "pk_test_VTKWynld1D4k3dJUknhOR7hGfTjsiY5RuNw8qiw5",
    client_name: "4d0142b3-40f9-478f-80e8-b2ce58214eb1",
  }).ready;

  console.log("ready");

  console.log(pooong.getNamespace()?.id);

  console.log(pooong.id);
  console.log(
    PooongClient.createOrRetrieve({
      public_key: "pk_test_VTKWynld1D4k3dJUknhOR7hGfTjsiY5RuNw8qiw5",
      client_name: "4d0142b3-40f9-478f-80e8-b2ce58214eb1",
    }).id
  );
  console.log(
    PooongClient.createOrRetrieve({
      public_key: "pk_test_VTKWynld1D4k3dJUknhOR7hGfTjsiY5RuNw8qiw5",
      client_name: "4d0142b3-40f9-478f-80e8-b2ce58214eb1",
    }).id
  );
  console.log(
    PooongClient.createOrRetrieve({
      public_key: "pk_test_VTKWynld1D4k3dJUknhOR7hGfTjsiY5RuNw8qiw5",
      client_name: "4d0142b3-40f9-478f-80e8-b2ce58214eb1",
    }).id
  );

  await pooong.subscribe("test", (data: CustomEvent) => {
    const sentAt = data.detail.payload.sentAt;
    const latency = Date.now() - sentAt;
    latencies.push(latency);
    const sorted = latencies.sort((a, b) => a - b);
    const p50 = sorted[Math.floor(latencies.length * 0.5)];
    const p95 = sorted[Math.floor(latencies.length * 0.95)];
    const p99 = sorted[Math.floor(latencies.length * 0.99)];
    // console.log({
    //   latencies: sorted.slice(Math.floor(latencies.length * 0.99)),
    //   p99,
    // });
    document.body.innerHTML = `
      Event received : ${latencies.length}<br>
      p50: ${p50.toFixed(2)}ms<br>
      p95: ${p95.toFixed(2)}ms<br>
      p99: ${p99.toFixed(2)}ms`;
  });

  setInterval(() => {
    const command = new BroascastCommand({
      channel: "test",
      payload: { sentAt: Date.now() },
    });
    pooong.sendCommand(command);
  }, 10);

  const command = new BroascastCommand({
    channel: "test",
    payload: { sentAt: Date.now() },
  });

  await pooong.sendCommand(command);

  window.onbeforeunload = () => {
    pooong.destroy();
  };
}

main();
