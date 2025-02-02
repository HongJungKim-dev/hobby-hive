"use client";

import { Modal } from "antd";
import AuthComponent from "./Auth";
import useSession from "@hooks/useSession";

interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function LoginModal({ isOpen, closeModal }: LoginModalProps) {
  const session = useSession();

  if (session) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      width={400}
      centered
    >
      <AuthComponent />
    </Modal>
  );
}
