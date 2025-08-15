import { Schema, type, MapSchema } from "@colyseus/schema";

export class XRPlayer extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";

  // position
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;

  // rotation quaternion
  @type("number") qx: number = 0;
  @type("number") qy: number = 0;
  @type("number") qz: number = 0;
  @type("number") qw: number = 1;

  // last update timestamp (ms)
  @type("number") lastUpdate: number = 0;
}

export class MyRoomState extends Schema {
  @type({ map: XRPlayer }) players = new MapSchema<XRPlayer>();
}
