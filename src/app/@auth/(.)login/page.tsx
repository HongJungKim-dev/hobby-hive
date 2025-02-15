"use client";

import { Modal } from "antd";
import AuthComponent from "@/components/Auth";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const router = useRouter();

  return (
    <div style={{ position: 'fixed', zIndex: 1000 }}>
      <Modal
        open={true}
        onCancel={() => router.back()}
        footer={null}
        width={400}
        centered
      >
        <AuthComponent />
      </Modal>
    </div>
  );
}
