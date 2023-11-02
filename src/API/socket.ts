import { io } from "socket.io-client";
import { isDev, port } from ".";
import { GSI, hudIdentity } from "./HUD";
import { CSGORaw } from "csgogsi";
import { actions, configs } from "./contexts/actions";
import { initiateConnection } from "./HUD/camera";

export const socket = io(isDev ? `localhost:${port}` : '/');

type RoundPlayerDamage = {
	steamid: string;
	damage: number;
};
type RoundDamage = {
	round: number;
	players: RoundPlayerDamage[];
};

socket.on("update", (data: any, damage: any) => {
    if (damage) {
        GSI.damage = damage;
    }
    GSI.digest(data);
});

const isInWindow = !!window.parent.ipcApi;

if(isInWindow){
	window.parent.ipcApi.receive('raw', (data: CSGORaw, damage?: RoundDamage[]) => {
		if(damage){
			GSI.damage = damage;
		}
		GSI.digest(data);
	});
}

const href = window.location.href;

socket.emit("started");

if (isDev) {
    hudIdentity.name = (Math.random() * 1000 + 1).toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
    hudIdentity.isDev = true;
} else {
    const segment = href.substr(href.indexOf('/huds/') + 6);
    hudIdentity.name = segment.substr(0, segment.lastIndexOf('/'));
}

socket.on("readyToRegister", () => {
    socket.emit("register", hudIdentity.name, isDev, "cs2", isInWindow ? "IPC" : "DEFAULT");
    initiateConnection();
});
socket.on(`hud_config`, (data: any) => {
    configs.save(data);
});
socket.on(`hud_action`, (data: any) => {
    actions.execute(data.action, data.data);
});
socket.on('keybindAction', (action: string) => {
    actions.execute(action);
});

socket.on("refreshHUD", () => {
    window.top?.location.reload();
});

socket.on("update_mirv", (data: any) => {
    GSI.digestMIRV(data);
})
