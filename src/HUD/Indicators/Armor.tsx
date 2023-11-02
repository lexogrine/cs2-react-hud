import React from "react";
import { ArmorFull, ArmorHelmet } from "./../../assets/Icons";

const Armor = ({ health, armor, helmet }: { health: number, armor: number, helmet: boolean }) => {
  if (!health || !armor) return null;
  return (
    <div className={`armor_indicator`}>
      {helmet ? <ArmorHelmet /> : <ArmorFull />}
    </div>
  );
};

export default React.memo(Armor);
