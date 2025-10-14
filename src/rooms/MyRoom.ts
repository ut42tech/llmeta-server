import { type Client, Room } from "@colyseus/core";
import {
	MessageType,
	type MoveData,
	MyRoomState,
	Player,
	type ProfileData,
	Vec3,
} from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
	maxClients = 10;

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
				const player = this.state.players.get(client.sessionId);
				player.isXR = payload.isXR;
				player.isHandTracking = payload.isHandTracking;
				player.isVisible = payload.isVisible;
			},
		);

		//
		// Handle MOVE
		//
		this.onMessage(MessageType.MOVE, (client, payload: MoveData) => {
			const player = this.state.players.get(client.sessionId);

			const {
				position,
				rotation,
				leftHandPosition,
				leftHandRotation,
				rightHandPosition,
				rightHandRotation,
			} = payload as MoveData;

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

			if (leftHandPosition && player.isXR) {
				player.leftHandPosition.x =
					leftHandPosition.x ?? player.leftHandPosition.x;
				player.leftHandPosition.y =
					leftHandPosition.y ?? player.leftHandPosition.y;
				player.leftHandPosition.z =
					leftHandPosition.z ?? player.leftHandPosition.z;
			}

			if (leftHandRotation && player.isXR) {
				player.leftHandRotation.x =
					leftHandRotation.x ?? player.leftHandRotation.x;
				player.leftHandRotation.y =
					leftHandRotation.y ?? player.leftHandRotation.y;
				player.leftHandRotation.z =
					leftHandRotation.z ?? player.leftHandRotation.z;
			}

			if (rightHandPosition && player.isXR) {
				player.rightHandPosition.x =
					rightHandPosition.x ?? player.rightHandPosition.x;
				player.rightHandPosition.y =
					rightHandPosition.y ?? player.rightHandPosition.y;
				player.rightHandPosition.z =
					rightHandPosition.z ?? player.rightHandPosition.z;
			}

			if (rightHandRotation && player.isXR) {
				player.rightHandRotation.x =
					rightHandRotation.x ?? player.rightHandRotation.x;
				player.rightHandRotation.y =
					rightHandRotation.y ?? player.rightHandRotation.y;
				player.rightHandRotation.z =
					rightHandRotation.z ?? player.rightHandRotation.z;
			}
		});
	}

	onJoin(client: Client, _options: any) {
		console.log(client.sessionId, "joined!");

		// create Player instance
		const player = new Player().assign({
			isXR: false,
			isHandTracking: false,
			isVisible: false,
			position: new Vec3().assign({ x: 0, y: 0, z: 0 }),
			rotation: new Vec3().assign({ x: 0, y: 0, z: 0 }),
			leftHandPosition: new Vec3().assign({ x: 0, y: 0, z: 0 }),
			leftHandRotation: new Vec3().assign({ x: 0, y: 0, z: 0 }),
			rightHandPosition: new Vec3().assign({ x: 0, y: 0, z: 0 }),
			rightHandRotation: new Vec3().assign({ x: 0, y: 0, z: 0 }),
		});

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
