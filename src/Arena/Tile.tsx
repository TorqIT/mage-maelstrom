import React from "react";
import styles from "./Tile.module.css";

export interface TileProps {}

export const Tile: React.FC<TileProps> = ({}) => {
  return <div className={styles.tile}></div>;
};
