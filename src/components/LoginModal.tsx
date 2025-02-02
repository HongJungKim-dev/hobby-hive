"use client";

import { Modal } from "antd";
import AuthComponent from "./Auth";

interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function LoginModal({ isOpen, closeModal }: LoginModalProps) {
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
