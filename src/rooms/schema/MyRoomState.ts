import { Schema, type, MapSchema } from "@colyseus/schema";

export enum MessageType {
  MOVE,
}

export class Vec3 extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
}

export class Player extends Schema {
  @type(Vec3) position: Vec3;
  @type(Vec3) rotation: Vec3;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
