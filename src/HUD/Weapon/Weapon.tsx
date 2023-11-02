import React from "react";
import * as Weapons from "./../../assets/Weapons";

interface IProps extends React.SVGProps<SVGSVGElement> {
  weapon: string;
  active: boolean;
  isGrenade?: boolean;
}
const WeaponImage = ({ weapon, active, isGrenade, ...rest }: IProps) => {
  const weaponId = weapon.replace("weapon_", "");
  const Weapon = (Weapons as any)[weaponId];
  const { className, ...svgProps } = rest;
  if (!Weapon) return null;
  return (
    <Weapon
      fill="white"
      className={`${active ? "active" : ""} weapon ${
        isGrenade ? "grenade" : ""
      } ${className || ""}`}
      {...svgProps}
    />
  );
};

export default React.memo(WeaponImage);
