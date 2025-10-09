
import SurveyComponent from "../../../components/surveys/Survey";

async function getSurvey(id) {
    console.log("API BASE URL:", process.env.NEXT_PUBLIC_BASE_URL_API);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/surveys/${id}`, {
        next: { revalidate: 0 }, // ไม่ cache
    });
    console.log("Fetch survey response status:", res);

    if (!res.ok) throw new Error("Failed to fetch survey");
    const { data } = await res.json();
    console.log("Survey data:", data); // 🧠 ดูผลลัพธ์จริง
    return data;
}

// 🧠 สร้าง metadata สำหรับ social share
export async function generateMetadata({ params }) {
    const resolvedParams = await params; // ✅ ต้อง await ก่อน
    const survey = await getSurvey(resolvedParams.id);
    return {
        title: survey.meta_title || "Survey",
        description: survey.description || "แบบสอบถามออนไลน์",
        openGraph: {
            title: survey.meta_title || "Survey",
            description: survey.description || "แบบสอบถามออนไลน์",
            images: [survey.logo_image || "/images/contact-form.png"],
            type: "website",
        },
        themeColor: survey.primary_color || "#1976d2",
    };
}

export default async function SurveyPage({ params }) {
    const resolvedParams = await params; // ✅ ต้อง await ก่อน
    const survey = await getSurvey(resolvedParams.id);
    console.log("Rendering SurveyPage with survey:", survey);

    if (!survey) return null; // หรือใส่ loading spinner

    return <SurveyComponent survey={survey} />;
};
