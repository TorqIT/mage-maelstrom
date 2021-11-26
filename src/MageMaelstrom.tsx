import React from "react";
import { Arena } from "./Arena";

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  return <Arena width={20} height={20} />;
};
