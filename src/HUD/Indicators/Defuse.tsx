import { Player } from 'csgogsi';
import {Defuse as DefuseIcon} from './../../assets/Icons';
const Defuse = ({ player }: { player: Player }) => {
        if(!player.state.health || !player.state.defusekit) return '';
        return (
            <div className={`defuse_indicator`}>
                <DefuseIcon />
            </div>
        );
}
export default Defuse;