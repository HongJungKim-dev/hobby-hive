import Link from "next/link";
import Image from "next/image";
import "./page.style.scss";
import ClientIntroduceFeatureSection from "@/components/ClientIntroduceFeatureSection";
import { Metadata } from "next";
import { createClient } from "@utils/supabase/server";
import StartButton from "@components/StartButton";

export const metadata: Metadata = {
  title: "Hobby Hive - 취미 공유 커뮤니티",
  description: "다양한 취미 활동을 공유하는 공간입니다.",
};

export default async function IntroducePage() {
  const supabase = await createClient();
  const { data: features, error } = await supabase
    .from("features")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching features:", error);
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  if (!features || features.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="introduce-layout">
      <section className="hero-section-layout">
        <div className="hero-section">
          <h1>
            Hobby Hive
            <br />
            취미 공유 커뮤니티
          </h1>
          <p>다양한 취미를 공유하고 다른 사람들의 취미를 구경해보세요!</p>
          <div className="button-wrapper">
            <StartButton />
          </div>
        </div>
        <div className="hero-image">
          <Image
            src={features[0].image_url}
            alt={features[0].image_description}
            width={600}
            height={400}
            priority
            className="main-image"
          />
        </div>
      </section>
      <ClientIntroduceFeatureSection />
    </div>
  );
}
