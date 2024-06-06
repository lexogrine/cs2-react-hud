import { CSGO } from "csgogsi";

interface IProps {
  phase: CSGO["phase_countdowns"] | null;
}

const Pause = ({ phase }: IProps) => {
  return (
    <div
      id={`pause`}
      className={phase && phase.phase === "paused" ? "show" : ""}
    >
      PAUSE
    </div>
  );
};
export default Pause;
