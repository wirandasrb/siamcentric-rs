"use client";
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import TableComponent from "../../../components/Table";
import { useRouter } from "next/navigation";

const dataMock = [
    {
        id: "1",
        title: "แบบสอบถามความพึงพอใจ",
        creator: { firstname: "Mint" },
        createdAt: "2025-09-28",
        updatedAt: "2025-09-28",
        status: "Active",
    },
];

const FormsPage = () => {
    const router = useRouter();
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
                    data={dataMock}
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
                        { id: "createdAt", label: "วันที่สร้าง" },
                        { id: "updatedAt", label: "วันที่แก้ไขล่าสุด" },
                        { id: "status", label: "สถานะ" },
                        {
                            id: "actions", label: "ดำเนินการ",
                            render: (row) => (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 3,
                                        boxShadow: "none",
                                        fontSize: 12,
                                        '&:hover': {
                                            boxShadow: "none",
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/admin/forms/${row.id}`);
                                    }}
                                >
                                    แก้ไข
                                </Button>
                            ),
                        }
                    ]}
                    isLoading={false}
                />
            </Box>
        </Box>
    </Box>)
}

export default FormsPage;