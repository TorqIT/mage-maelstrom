import { Team } from "../MageMaelstrom";
import { actions } from "../MageMaelstrom/Combatant/actions";

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  combatants: [
    {
      name: "Wow Dude",
      icon: "/burst.png",
      act: (helpers) => {
        if (helpers.canPerform(actions.move("left"))) {
          return actions.move("left");
        } else {
          return actions.move("up");
        }
      },
    },
    {
      name: "BIG",
      icon: "/burst.png",
      act: () => {
        return actions.move("left");
      },
    },
  ],
};

export { otherTeam };
