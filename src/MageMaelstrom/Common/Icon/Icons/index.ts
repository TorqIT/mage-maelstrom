import attack from "./quick-slash.svg";
import fireball from "./lucifer-cannon.svg";

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

export { mmAttack, mmFireball };
