import * as I from './../../API/types';
import { apiUrl } from '../../API';

interface MatchData {
	left: { name: string; score: string | number; logo: string };
	right: { name: string; score: string | number; logo: string };
}
interface Props {
    tournament: I.Tournament,
    matches: I.Match[],
    teams: I.Team[]
}

const joinParents = (matchup: I.TournamentMatchup, matchups: I.TournamentMatchup[]) => {
	if (!matchup) return matchup;

	if (matchup.parents.length) return matchup;

	const parents = matchups.filter(m => m.winner_to === matchup._id || m.loser_to === matchup._id);
	if (!parents.length) return matchup;
	matchup.parents.push(...parents.map(parent => joinParents(parent, matchups)));

	return matchup;
};

const copyMatchups = (currentMatchups: I.TournamentMatchup[]): I.DepthTournamentMatchup[] => {
	const matchups = JSON.parse(JSON.stringify(currentMatchups)) as I.DepthTournamentMatchup[];
	return matchups;
};

const setDepth = (matchups: I.DepthTournamentMatchup[], matchup: I.DepthTournamentMatchup, depth: number, force = false) => {
	const getParents = (matchup: I.DepthTournamentMatchup) => {
		return matchups.filter(parent => parent.loser_to === matchup._id || parent.winner_to === matchup._id);
	};

	if (!matchup.depth || force) {
		matchup.depth = depth;
		getParents(matchup).forEach(matchup => setDepth(matchups, matchup, depth + 1));
	}
	if (matchup.depth <= depth - 1) {
		setDepth(matchups, matchup, depth - 1, true);
	}
	return matchup;
};

const getMatch = ({ matchup, matches, teams: allTeams}: { matches: I.Match[], teams: I.Team[], matchup: I.TournamentMatchup}) => {
	const matchData: MatchData = {
		left: { name: 'TBD', score: '-', logo: '' },
		right: { name: 'TBD', score: '-', logo: '' }
	};
	const match = matches.find(match => match.id === matchup.matchId);
	if (!match) return matchData;
	const teams = [
		allTeams.find(team => team._id === match.left.id),
		allTeams.find(team => team._id === match.right.id)
	];
	if (teams[0]) {
		matchData.left.name = teams[0].name;
		matchData.left.score = match.left.wins;
		matchData.left.logo = teams[0].logo;
	}
	if (teams[1]) {
		matchData.right.name = teams[1].name;
		matchData.right.score = match.right.wins;
		matchData.right.logo = teams[1].logo;
	}
	return matchData;
};

const Ladder = ({ tournament, matches, teams }: Props) => {
	const renderBracket = (
		matchup: I.DepthTournamentMatchup | null | undefined,
		depth: number,
		fromChildId: string | undefined,
		childVisibleParents: number,
		isLast = false
	) => {
		if (!matchup || !tournament) return null;
		const match = getMatch({ teams: teams, matches: matches, matchup});

		if (fromChildId === matchup.loser_to) return null;
		const parentsToRender = matchup.parents.filter(matchupParent => matchupParent.loser_to !== matchup._id);
		if (matchup.depth > depth) {
			return (
				<div className="empty-bracket">
					{renderBracket(matchup, depth + 1, fromChildId, parentsToRender.length)}
					<div className="connector"></div>
				</div>
			);
        }
        const currentMatch = matches.find(mtch => mtch.current);
        const isCurrent = currentMatch && currentMatch.id === matchup.matchId;
		return (
			<div className={`bracket depth-${depth}`}>
				<div className="parent-brackets">
					{renderBracket(matchup.parents[0], depth + 1, matchup._id, parentsToRender.length)}
					{renderBracket(matchup.parents[1], depth + 1, matchup._id, parentsToRender.length)}
				</div>
				<div className="bracket-details">
					<div
						className={`match-connector ${
							!matchup.parents.length || parentsToRender.length === 0 ? 'first-match' : ''
							} ${isLast ? 'last-match' : ''}`}
					></div>
					{parentsToRender.length === 1 ? <div className="loser-parent-indicator"></div> : null}
					<div className={`match-details ${isCurrent ? 'current':''}`}>
						<div className="team-data">
							<div className="team-logo">
								{match.left.logo ? <img src={`${apiUrl}api/teams/logo/direct/${match.left.logo}`} alt="Logo" /> : null}
							</div>
							<div className="team-name">{match.left.name}</div>
							<div className="team-score">{match.left.score}</div>
						</div>
						<div className="team-data">
							<div className="team-logo">
								{match.right.logo ? <img src={`${apiUrl}api/teams/logo/direct/${match.right.logo}`} alt="Logo" /> : null}
							</div>
							<div className="team-name">{match.right.name}</div>
							<div className="team-score">{match.right.score}</div>
						</div>
					</div>
				</div>

				{childVisibleParents === 2 ? (
					<div className={`connector amount-${parentsToRender.length}`}></div>
				) : null}
			</div>
		);
	};

		if (!tournament) return null;
		const matchups = copyMatchups(tournament.playoffs.matchups);
		const gf = matchups.find(matchup => matchup.winner_to === null);
		if (!gf) return null;
		const joinedParents = joinParents(gf, matchups);
		const matchupWithDepth = setDepth(matchups, joinedParents as I.DepthTournamentMatchup, 0);
		return renderBracket(matchupWithDepth, 0, undefined, 2, true);
}

export default Ladder;