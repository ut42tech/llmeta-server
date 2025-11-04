import { MapSchema, Schema, type } from "@colyseus/schema";

export class PlayerState extends Schema {
  @type("string") username: string = "";

  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;

  @type("number") rx: number = 0;
  @type("number") ry: number = 0;
  @type("number") rz: number = 0;

  @type("string") animation: string = "idle";
}

export class MyRoomState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();
}
