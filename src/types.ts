import type PooongClient from "./client";

export interface PooongClientOptions {
  url?: string;
  public_key: string;
  client_name?: string;
}

export interface Namespace {
  id: string;
  name: string;
  company_id: string;
  Section: {
    id: string;
    name: string;
    created_at: string;
    namespace_id: string;
    Handler: {
      id: string;
      name: string;
    }[];
  }[];
}

export enum CommandTypes {
  BROADCAST = "broadcast",
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
  SUBSCRIPTIONS = "subscriptions",
  PONG = "pong",
  EXECUTE = "execute",
}

export interface CommandResponse {
  id: string;
  type: "Success" | "Error";
  from: string;
  details?: string;
}

declare global {
  interface Window {
    PoongClient: typeof PooongClient;
  }
}
