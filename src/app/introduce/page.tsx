
import Link from 'next/link';
import { Button } from 'antd';
import Image from 'next/image';
import { createClient } from "@utils/supabase/server";

// style
import "@styles/app/page.scss";
import "./page.style.scss";

// 완전한 정적 페이지임을 명시
export const dynamic = 'force-static';


// 컴포넌트 수정
export default async function IntroducePage() {
    const supabase = await createClient();
    const { data: features, error } = await supabase
      .from('features')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching features:', error);
      return <div>데이터를 불러오는데 실패했습니다.</div>;
    }

    if (!features || features.length === 0) {
      return <div>데이터가 없습니다.</div>;
    }

  return (
    <article className="layout-content introduce-layout">
      {/* 히어로 섹션 */}
      <section className="hero-section-layout">
        <div className="hero-section">
          <h1>
             직장인의 취미생활 공유
          </h1>
          <h2>
            퇴근 후 취미생활로 채우는 여유
          </h2>
          <p>
            바쁜 일상 속에서도 나만의 취미를 즐기고 다른 사람들과 공유해보세요.
          </p>
          <section className="button-wrapper">
            <Link href="/">
              <Button 
                type="primary" 
                size="large"
              >
                시작하기
              </Button>
            </Link>
          </section>
        </div>
      </section>

      {/* 주요 기능 소개 */}
      <section>
        <div className="feature-section">
          <h2>
            Hobby Hive에서 취미생활을 공유해보세요
          </h2>
          
          <div>
            {features?.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="image-wrapper">
                  <Image
                    src={feature.image_url}
                    alt={feature.image_alt}
                    width={400}
                    height={300}
                    className="feature-image"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                    priority
                    aria-label={feature.image_credit}
                  />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

// 메타데이터 설정
export const metadata = {
  title: "Hobby Hive - 취미 공유 플랫폼",
  description: "다양한 취미를 가진 사람들과 소통하고 영감을 얻을 수 있는 공간",
  keywords: ["취미", "커뮤니티", "취미생활", "취미공유", "hobby"],
};
