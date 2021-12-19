import attack from "./quick-slash.svg";
import fireball from "./lucifer-cannon.svg";
import talented from "./upgrade.svg";
import cooldownTimer from "./stopwatch.svg";
import manaCost from "./overmind.svg";
import poison from "./poison-gas.svg";
import crit from "./claw-slashes.svg";
import bear from "./bear-face.svg";

export interface IconDef {
  file: string;
  filter?: string;
}

export const mmAttack: IconDef = {
  file: attack,
};

export const mmFireball: IconDef = {
  file: fireball,
};

export const mmTalented: IconDef = {
  file: talented,
};

export const mmCooldownTimer: IconDef = {
  file: cooldownTimer,
};

export const mmManaCost: IconDef = {
  file: manaCost,
  filter:
    "invert(32%) sepia(37%) saturate(3162%) hue-rotate(230deg) brightness(101%) contrast(113%)",
};

export const mmPoison: IconDef = {
  file: poison,
  filter:
    "invert(59%) sepia(95%) saturate(430%) hue-rotate(53deg) brightness(96%) contrast(84%)",
};

export const mmCrit: IconDef = {
  file: crit,
  filter:
    "invert(61%) sepia(87%) saturate(4045%) hue-rotate(332deg) brightness(101%) contrast(100%)",
};

export const mmBear: IconDef = {
  file: bear,
};
