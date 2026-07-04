import { motion } from "framer-motion";

import Modal from "./Modal";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{message}</p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-zinc-300 transition hover:bg-white/5"
        >
          {cancelLabel}
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 rounded-xl bg-lime py-3 font-semibold text-ink transition hover:brightness-95"
        >
          {confirmLabel}
        </motion.button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
