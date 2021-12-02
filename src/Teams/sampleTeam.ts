import { Team } from "../MageMaelstrom";
import { actions } from "../MageMaelstrom/Combatant/actions";

const sampleTeam: Team = {
  name: "The Wowzers",
  color: "#c00",
  combatants: [
    {
      name: "Cool Guy",
      icon: "/burst.png",
      act: () => {
        return actions.move("left");
      },
    },
    {
      name: "Attack Person",
      icon: "/burst.png",
      act: () => {
        return actions.move("left");
      },
    },
  ],
};

export { sampleTeam };
