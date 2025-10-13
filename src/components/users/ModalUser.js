"use client"

import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import useApi from "../../services";
import { useEffect } from "react";

const ModalUser = ({ open, onClose, id = null }) => {

    const fetchUserData = async (id) => {
        try {
            const response = await useApi.users.getUserById(id);
            if (response) {
                formik.setValues({
                    username: response.username || "",
                    password: "",
                    confirmPassword: "",
                    firstname: response.firstname || "",
                    lastname: response.lastname || "",
                    role: response.role || 2,
                });
            }
        }
        catch (error) { console.error("Error fetching user data:", error); }
    }

    useEffect(() => {
        if (id) { fetchUserData(id); }
        else {
            formik.setValues({
                username: "",
                password: "",
                confirmPassword: "",
                firstname: "",
                lastname: "",
                role: 2, // default to user
            });
        }
    }, [id]);

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: "",
            role: 2, // default to user
        },
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
        }
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
            sx={{
                '& .MuiDialog-paper': { borderRadius: 3 }
            }}
        >
            <DialogTitle>{id ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <Close />
            </IconButton>
            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 2,
                        px: 2,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                    }}
                    >
                        <TextField
                            fullWidth
                            label="ชื่อ"
                            name="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="นามสกุล"
                            name="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="ชื่อผู้ใช้"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label={id ? "รหัสผ่านใหม่ (เว้นว่างหากไม่เปลี่ยนแปลง)" : "รหัสผ่าน"}
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label={id ? "ยืนยันรหัสผ่านใหม่" : "ยืนยันรหัสผ่าน"}
                        name="confirmPassword"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        select
                        fullWidth
                        label="บทบาท"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    >
                        <MenuItem value={1}>ผู้ดูแลระบบ</MenuItem>
                        <MenuItem value={2}>ผู้ใช้งาน</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    px: 2,
                    py: 1
                }}
                >
                    <Button
                        onClick={onClose}
                        color="primary"
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                        }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={() => { /* Handle save action */ }}
                        color="primary"
                        variant="contained"
                        sx={{
                            borderRadius: 3,
                            boxShadow: 'none'
                        }}
                    >
                        {id ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มผู้ใช้งาน"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>);
}

export default ModalUser;

