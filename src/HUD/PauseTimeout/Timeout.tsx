import { Map, CSGO } from "csgogsi";

interface IProps {
  phase: CSGO["phase_countdowns"] | null;
  map: Map;
}

const Timeout = ({ phase, map }: IProps) => {
  const time = phase && Math.abs(Math.ceil(phase.phase_ends_in));
  const team = phase && phase.phase === "timeout_t" ? map.team_t : map.team_ct;

  return (
    <div
      id={`timeout`}
      className={`${
        time && time > 2 && phase &&
          (phase.phase === "timeout_t" || phase.phase === "timeout_ct")
          ? "show"
          : ""
      } ${
        phase && (phase.phase === "timeout_t" || phase.phase === "timeout_ct")
          ? phase.phase.substring(8)
          : ""
      }`}
    >
      {team.name} TIMEOUT
    </div>
  );
};
export default Timeout;
