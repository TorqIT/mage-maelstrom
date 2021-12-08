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

  strength: 5,
  agility: 15,
  intelligence: 5,

  act: (helpers, visibleEnemies, memory) => {
    const attackableEnemy = visibleEnemies.find((s) =>
      helpers.canPerform(actions.attack(s.id))
    );

    if (attackableEnemy) {
      return actions.attack(attackableEnemy.id);
    }

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

      strength: 5,
      agility: 5,
      intelligence: 5,

      init: () => ({}),
      act: () => {
        return actions.move("left");
      },
    },
  ],
};

export { otherTeam };
