import { Room, Client } from "@colyseus/core";
import { MyRoomState, XRPlayer } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 16;
  state = new MyRoomState();

  onCreate(options: any) {
    // XR pose update from clients
    this.onMessage(
      "pose",
      (
        client,
        message: {
          x?: number;
          y?: number;
          z?: number;
          qx?: number;
          qy?: number;
          qz?: number;
          qw?: number;
        }
      ) => {
        const player = this.state.players.get(client.sessionId);
        if (!player) return;

        if (typeof message.x === "number") player.x = message.x;
        if (typeof message.y === "number") player.y = message.y;
        if (typeof message.z === "number") player.z = message.z;
        if (typeof message.qx === "number") player.qx = message.qx;
        if (typeof message.qy === "number") player.qy = message.qy;
        if (typeof message.qz === "number") player.qz = message.qz;
        if (typeof message.qw === "number") player.qw = message.qw;
        player.lastUpdate = Date.now();
      }
    );

    // optional: set player name
    this.onMessage("set_name", (client, message: { name?: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      if (typeof message.name === "string") {
        player.name = message.name.slice(0, 32);
      }
    });

    // server tick for any future simulation/cleanup
    this.setSimulationInterval(() => {
      // remove inactive players (e.g., > 60s no updates)
      const now = Date.now();
      this.state.players.forEach((p, id) => {
        if (p.lastUpdate && now - p.lastUpdate > 60_000) {
          // no-op for now; presence is handled by connection lifecycle
        }
      });
    }, 50);
  }

  onJoin(client: Client, options: any) {
    const player = new XRPlayer();
    player.id = client.sessionId;
    player.name =
      typeof options?.name === "string" ? options.name.slice(0, 32) : "";
    player.lastUpdate = Date.now();
    this.state.players.set(client.sessionId, player);

    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
