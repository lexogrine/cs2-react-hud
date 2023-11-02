import * as I from "../../API/types";
import "./index.scss";
import TeamLogo from "../MatchBar/TeamLogo";

interface IProps {
  match: I.Match;
  show: boolean;
  teams: I.Team[];
  veto: I.Veto | null;
}

const MatchOverview = ({ match, teams, show }: IProps) => {
  const left = teams.find((team) => team._id === match.left.id);
  const right = teams.find((team) => team._id === match.right.id);
  if (!match || !left || !right) return null;
  return (
    <div className={`match-overview ${show ? "show" : ""}`}>
      <div className="match-overview-title">
        Upcoming match
      </div>
      <div className="match-overview-teams">
        <div className="match-overview-team">
          <div className="match-overview-team-logo">
            <TeamLogo team={left} height={40} />
          </div>
          <div className="match-overview-team-name">{(left.shortName || left.name).substring(0, 4)}</div>
        </div>
        <div className="match-overview-vs">vs</div>
        <div className="match-overview-team">
          <div className="match-overview-team-logo">
            <TeamLogo team={right} height={40} />
          </div>
          <div className="match-overview-team-name">{(right.shortName || right.name).substring(0, 4)}</div>
        </div>
      </div>
    </div>
  );
};
export default MatchOverview;
