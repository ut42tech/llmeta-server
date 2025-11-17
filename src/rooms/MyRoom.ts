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
  maxClients = 100;

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

  onCreate() {
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

        const { username, avatar } = payload;
        if (username !== undefined) {
          player.username = username;
        }
        if (avatar !== undefined) {
          if (avatar.headIconUrl !== undefined)
            player.avatar.headIconUrl = avatar.headIconUrl;
          if (avatar.id !== undefined) player.avatar.id = avatar.id;
          if (avatar.vrmUrl !== undefined) player.avatar.vrmUrl = avatar.vrmUrl;
        }
      }
    );

    //
    // Handle MOVE
    //
    this.onMessage(MessageType.MOVE, (client, payload: MoveData) => {
      const player = this.getPlayer(client.sessionId);
      if (!player) return;

      const { position, rotation } = payload;

      // 基本の位置と回転を更新
      this.updateVec3(player.position, position);
      this.updateVec3(player.rotation, rotation);

      if (payload.isRunning !== undefined) {
        player.isRunning = payload.isRunning;
      }

      if (payload.animation !== undefined) {
        player.animation = payload.animation;
      }
    });
  }

  onJoin(client: Client) {
    console.log(client.sessionId, "joined!");

    // create Player instance with default values
    const player = new Player();

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
