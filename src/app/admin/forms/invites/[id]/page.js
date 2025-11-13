"use client";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
import useApi from "../../../../../services";
import TableComponent from "../../../../../components/Table";
import { Clear, ContentCopy, CopyAll } from "@mui/icons-material";
import { formatDateTH } from "../../../../../helpers/format";

const InvitesPage = () => {
    const { id } = useParams();
    const [data, setData] = React.useState(null);
    const [pagination, setPagination] = React.useState({
        page: 1,
        limit: 10,
        total_pages: 0,
    });
    const [toast, setToast] = React.useState({
        open: false,
        message: "",
        severity: "success",
    });

    React.useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const response = await useApi.invites.getInviteCodeByFormId(id, pagination);
            if (response.success === true) {
                setData(response.data);
                setPagination({
                    page: response.data.page || 1,
                    limit: response.data.limit || 10,
                    total_pages: response.data.total_pages || 0,
                });
            } else {
                console.error("Failed to fetch invite data:", response.message);
            }
        } catch (error) {
            console.error("Failed to fetch invite data:", error);
        }
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5">ลิงก์เชิญผู้ตอบแบบสอบถาม</Typography>
            <Box
                sx={{
                    mt: 2,
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Box sx={{ p: 2 }}>
                    <TableComponent
                        data={[{
                            index: 1,
                            code: "ABC123",
                            submitted_at: "2024-01-01 12:00",
                            is_submitted: true,
                        }]}
                        columns={[
                            { id: "index", label: "ลำดับ" },
                            { id: "code", label: "รหัสเชิญ" },
                            {
                                id: "submitted_at",
                                label: "วันที่ส่งคำตอบ",
                                render: (row) => formatDateTH(row.submitted_at)
                            },
                            {
                                id: "is_submitted",
                                label: "สถานะ",
                                render: (row) => {
                                    return <Chip
                                        label={row.is_submitted ? "ส่งแล้ว" : "ยังไม่ส่ง"}
                                        color={row.is_submitted ? "success" : "default"}
                                        size="small" />;

                                }
                            },
                            {
                                id: "actions", label: "ดำเนินการ", render: (row) => {
                                    return (
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Tooltip title="คัดลอกลิงก์เชิญ">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        // handle edit invite code
                                                        console.log("Edit invite code:", row.code);
                                                    }}
                                                >
                                                    <ContentCopy />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="ลบลิงก์เชิญ">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        // handle delete invite code
                                                        console.log("Delete invite code:", row.code);
                                                    }}
                                                >
                                                    <Clear />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    );
                                }
                            },
                        ]}
                    />
                </Box>

            </Box>
        </Box>
    )
}
export default InvitesPage;
