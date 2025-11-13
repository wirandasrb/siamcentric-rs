"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminPage = () => {
    // go to /admin/dashboard
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard');
    }, []);

    return null;
}
export default AdminPage;