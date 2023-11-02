import { useState } from 'react';
import PlayerOverview from '../PlayerOverview/PlayerOverview';
import MatchOverview from '../MatchOverview/MatchOverview';
import { Map, Player } from 'csgogsi';
import * as I from './../../API/types';
import api from './../../API';
import { useConfig, useOnConfigChange } from '../../API/contexts/actions';

interface IProps {
    match: I.Match | null,
    map: Map,
    players: Player[]
}

const Overview =  ({ match, map, players }: IProps) => {
    const [ teams, setTeams ] = useState<I.Team[]>([]);
    const mapName = map.name.substring(map.name.lastIndexOf('/')+1);

    const previewData = useConfig("preview_settings");

    useOnConfigChange('preview_settings', async data => {
        console.log(data);
        if(!data?.match_preview?.match?.left.id || !data?.match_preview?.match?.right.id) return;

        const teams = await Promise.all([api.teams.getOne(data?.match_preview?.match?.left.id), api.teams.getOne(data?.match_preview?.match?.right.id)]);
        if(!teams[0] || !teams[1]) return;

        setTeams(teams);
    }, []);

    const playerData = previewData?.player_preview?.player;
    const matchData = previewData?.match_preview?.match;

    const veto = match?.vetos.find(veto => veto.mapName === mapName) || null;
    return (<>
        { playerData ? <PlayerOverview round={map.round + 1} player={playerData} players={players} show={!!previewData.player_preview_toggle} veto={veto} /> : null}
        { matchData && teams[0] && teams[1] ? <MatchOverview match={matchData} veto={veto} teams={teams} show={!!previewData.match_preview_toggle} /> : null }
    </>)
}

export default Overview;