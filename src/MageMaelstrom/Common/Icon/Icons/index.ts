import attack from "./quick-slash.svg";
import fireball from "./lucifer-cannon.svg";
import talented from "./upgrade.svg";

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

export { mmAttack, mmFireball, mmTalented };
