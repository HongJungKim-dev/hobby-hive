"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@utils/supabase";
//auth/callback
export default function AuthComponent() {
  const getRedirectUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000/introduce';
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/introduce`;
  };

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]}
      redirectTo={getRedirectUrl()}
      magicLink={false}
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
