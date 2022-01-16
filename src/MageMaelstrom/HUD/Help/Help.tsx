import React, { useState } from "react";
import { Modal, Stack } from "../../Common";
import { NiceButton } from "../NiceButton";
import { AbilityGuide } from "./AbilityGuide";

export interface HelpProps {
  size?: number;
}

export const Help: React.FC<HelpProps> = ({ size }) => {
  const [open, setOpen] = useState(false);
  const [spellOpen, setSpellOpen] = useState(false);

  return (
    <div>
      <Stack style={{ height: size }} stretch gap={20}>
        <NiceButton onClick={() => setOpen(true)} style={{ flex: 1 }}>
          Stats
        </NiceButton>
        <NiceButton onClick={() => setSpellOpen(true)} style={{ flex: 1 }}>
          Abilities
        </NiceButton>
      </Stack>
      <Modal visible={open} onCloseRequested={() => setOpen(false)}>
        This is my modal
      </Modal>
      <Modal
        visible={spellOpen}
        onCloseRequested={() => setSpellOpen(false)}
        width="90vw"
      >
        <AbilityGuide />
      </Modal>
    </div>
  );
};
