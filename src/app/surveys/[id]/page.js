import SurveyComponent from "../../../components/surveys/Survey";

async function getSurvey(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/surveys/${id}`,
      {
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch survey");

    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
}

// 🧠 สร้าง metadata สำหรับ social share
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // ✅ ต้อง await ก่อน
  const survey = await getSurvey(resolvedParams.id);

  if (!survey) {
    return {
      title: "ไม่พบแบบสอบถาม",
    };
  }

  return {
    title: survey.meta_title || survey.title || "Survey",
    description: survey.description || "แบบสอบถามออนไลน์",
    icons: {
      icon: survey.image_url || "/images/contact-form.png",
    },
    openGraph: {
      title: survey.meta_title || "Survey",
      description: survey.description || "แบบสอบถามออนไลน์",
      images: [survey.image_url || "/images/contact-form.png"],
      type: "website",
    },
    // themeColor: survey.primary_color || "#1976d2",
  };
}

export default async function SurveyPage({ params }) {
  const resolvedParams = await params;
  const survey = await getSurvey(resolvedParams.id);
  // const survey = await getSurvey(params.id);
  console.log("Fetched survey data:", survey);
  // ถ้าไม่พบ survey ให้แสดงข้อความ
  if (!survey) {
    return <div>ไม่พบแบบสอบถาม</div>;
  }

  return <SurveyComponent survey={survey} />;
}
