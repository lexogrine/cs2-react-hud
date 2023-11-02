import { CSGOGSI, Player, PlayerExtension } from 'csgogsi';
import api, { isDev } from '..';

export const hudIdentity = {
	name: '',
	isDev
};

export const GSI = new CSGOGSI();
GSI.regulationMR = 12;

GSI.on("data", data => {
    loadPlayers(data.players);
});

const requestedSteamIDs: string[] = [];

const loadPlayers = async (players: Player[]) => {
    const leftOvers = players.filter(player => !requestedSteamIDs.includes(player.steamid));
    const leftOverSteamids = leftOvers.map(player => player.steamid);
    if(!leftOvers.length) return;

    requestedSteamIDs.push(...leftOverSteamids);

    const extensions = await api.players.get(leftOverSteamids);

    const playersExtensions: PlayerExtension[] = extensions.map(player => (
        {
            id: player._id,
            name: player.username,
            realName: `${player.firstName} ${player.lastName}`,
            steamid: player.steamid,
            country: player.country,
            avatar: player.avatar,
            extra: player.extra,
        })
    )

    GSI.players.push(...playersExtensions);

    
    leftOvers.forEach(player => {
        loadAvatarURL(player);
    });
}


interface AvatarLoader {
    loader: Promise<string>,
    url: string,
}

const avatars: { [key: string]: AvatarLoader } = {};

const loadAvatarURL = (player: Player) => {
    if(!player.steamid) return;
    if(avatars[player.steamid]) return avatars[player.steamid].url;
    avatars[player.steamid] = {
        url: player.avatar || '',
        loader: new Promise((resolve) => {
            api.players.getAvatarURLs(player.steamid).then(result => {
                const avatarUrl = result.custom || result.steam;
                const existing = GSI.players.find(playerEx => playerEx.steamid === player.steamid);
                const target = existing || {
                    id: player.steamid,
                    name: player.name,
                    realName: player.realName,
                    steamid: player.steamid,
                    country: player.country,
                    avatar: player.avatar,
                    extra: player.extra
                }
                if(target) target.avatar = avatarUrl;

                if(!existing){
                    GSI.players.push(target);
                }


                avatars[player.steamid].url = result.custom || result.steam;
                resolve(result.custom || result.custom);
            }).catch(() => {
                delete avatars[player.steamid];
                resolve('');
            });
        })
    }
}