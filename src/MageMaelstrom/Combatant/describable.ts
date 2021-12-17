import { IconDef } from "../Common/Icon";

export interface Describable {
  icon: IconDef;
  name: string;
  description: string;
  flavorText?: string;
}
