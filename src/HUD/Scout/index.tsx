import { Side } from "csgogsi";
import "./index.scss";

export const Scout = ({ left, right }: { left: Side, right: Side }) => {
    return <div id="scout">
        <div className="bar-container">
            <div className="overlay">
                <div className={`team-prediction-value left ${left}`}>50%</div>
                <div className={`team-prediction-value right ${right}`}>50%</div>
            </div>
            <div className="bar">
                <div className={`team-prediction team-${left} left`} />
                <div className={`team-prediction team-${right} right`} />
            </div>
        </div>
    </div>
}