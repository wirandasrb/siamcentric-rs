"use client";
import React, { useEffect } from "react";
import useApi from "../../../services";
import { Box, Button, Chip, Typography } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import TableComponent from "../../../components/Table";
import { formatDateTH } from "../../../helpers/format";
import Actions from "../../../components/Actions";
import ModalUser from "../../../components/users/ModalUser";

const UsersPage = () => {
    const [usersList, setUsersList] = React.useState([]);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const [createMode, setCreateMode] = React.useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await useApi.users.getListUser();
            setUsersList(data);
        } catch (error) {
            console.error("Error fetching user list:", error);
        }
    }

    const handleEdit = (row) => {
        setSelectedRow(row);
        setCreateMode(true);
    }

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Typography variant="h5">ผู้ใช้งาน</Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 'none'
                        }}
                        onClick={() => setCreateMode(true)}
                    >
                        เพิ่มผู้ใช้งาน
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
                            data={usersList || []}
                            columns={[
                                { id: "username", label: "ชื่อผู้ใช้" },
                                {
                                    id: "fullname", label: "ชื่อ-นามสกุล", render: (row) => (
                                        <span>{row.firstname} {row.lastname}</span>
                                    )
                                },
                                {
                                    id: "role", label: "บทบาท", render: (row) => (
                                        <span>
                                            {row.role?.name === "admin" ? "ผู้ดูแลระบบ" :
                                                row.role?.name === "superadmin" ?
                                                    "ผู้ดูแลระบบระดับสูง" : "ผู้ใช้งานทั่วไป"}
                                        </span>
                                    )
                                },
                                { id: 'created_at', label: 'วันที่สร้าง', render: (row) => formatDateTH(row.created_at) },
                                {
                                    id: 'is_active', label: 'สถานะ', render: (row) => (
                                        <Chip
                                            size="small"
                                            label={row.is_active ? "ใช้งาน" : "ระงับ"}
                                            color={row.is_active ? "success" : "default"}
                                            sx={{
                                                minWidth: 80
                                            }} />
                                    )
                                },
                                {
                                    id: 'actions', label: 'จัดการ', render: (row) => (
                                        <Actions
                                            menuList={[
                                                { label: "แก้ไข", icon: <Edit />, onClick: () => handleEdit(row) },
                                                // { label: "ลบ", onClick: () => handleDelete(row) }
                                            ]}
                                        />)
                                }
                            ]}
                        />
                    </Box>
                </Box>
            </Box>
            <ModalUser
                open={createMode || Boolean(selectedRow)}
                onClose={() => {
                    setCreateMode(false);
                    setSelectedRow(null);
                }}
                id={selectedRow?.id ?? null}
            />
        </>)

}
export default UsersPage;