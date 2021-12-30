import React, { useState } from "react";
import { Modal, Stack } from "../../Common";
import { NiceButton } from "../NiceButton";

export interface HelpProps {
  size?: number;
}

export const Help: React.FC<HelpProps> = ({ size }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Stack style={{ height: size }} stretch gap={20}>
        <NiceButton onClick={() => setOpen(true)} style={{ flex: 1 }}>
          Stats
        </NiceButton>
        <NiceButton onClick={() => setOpen(true)} style={{ flex: 1 }}>
          Spells
        </NiceButton>
      </Stack>
      <Modal visible={open} onCloseRequested={() => setOpen(false)}>
        This is my modal
      </Modal>
    </div>
  );
};
