import { IconDef } from "../Common/Icon";

export interface DescriptiveIcon {
  icon: IconDef;
  name: string;
  description: string;
  flavorText?: string;
}

export interface CategorizedDescriptiveIcon extends DescriptiveIcon {
  category:
    | "damage"
    | "restoration"
    | "defensive"
    | "mobility"
    | "summons"
    | "buffs"
    | "debuffs";
  notes?: string[];
}
