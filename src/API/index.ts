import * as I from './types';
import { MapConfig } from '../HUD/Radar/LexoRadar/maps';


const query = new URLSearchParams(window.location.search);
export const port = Number(query.get('port') || 1349);
export const variant = query.get("variant") || "default";

export const isDev = !query.get("isProd");

export const config = {apiAddress:isDev ? `http://localhost:${port}/` : '/'}
export const apiUrl = config.apiAddress;

export async function apiV2(url: string, method = 'GET', body?: any) {
    const options: RequestInit = {
        method,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    }
    if (body) {
        options.body = JSON.stringify(body)
    }
    let data: any = null;
    return fetch(`${apiUrl}api/${url}`, options)
        .then(res => {
            data = res;
            return res.json().catch(_e => data && data.status < 300)
        });
}

const api = {
    match: {
        get: async (): Promise<I.Match[]> => apiV2(`match`),
        getCurrent: async (): Promise<I.Match> => apiV2(`match/current`)
    },
    camera: {
        get: (): Promise<{ availablePlayers: ({steamid:string, label: string})[], uuid: string }> => apiV2('camera'),
        toggleVmix: (status?: boolean) => new Promise<boolean>(r => {
            const controller = new AbortController();
            const signal = controller.signal;
           // let finished = false;
            const timeoutId = setTimeout(() => {
                controller.abort();
                r(false);
            }, 1000)
            fetch(`http://localhost:2715/visibility${status !== undefined ? `?status=${status}` : ''}`, { method: "POST", signal }).then(() => {
                clearTimeout(timeoutId);
                r(true);
                //finished = true;
            }).catch(() => { r(false); });

        })
    },
    teams: {
        getOne: async (id: string): Promise<I.Team> => apiV2(`teams/${id}`),
        get: (): Promise<I.Team[]> => apiV2(`teams`),
    },
    players: {
        get: async (steamids?: string[]): Promise<I.Player[]> => apiV2(steamids ? `players?steamids=${steamids.join(';')}` :`players`),
        getAvatarURLs: async (steamid: string): Promise<{custom: string, steam: string}> => apiV2(`players/avatar/steamid/${steamid}`)
    },
    tournaments: {
        get: () => apiV2('tournament')
    },
    maps: {
        get: (): Promise<{ [key: string] : MapConfig}> => apiV2('radar/maps')
    }
}

export default api;