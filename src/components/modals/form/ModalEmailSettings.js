"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const initial = {
  smtp_host: "",
  smtp_port: "587",
  smtp_secure: false,
  smtp_username: "",
  smtp_password: "",
  from_name: "",
  from_email: "",
  password_configured: false,
};

const messageFrom = (error) =>
  error?.response?.data?.message || error?.message || "ไม่สามารถดำเนินการได้";

export default function ModalEmailSettings({
  open,
  onClose,
  getSettings,
  saveSettings,
  testSettings,
  onNotify,
}) {
  const [form, setForm] = useState(initial);
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError("");
    setForm(initial);
    Promise.resolve()
      .then(() => getSettings())
      .then((response) => {
        if (!active) return;
        const data = response?.data ?? response;
        setForm({
          ...initial,
          ...data,
          smtp_password: "", // ห้ามให้ API ส่ง password ที่ถอดรหัสได้กลับมาหา browser
          smtp_port: String(data?.smtp_port ?? 587),
          password_configured: Boolean(data?.password_configured),
        });
      })
      .catch((err) => { if (active) setError(messageFrom(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, getSettings]);

  const change = (field) => (event) => {
    setForm((v) => ({ ...v, [field]: event.target.value }));
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.smtp_host.trim() || !form.from_email.trim()) {
      setError("กรุณาระบุ SMTP Host และอีเมลผู้ส่ง");
      return;
    }
    const port = Number(form.smtp_port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      setError("SMTP Port ไม่ถูกต้อง");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        smtp_host: form.smtp_host.trim(),
        smtp_port: port,
        smtp_secure: form.smtp_secure,
        smtp_username: form.smtp_username.trim(),
        from_name: form.from_name.trim(),
        from_email: form.from_email.trim(),
      };
      // ไม่ส่ง field password หากปล่อยว่าง = เก็บค่าเดิมไว้ฝั่ง Backend
      if (form.smtp_password) payload.smtp_password = form.smtp_password;
      await saveSettings(payload);
      setForm((v) => ({
        ...v,
        smtp_password: "",
        password_configured: Boolean(v.smtp_password || v.password_configured),
      }));
      onNotify?.("บันทึกการตั้งค่าอีเมลแล้ว", "success");
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setError("");
    if (!testEmail.trim()) return setError("กรุณาระบุอีเมลสำหรับทดสอบ");
    setTesting(true);
    try {
      await testSettings(testEmail.trim());
      onNotify?.("ส่งคำขอทดสอบอีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย", "success");
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving || testing ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>ตั้งค่าอีเมลผู้ส่ง (SMTP)</DialogTitle>
      <Divider />
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          การตั้งค่านี้สำหรับผู้ดูแลระบบเท่านั้น รหัสผ่านจะส่งผ่าน HTTPS
          และต้องเข้ารหัสก่อนเก็บใน Backend
        </Alert>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" id="smtp-settings-form" onSubmit={save}>
            <Stack spacing={2}>
              <TextField required fullWidth label="SMTP Host" placeholder="smtp.example.com" value={form.smtp_host} onChange={change("smtp_host")} />
              <TextField required fullWidth type="number" label="SMTP Port" value={form.smtp_port} onChange={change("smtp_port")} />
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(form.smtp_secure)}
                    onChange={(event) => setForm((v) => ({ ...v, smtp_secure: event.target.checked }))}
                  />
                }
                label="ใช้ TLS ตั้งแต่เริ่มเชื่อมต่อ (ปกติ Port 465)"
              />
              <TextField fullWidth label="SMTP Username" autoComplete="off" value={form.smtp_username} onChange={change("smtp_username")} />
              <TextField
                fullWidth
                label="SMTP Password / App Password"
                type="password"
                autoComplete="new-password"
                value={form.smtp_password}
                onChange={change("smtp_password")}
                helperText={form.password_configured ? "บันทึกรหัสผ่านแล้ว เว้นว่างเพื่อใช้รหัสเดิม" : "กรอกรหัสผ่านสำหรับ SMTP"}
              />
              <Divider />
              <TextField fullWidth label="ชื่อผู้ส่ง" placeholder="ระบบแบบสอบถาม" value={form.from_name} onChange={change("from_name")} />
              <TextField required fullWidth type="email" label="อีเมลผู้ส่ง" placeholder="survey@example.com" value={form.from_email} onChange={change("from_email")} />
              <Button variant="contained" type="submit" form="smtp-settings-form" disabled={saving}>
                {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
              </Button>
              <Divider />
              <Typography fontWeight={700} variant="subtitle2">ทดสอบการส่งอีเมล</Typography>
              <Typography variant="body2" color="text.secondary">บันทึกการตั้งค่าก่อนทดสอบ ระบบจะใช้งานการตั้งค่าที่บันทึกไว้แล้ว</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  fullWidth
                  type="email"
                  label="อีเมลรับข้อความทดสอบ"
                  value={testEmail}
                  onChange={(event) => setTestEmail(event.target.value)}
                  size="small"
                />
                <Button variant="outlined" disabled={testing || saving} onClick={test} sx={{ whiteSpace: "nowrap" }}>
                  {testing ? "กำลังทดสอบ..." : "ส่งทดสอบ"}
                </Button>
              </Stack>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button disabled={saving || testing} onClick={onClose}>ปิด</Button>
      </DialogActions>
    </Dialog>
  );
}
