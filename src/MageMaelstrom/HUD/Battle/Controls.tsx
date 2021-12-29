import Slider from "rc-slider";
import React from "react";
import { NiceButton } from "..";
import { Stack } from "../../Common";
import { useGameManager } from "../../Logic";
import "rc-slider/assets/index.css";
import { Icon, mmCooldownTimer, mmPause, mmPlay } from "../../Common/Icon";
import styles from "./Controls.module.css";
import classNames from "classnames";

export interface ControlsProps {}

export const Controls = React.memo<ControlsProps>(() => {
  const { tick, currentTick, toggleLooping, isLooping, victor } =
    useGameManager();

  return (
    <Stack gap={20}>
      <Stack
        direction="vertical"
        stretch
        className={styles.section}
        style={{ width: 100 }}
      >
        <NiceButton
          pressed={isLooping}
          onClick={toggleLooping}
          disabled={victor !== undefined}
        >
          <Icon icon={isLooping ? mmPause : mmPlay} size={32} inline />
        </NiceButton>
        <NiceButton onClick={tick} disabled={victor !== undefined}>
          Tick
        </NiceButton>
      </Stack>
      <Stack.Item style={{ marginRight: 30 }}>
        <Stack
          alignment="middle"
          className={classNames(styles.section, styles.sliderWrapper)}
          gap={20}
        >
          <div className={styles.gameSpeed}>Game Speed</div>
          <Slider />
          <div className={styles.tickCounter}>
            <Icon
              icon={mmCooldownTimer}
              size={16}
              inline
              style={{ marginRight: 5 }}
            />
            {((currentTick ?? 0) / 100).toFixed(2)}s
          </div>
        </Stack>
      </Stack.Item>
    </Stack>
  );
});
