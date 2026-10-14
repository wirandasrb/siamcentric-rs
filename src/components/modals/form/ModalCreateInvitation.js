"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ContentCopy, EmailOutlined, LinkOutlined } from "@mui/icons-material";

const errorMessage = (err) =>
  err?.response?.data?.message || err?.message || "ไม่สามารถดำเนินการได้";

// result มี invite_url เฉพาะโหมด copy และคืนมาจาก Backend เท่านั้น
export default function ModalCreateInvitation({
  open,
  onClose,
  onCreate,
  onSendEmail,
  onSaved,
  campaignReady,
  initialMode = "copy",
}) {
  const [mode, setMode] = useState("copy");
  const [recipientName, setRecipientName] = useState("");
  const [email, setEmail] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("14");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [queued, setQueued] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setRecipientName("");
    setEmail("");
    setExpiresInDays("14");
    setError("");
    setInviteUrl("");
    setQueued(false);
    setCopied(false);
  }, [open, initialMode]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const days = Number(expiresInDays);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      setError("กำหนดวันหมดอายุได้ตั้งแต่ 1–365 วัน");
      return;
    }
    if (mode === "email" && !campaignReady) {
      setError("กรุณาบันทึก Email Campaign ก่อนส่งอีเมล");
      return;
    }
    const payload = {
      email: email.trim().toLowerCase(),
      recipient_name: recipientName.trim() || null,
    };
    setBusy(true);
    try {
      const response =
        mode === "copy" ? await onCreate(payload) : await onSendEmail(payload);
      const data = response?.data ?? response;
      if (mode === "copy") {
        if (!data?.invite_code) throw new Error("Backend ไม่ได้คืน invite_url");
        setInviteUrl(data.invite_code);
      } else {
        setQueued(true);
      }
      onSaved?.();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
    } catch {
      setError("คัดลอกไม่ได้ กรุณาเลือกและคัดลอกลิงก์เอง");
    }
  };

  const done = Boolean(inviteUrl || queued);
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        ลิงก์แบบสอบถามเฉพาะบุคคล
      </DialogTitle>
      <Divider />
      <DialogContent>
        {done ? (
          <Stack spacing={2}>
            <Alert severity="success">
              {queued
                ? "รับคำขอส่งอีเมลแล้ว ระบบจะส่งตามคิวด้วย Resend"
                : "สร้างลิงก์สำเร็จ ระบบจะไม่ส่งอีเมลอัตโนมัติ"}
            </Alert>
            {inviteUrl && (
              <>
                <Typography variant="body2" color="text.secondary">
                  กรุณาคัดลอกก่อนปิดหน้าต่าง
                  ลิงก์นี้มีสิทธิ์เข้าถึงแบบสอบถามของผู้รับ
                </Typography>
                <TextField
                  label="ลิงก์เฉพาะบุคคล"
                  value={inviteUrl}
                  fullWidth
                  multiline
                  maxRows={3}
                  InputProps={{ readOnly: true }}
                />
                <Button
                  startIcon={<ContentCopy />}
                  variant="contained"
                  onClick={copyUrl}
                >
                  {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                </Button>
              </>
            )}
          </Stack>
        ) : (
          <Stack
            component="form"
            id="create-survey-invitation"
            spacing={2}
            onSubmit={submit}
          >
            <Typography variant="body2" color="text.secondary">
              ผู้รับ 1 อีเมลจะมี 1 Invitation ต่อแบบสอบถาม
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={mode}
              onChange={(_, next) => {
                if (next) setMode(next);
              }}
            >
              <ToggleButton value="copy">
                <LinkOutlined sx={{ mr: 1 }} />
                คัดลอกลิงก์
              </ToggleButton>
              <ToggleButton value="email">
                <EmailOutlined sx={{ mr: 1 }} />
                ส่งอีเมล
              </ToggleButton>
            </ToggleButtonGroup>
            {mode === "email" && (
              <Alert severity="info">
                ส่งจาก survey@siamcentricresearch.com ผ่าน Resend
                โดยใช้หัวข้อและข้อความจาก Email Campaign ที่บันทึกไว้
              </Alert>
            )}
            <TextField
              label="ชื่อผู้รับ"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              fullWidth
            />
            <TextField
              label="อีเมลผู้รับ"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        )}
        {done && error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={busy}>
          {done ? "ปิด" : "ยกเลิก"}
        </Button>
        {!done && (
          <Button
            form="create-survey-invitation"
            type="submit"
            variant="contained"
            disabled={busy || (mode === "email" && !campaignReady)}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              boxShadow: "none",
              color: "#fff",
              fontSize: 14,
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {busy
              ? "กำลังดำเนินการ..."
              : mode === "copy"
              ? "สร้างลิงก์"
              : "สร้างและส่งอีเมล"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
