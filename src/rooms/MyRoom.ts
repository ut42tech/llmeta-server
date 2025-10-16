import { type Client, Room } from "@colyseus/core";
import {
  MessageType,
  type MoveData,
  MyRoomState,
  Player,
  type ProfileData,
  type Vec3,
  type Vec3Data,
} from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 10;

  /**
   * プレイヤーを取得（存在しない場合は警告を出して null を返す）
   */
  private getPlayer(sessionId: string): Player | null {
    const player = this.state.players.get(sessionId);
    if (!player) {
      console.warn(`Player ${sessionId} not found in state`);
    }
    return player;
  }

  /**
   * Vec3 を更新（undefined の値はスキップ）
   */
  private updateVec3(target: Vec3, source: Vec3Data | Vec3 | undefined): void {
    if (!source) return;
    if (source.x !== undefined) target.x = source.x;
    if (source.y !== undefined) target.y = source.y;
    if (source.z !== undefined) target.z = source.z;
  }

  onCreate(_options: any) {
    console.log("MyRoom created.");
    // @deprecated — Use .state = instead.
    // this.setState(new MyRoomState());
    this.state = new MyRoomState();

    //
    // Handle CHANGE_PROFILE
    //
    this.onMessage(
      MessageType.CHANGE_PROFILE,
      (client, payload: ProfileData) => {
        const player = this.getPlayer(client.sessionId);
        if (!player) return;

        // payloadの値が定義されている場合のみ更新
        if (payload.isXR !== undefined) {
          player.isXR = payload.isXR;
          // XRモードを終了する場合、ハンドトラッキングもリセット
          if (!payload.isXR) {
            player.isHandTracking = false;
          }
        }
        if (payload.isHandTracking !== undefined) {
          // ハンドトラッキングはXRモード時のみ有効
          player.isHandTracking = player.isXR ? payload.isHandTracking : false;
        }
        if (payload.isVisible !== undefined) {
          player.isVisible = payload.isVisible;
        }
      },
    );

    //
    // Handle MOVE
    //
    this.onMessage(MessageType.MOVE, (client, payload: MoveData) => {
      const player = this.getPlayer(client.sessionId);
      if (!player) return;

      const {
        position,
        rotation,
        leftHandPosition,
        leftHandRotation,
        rightHandPosition,
        rightHandRotation,
      } = payload;

      // 基本の位置と回転を更新
      this.updateVec3(player.position, position);
      this.updateVec3(player.rotation, rotation);

      // XRモードの場合のみハンドトラッキングデータを更新
      if (player.isXR) {
        this.updateVec3(player.leftHandPosition, leftHandPosition);
        this.updateVec3(player.leftHandRotation, leftHandRotation);
        this.updateVec3(player.rightHandPosition, rightHandPosition);
        this.updateVec3(player.rightHandRotation, rightHandRotation);
      }
    });
  }

  onJoin(client: Client, _options: any) {
    console.log(client.sessionId, "joined!");

    // create Player instance with default values
    const player = new Player();
    // Vec3のデフォルト値は0なので、明示的な代入は不要

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
