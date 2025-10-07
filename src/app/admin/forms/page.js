"use client";
import { Add, Delete, Edit, OfflineShare, OpenInNew, Visibility } from "@mui/icons-material";
import { Box, Button, Switch, Tooltip, Typography } from "@mui/material";
import TableComponent from "../../../components/Table";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useApi from "../../../services";
import { formatDateTH } from "../../../helpers/format";
import Actions from "../../../components/Actions";

const FormsPage = () => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await useApi.forms.getFormsList();
            if (response.status === 'success') {
                setData(response.data);
            } else {
                console.error("Failed to fetch forms:", response.message);

            }
        } catch (error) {
            console.error("Failed to fetch forms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatusForm = async (formId, newStatus) => {
        try {
            const response = await useApi.forms.updateFormStatus(formId, newStatus);
            if (response.success) {
                // Update the local state with the new status
                setData((prevData) =>
                    prevData.map((form) =>
                        form.id === formId ? { ...form, is_open: newStatus } : form
                    )
                );
            } else {
                console.error("Failed to update form status:", response.message);
            }
        } catch (error) {
            console.error("Failed to update form status:", error);
        }
    };

    const handleCopyLink = (form) => {
        // copy link to clipboard ต้องใช้ code_link ด้วย
        const link = `${window.location.origin}/surveys/${form.id}?code=${form.code_link}`;
        navigator.clipboard.writeText(link);
        alert("คัดลอกลิงก์สำเร็จ: " + link);
    }

    return (<Box sx={{ p: 2 }}>
        <Typography variant="h5">
            รายการแบบสอบถาม
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    boxShadow: "none",
                    color: "#fff",
                    fontSize: 14,
                    '&:hover': {
                        boxShadow: "none",
                    },
                }}
                onClick={() => {
                    // redirect to create form page
                    router.push("/admin/forms/create");
                }}
            >
                สร้างแบบสอบถาม
            </Button>
        </Box>
        <Box sx={{
            mt: 2,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
        }}>
            <Box sx={{ p: 2 }}>
                <TableComponent
                    data={data || []}
                    columns={[
                        {
                            id: "title",
                            label: "ชื่อแบบสอบถาม",
                        },
                        {
                            id: "creator",
                            label: "ผู้สร้าง",
                            render: (row) => (
                                <Typography variant="body2">{row.creator.firstname}</Typography>
                            ),
                        },
                        { id: "created_at", label: "วันที่สร้าง", render: (row) => formatDateTH(row.created_at) },
                        { id: "updated_at", label: "วันที่แก้ไขล่าสุด", render: (row) => formatDateTH(row.updated_at) },
                        {
                            id: "is_open", label: "สถานะ", render: (row) => (
                                <Tooltip title="เปิด/ปิด แบบสอบถาม">
                                    <Switch
                                        checked={row.is_open}
                                        onChange={(e) => handleUpdateStatusForm(row.id, e.target.checked)}
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "#4caf50", // สีปุ่ม toggle ตอนเปิด (เขียว)
                                                "&:hover": {
                                                    backgroundColor: "rgba(76, 175, 80, 0.08)", // เขียวอ่อนตอน hover
                                                },
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: "#4caf50", // สีแถบพื้นหลังตอนเปิด
                                            },
                                        }}
                                    />
                                </Tooltip>
                            )
                        },
                        {
                            id: "actions", label: "ดำเนินการ",
                            render: (row) => (
                                <Actions
                                    menuList={
                                        [
                                            {
                                                label: "แก้ไข",
                                                icon: <Edit />,
                                                onClick: () => router.push(`/admin/forms/${row.id}`)
                                            },
                                            { label: "ผลสำรวจ", icon: <Visibility />, onClick: () => router.push(`/admin/forms/report/${row.id}`) },
                                            {
                                                label: "ไปยังแบบสอบถาม", icon: <OpenInNew />, onClick: () => {
                                                    // open form in new tab
                                                    window.open(`/surveys/${row.id}`, '_blank');
                                                }
                                            },
                                            {
                                                label: "คัดลอกลิงก์", icon: <OfflineShare />, onClick: () => handleCopyLink(row)
                                            },
                                            {
                                                label: "ลบ", icon: <Delete />, onClick: async () => {
                                                    // delete form
                                                    const confirmed = confirm("คุณแน่ใจว่าต้องการลบแบบสอบถามนี้?");
                                                    if (confirmed) {
                                                        await deleteForm(row.id);
                                                        mutate();
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                />
                            ),
                        }
                    ]}
                    isLoading={loading}
                />
            </Box>
        </Box>
    </Box>)
}

export default FormsPage;