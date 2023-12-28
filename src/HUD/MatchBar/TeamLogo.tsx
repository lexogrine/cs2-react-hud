import { Team } from 'csgogsi';
import * as I from '../../API/types';
import { apiUrl } from './../../API';
import { LogoCT, LogoT } from './../../assets/Icons';

const TeamLogo = ({team, height, width }: { team?: Team | I.Team | null, height?: number, width?: number}) => {
    if(!team) return null;
    let id = '';
    const { logo } = team;
    if('_id' in team){
      id = team._id;
    } else if('id' in team && team.id){
      id = team.id;
    }
    return (
      <div className={`logo`}>
          <img src={logo && id ? `${apiUrl}api/teams/logo/${id}` : ('side' in team && team.side === "CT" ? LogoCT : LogoT)} width={width} height={height} alt={'Team logo'} />
      </div>
    );

}

export default TeamLogo;
