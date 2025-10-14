"use client";
import {
  ErrorOutline,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { object, string } from "yup";
import authService from "../../services/authService";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  // const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSignin = async (values) => {
    console.log(values);
    try {
      const response = await authService.login(
        values.username,
        values.password
      );
      if (response.status === 200) {
        router.push("/admin/dashboard");
      } else {
        throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: object({
      username: string().required("กรุณากรอกชื่อผู้ใช้"),
      password: string().required("กรุณากรอกรหัสผ่าน"),
    }),
    onSubmit: (values) => {
      handleSignin(values);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.main",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          height: {
            xs: "500px",
            sm: "600px",
            md: "600px",
            lg: "600px",
          },
          width: {
            xs: "90%",
            sm: "80%",
            md: "40%",
            lg: "30%",
          },
          borderRadius: "10px",
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            borderRadius: "50%",
            backgroundColor: "primary.main",
            width: "110px",
            height: "110px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            mt: 0,
          }}
        >
          <img
            src={"/images/online-survey.png"}
            alt="Online Survey Icon"
            style={{ width: "80px", height: "80px" }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: "bold", color: "text.primary" }}
        >
          ระบบจัดการแบบสอบถามออนไลน์
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            gap: 1,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            {error && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  flexDirection: "error",
                }}
              >
                <ErrorOutline color="error" />
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ textAlign: "center" }}
                >
                  {error}
                </Typography>
              </Box>
            )}
            <TextField
              label="ชื่อผู้ใช้"
              variant="outlined"
              margin="normal"
              fullWidth
              value={formik.values.username}
              onChange={formik.handleChange}
              name="username"
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      sx={{ background: "transparent" }}
                      edge="end"
                      disabled
                    >
                      <Person />
                    </IconButton>
                  ),
                },
              }}
              helperText={
                formik.touched.username && formik.errors.username
                  ? formik.errors.username
                  : null
              }
              error={formik.touched.username && Boolean(formik.errors.username)}
            />
            <TextField
              label="รหัสผ่าน"
              variant="outlined"
              margin="normal"
              fullWidth
              type={isShowPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      sx={{ background: "transparent" }}
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      edge="end"
                    >
                      {isShowPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                },
              }}
              value={formik.values.password}
              onChange={formik.handleChange}
              name="password"
              helperText={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : null
              }
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            <Button
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                mt: 2,
                width: "100%",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                borderRadius: 4,
              }}
              onClick={formik.handleSubmit}
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
