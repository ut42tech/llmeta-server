import { MapSchema, Schema, type } from "@colyseus/schema";

/**
 * メッセージタイプ（サーバーと同期）
 */
export enum MessageType {
  CHANGE_PROFILE,
  MOVE,
}

/**
 * 3D座標スキーマ
 */
export class Vec3 extends Schema {
  @type("number") x = 0;
  @type("number") y = 0;
  @type("number") z = 0;
}

/**
 * プレーンな3D座標オブジェクト（メッセージ送信用）
 */
export type Vec3Data = {
  x: number;
  y: number;
  z: number;
};

/**
 * プロフィール更新メッセージ
 */
export type ProfileData = {
  username?: string;
};

/**
 * 移動・姿勢更新メッセージ（送信用）
 */
export type MoveData = {
  position?: Vec3Data;
  rotation?: Vec3Data;
  animation?: string;
};

/**
 * プレイヤー状態スキーマ
 */
export class Player extends Schema {
  @type("string") username = "Player";
  @type(Vec3) position = new Vec3();
  @type(Vec3) rotation = new Vec3();
  @type("string") animation = "idle";
}

/**
 * ルーム状態スキーマ
 */
export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
