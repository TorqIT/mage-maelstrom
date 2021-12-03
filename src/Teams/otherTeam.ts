import { Combatant, Team } from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import { actions } from "../MageMaelstrom/Combatant/actions";

interface Memory {
  dirPriority: MovementDirection[];
  target: number;
}

const wowDude: Combatant<Memory> = {
  name: "Wow Dude",
  icon: "/burst.png",
  init: () => ({
    dirPriority: ["left", "up", "right", "down"],
    target: 0,
  }),
  act: (helpers, memory) => {
    while (
      !helpers.canPerform(actions.move(memory.dirPriority[memory.target]))
    ) {
      memory.target = (memory.target + 1) % 4;
    }

    return actions.move(memory.dirPriority[memory.target]);
  },
};

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  combatants: [
    wowDude,
    {
      name: "BIG",
      icon: "/burst.png",
      init: () => ({}),
      act: () => {
        return actions.move("left");
      },
    },
  ],
};

export { otherTeam };
