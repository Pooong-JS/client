import { defaultOptions } from "./constantes";
import { PooongTimeoutError } from "./error";
import { CommandResponse, Namespace, PooongClientOptions } from "./types";

export class PooongClient extends EventTarget {
  id = crypto.randomUUID();
  options: PooongClientOptions;
  private client: WebSocket | null = null;
  #ready: Promise<PooongClient>;
  get ready() {
    return this.#ready;
  }
  isConnected: boolean = false;

  private namespace: Namespace | null = null;
  getNamespace() {
    return this.namespace;
  }

  static readonly clients: Map<string, PooongClient> = new Map();

  constructor(options: PooongClientOptions) {
    super();
    this.options = { ...defaultOptions, ...options };
    if (!this.options.public_key) {
      throw new Error("public_key is required");
    }
    PooongClient.clients.set(
      this.options.public_key + "|" + this.options.client_name!,
      this
    );
    this.#ready = this.createConnecton();
    this.initSubscriptionEmitter();
    this.autoReconnect();
  }

  private createConnecton() {
    return new Promise<PooongClient>((resolve, reject) => {
      const url = new URL(this.options.url!);
      url.searchParams.set("authorization", btoa(this.options.public_key));
      url.searchParams.set("client-name", this.options.client_name!);
      this.client = new WebSocket(url.toString());
      this.client.addEventListener(
        "message",
        (event: { data: string }) => {
          const data = JSON.parse(event.data);
          console.log({ data });
          if (data.type === "Authentication failed") {
            reject(data);
          } else if (data.type === "Namespace") {
            this.namespace = data.namespace;
            resolve(this);
          }
        },
        { once: true }
      );
      this.client.onopen = () => {
        this.isConnected = true;
      };
      this.client.onerror = (error) => {
        reject(error);
      };
    });
  }

  private async autoReconnect() {
    const client = await this.getClient();
    client.onclose = () => {
      this.#ready = this.createConnecton();
    };
  }

  async destroy() {
    const client = await this.getClient();
    client.close();
    this.#ready = Promise.reject(new Error("Client destroyed"));
  }

  async getClient() {
    await this.#ready;
    return this.client!;
  }

  private generateId() {
    return crypto.randomUUID();
  }

  private async initSubscriptionEmitter() {
    const client = await this.getClient();
    client.addEventListener("message", (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === "broadcast" && data.channel) {
        this.dispatchEvent(new CustomEvent(data.channel, { detail: data }));
      }
    });
  }

  private async waitFor(id: string, timeout: number = 30_000) {
    const client = await this.getClient();
    return new Promise((resolve, reject) => {
      const handleMessage = (event: { data: string }) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          resolve(data);
          client.removeEventListener("message", handleMessage);
        }
      };
      client.addEventListener("message", handleMessage);
      setTimeout(() => {
        reject(new PooongTimeoutError());
        client.removeEventListener("message", handleMessage);
      }, timeout);
    });
  }

  async sendCommand(data: Record<string, any>) {
    const client = await this.getClient();
    const id = this.generateId();
    const subscription = this.waitFor(id);
    client.send(JSON.stringify({ id, ...data }));
    const response = (await subscription) as CommandResponse;
    if (response.type === "Error") {
      throw new Error(response.details);
    }
  }

  async broadcast(channel: string, payload: string | Record<string, any>) {
    this.sendCommand({
      type: "broadcast",
      channel,
      payload,
    });
  }

  async subscribe(channel: string, listener: (payload: any) => void) {
    await this.sendCommand({
      type: "subscribe",
      channel,
    });
    this.addEventListener(channel, listener);
    return () => {
      this.removeEventListener(channel, listener);
    };
  }

  static createOrRetrieve(
    options: ConstructorParameters<typeof PooongClient>[0]
  ): PooongClient {
    const withDefaultOptions = { ...defaultOptions, ...options };
    const key =
      withDefaultOptions.public_key + "|" + withDefaultOptions.client_name!;
    if (PooongClient.clients.has(key)) {
      return PooongClient.clients.get(key)!;
    }
    return new PooongClient(options);
  }
}

export default PooongClient;
