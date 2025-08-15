import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "app.config.ts" file here.
import appConfig from "../src/app.config";
import { MyRoomState } from "../src/rooms/schema/MyRoomState";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  before(async () => (colyseus = await boot(appConfig)));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("client joins and has XRPlayer entry, then updates pose", async () => {
    const room = await colyseus.createRoom<MyRoomState>("my_room", {});
    const client1 = await colyseus.connectTo(room);

    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

    await room.waitForNextPatch();

    // ensure player entry exists
    const clientState = client1.state as any;
    assert.ok(clientState.players);
    const myPlayer = clientState.players.get(client1.sessionId);
    assert.ok(myPlayer, "player entry should exist after join");

    // send pose update
    client1.send("pose", { x: 1, y: 2, z: 3, qx: 0, qy: 0, qz: 0, qw: 1 });
    await room.waitForNextPatch();

    const updated = clientState.players.get(client1.sessionId);
    assert.strictEqual(updated.x, 1);
    assert.strictEqual(updated.y, 2);
    assert.strictEqual(updated.z, 3);
    assert.strictEqual(updated.qw, 1);
  });
});
