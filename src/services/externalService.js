
const getExternalOptions = async (source_id) => {
    try {
        if (source_id === 1) {
            const response = await fetch(
                "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch province data");
            }

            const data = await response.json();
            console.log("Fetched external options:", data);

            // แปลงข้อมูลให้อยู่ในรูปแบบ dropdown-friendly
            return data.map((province) => ({
                id: province.id,
                name_th: province.name_th,
                name_en: province.name_en,
                option: province.name_th, // ใช้ชื่อไทยเป็นตัวเลือก
            }));
        } else if (source_id === 2) {
            const response = await fetch(
                "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch amphur data");
            }

            const data = await response.json();

            // แปลงข้อมูลให้อยู่ในรูปแบบ dropdown-friendly
            return data.map((amphur) => ({
                id: amphur.id,
                name_th: amphur.name_th,
                name_en: amphur.name_en,
                option: amphur.name_th, // ใช้ชื่อไทยเป็นตัวเลือก
            }));
        }
    } catch (error) {
        throw error;
    }
};

const externalService = {
    getExternalOptions,
};
export default externalService;