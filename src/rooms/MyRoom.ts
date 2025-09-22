import { Room, Client } from "@colyseus/core";
import { MessageType, MyRoomState, Player, Vec3 } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 10;
  state = new MyRoomState();

  onCreate(options: any) {
    console.log("MyRoom created.");

    //
    // Handle MOVE
    //
    this.onMessage(MessageType.MOVE, (client, data) => {
      console.log("move update received -> ");
      console.debug(JSON.stringify(data));
      const player = this.state.players.get(client.sessionId);

      // validate input
      if (player && Array.isArray(data) && data.length === 6) {
        player.position.x = data[0];
        player.position.y = data[1];
        player.position.z = data[2];

        player.rotation.x = data[3];
        player.rotation.y = data[4];
        player.rotation.z = data[5];
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // create Player instance
    const player = new Player().assign({
      position: new Vec3().assign({ x: 0, y: 0, z: 0 }),
      rotation: new Vec3().assign({ x: 0, y: 0, z: 0 }),
    });

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
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
