import { CSGO } from "csgogsi";
import LexoRadarContainer from './LexoRadar/LexoRadarContainer';



interface Props { radarSize: number, game: CSGO }

const Radar = ({ radarSize, game }: Props) => {
    const { players, player, bomb, grenades, map } = game; 
    return <LexoRadarContainer
        players={players}
        player={player}
        bomb={bomb}
        grenades={grenades}
        size={radarSize}
        mapName={map.name.substring(map.name.lastIndexOf('/')+1)}
    />
}

export default Radar;