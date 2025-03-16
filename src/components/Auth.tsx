"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@utils/supabase";
//auth/callback
export default function AuthComponent() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]}
      redirectTo="https://hobby-hive-eight.vercel.app/introduce"
      localization={{
        variables: {
          sign_in: {
            email_label: "이메일",
            password_label: "비밀번호",
            button_label: "로그인",
          },
          sign_up: {
            email_label: "이메일",
            password_label: "비밀번호",
            button_label: "회원가입",
          },
        },
      }}
    />
  );
}
