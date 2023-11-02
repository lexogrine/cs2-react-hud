import { Team } from 'csgogsi';

const WinAnnouncement = ({team, show }: { team: Team | null, show: boolean }) => {
        if(!team) return null;
        return <div className={`win_text ${show ? 'show' : ''} ${team.orientation} ${team.side}`}>
                WINS THE ROUND!
            </div>   
}


export default WinAnnouncement;