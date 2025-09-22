import { Room, Client } from "@colyseus/core";
import {
  MessageType,
  MoveData,
  MyRoomState,
  Player,
  Vec3,
} from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 10;
  state = new MyRoomState();

  onCreate(options: any) {
    console.log("MyRoom created.");

    //
    // Handle MOVE
    //
    this.onMessage(MessageType.MOVE, (client, payload: MoveData) => {
      const player = this.state.players.get(client.sessionId);

      const { position, rotation } = payload as MoveData;

      if (position) {
        player.position.x = position.x ?? player.position.x;
        player.position.y = position.y ?? player.position.y;
        player.position.z = position.z ?? player.position.z;
      }

      if (rotation) {
        player.rotation.x = rotation.x ?? player.rotation.x;
        player.rotation.y = rotation.y ?? player.rotation.y;
        player.rotation.z = rotation.z ?? player.rotation.z;
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
