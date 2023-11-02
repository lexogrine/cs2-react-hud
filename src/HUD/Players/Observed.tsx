import React, { useState } from "react";
import { Player } from "csgogsi";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./observed.scss";
import { getCountry } from "./../countries";
import { ArmorHelmet, ArmorFull, HealthFull, Bullets } from './../../assets/Icons';
import { apiUrl } from './../../API';
import { useAction } from "../../API/contexts/actions";


const Statistic = React.memo(({ label, value }: { label: string; value: string | number, }) => {
	return (
		<div className="stat">
			<div className="label">{label}</div>
			<div className="value">{value}</div>
		</div>
	);
});

const Observed = ({ player }: { player: Player | null }) => {
	const [ showCam, setShowCam ] = useState(true);

	useAction('toggleCams', () => {
		setShowCam(p => !p);
	});

	if (!player) return null;
	
	const country = player.country || player.team.country;
	const currentWeapon = player.weapons.filter(weapon => weapon.state === "active")[0];
	const grenades = player.weapons.filter(weapon => weapon.type === "Grenade");
	const { stats } = player;
	const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths;
	const countryName = country ? getCountry(country) : null;
	return (
		<div className={`observed ${player.team.side}`}>
			<div className="main_row">
				<Avatar teamId={player.team.id} url={player.avatar} steamid={player.steamid} height={140} width={140} showCam={showCam} slot={player.observer_slot} />
				<TeamLogo team={player.team} height={35} width={35} />
				<div className="username_container">
					<div className="username">{player.name}</div>
					<div className="real_name">{player.realName}</div>
				</div>
				<div className="flag">{countryName ? <img src={`${apiUrl}files/img/flags/${countryName.replace(/ /g, "-")}.png`} alt={countryName} /> : ''}</div>
				<div className="grenade_container">
					{grenades.map(grenade => <React.Fragment key={`${player.steamid}_${grenade.name}_${grenade.ammo_reserve || 1}`}>
						<Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />
						{
							grenade.ammo_reserve === 2 ? <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null}
					</React.Fragment>)}
				</div>
			</div>
			<div className="stats_row">
				<div className="health_armor_container">
					<div className="health-icon icon">
						<HealthFull />
					</div>
					<div className="health text">{player.state.health}</div>
					<div className="armor-icon icon">
						{player.state.helmet ? <ArmorHelmet /> : <ArmorFull />}
					</div>
					<div className="health text">{player.state.armor}</div>
				</div>
				<div className="statistics">
					<Statistic label={"K"} value={stats.kills} />
					<Statistic label={"A"} value={stats.assists} />
					<Statistic label={"D"} value={stats.deaths} />
					<Statistic label={"K/D"} value={ratio.toFixed(2)} />
				</div>
				<div className="ammo">
					<div className="ammo_icon_container">
						<Bullets />
					</div>
					<div className="ammo_counter">
						<div className="ammo_clip">{(currentWeapon && currentWeapon.ammo_clip) || "-"}</div>
						<div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Observed;