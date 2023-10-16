export class BroascastCommand {
  readonly type = "broadcast";
  channel: string;
  payload: Record<string, any>;
  constructor(data: { payload: Record<string, any>; channel: string }) {
    this.payload = data.payload;
    this.channel = data.channel;
  }
}
