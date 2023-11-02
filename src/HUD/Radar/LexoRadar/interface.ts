import { Player, Side, Grenade } from "csgogsi";

export interface RadarPlayerObject {
    id: string,
    label: string | number,
    visible: boolean,
    side: Side,
    position: number[],
    forward: number,
    isActive: boolean,
    isAlive: boolean,
    steamid: string,
    hasBomb: boolean,
    flashed: boolean,
    shooting: boolean,
    lastShoot: number,
    scale: number,
    player: Player
}

export interface RadarGrenadeObject {
    state: 'inair' | 'landed' | 'exploded'
    side: Side | null,
    type: 'decoy' | 'smoke' | 'frag' | 'firebomb' | 'flashbang' | 'inferno',
    position: number[],
    visible: boolean,
    id: string,
} 

export type ExtendedGrenade = Grenade & { side: Side | null, };