import { type Client, Room } from "@colyseus/core";
import { MyRoomState, PlayerState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 50;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    // メッセージハンドラー
    this.onMessage("position", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = message.x;
        player.y = message.y;
        player.z = message.z;
      }
    });

    this.onMessage("rotation", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.rx = message.x;
        player.ry = message.y;
        player.rz = message.z;
      }
    });

    this.onMessage("animation", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.animation = message.animation;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!", options);

    const player = new PlayerState();
    player.username = options.username || "Player";

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
