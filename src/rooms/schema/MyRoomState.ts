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

  // left hand pose (optional, 0-init means not yet set)
  @type("number") lhx: number = 0;
  @type("number") lhy: number = 0;
  @type("number") lhz: number = 0;
  @type("number") lhqx: number = 0;
  @type("number") lhqy: number = 0;
  @type("number") lhqz: number = 0;
  @type("number") lhqw: number = 1;

  // right hand pose
  @type("number") rhx: number = 0;
  @type("number") rhy: number = 0;
  @type("number") rhz: number = 0;
  @type("number") rhqx: number = 0;
  @type("number") rhqy: number = 0;
  @type("number") rhqz: number = 0;
  @type("number") rhqw: number = 1;

  // last update timestamp (ms)
  @type("number") lastUpdate: number = 0;
}

export class MyRoomState extends Schema {
  @type({ map: XRPlayer }) players = new MapSchema<XRPlayer>();
}
