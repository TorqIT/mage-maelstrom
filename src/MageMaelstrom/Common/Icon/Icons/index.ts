import attack from "./quick-slash.svg";
import fireball from "./lucifer-cannon.svg";
import talented from "./upgrade.svg";
import cooldownTimer from "./stopwatch.svg";
import manaCost from "./overmind.svg";

export interface IconDef {
  file: string;
  filter?: string;
}

const mmAttack: IconDef = {
  file: attack,
};

const mmFireball: IconDef = {
  file: fireball,
};

const mmTalented: IconDef = {
  file: talented,
};

const mmCooldownTimer: IconDef = {
  file: cooldownTimer,
};

const mmManaCost: IconDef = {
  file: manaCost,
  filter:
    "invert(32%) sepia(37%) saturate(3162%) hue-rotate(230deg) brightness(101%) contrast(113%)",
};

export { mmAttack, mmFireball, mmTalented, mmCooldownTimer, mmManaCost };
