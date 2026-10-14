"use client";

import React, { useState } from "react";
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, FormControlLabel, Radio, RadioGroup, Stack, Typography,
} from "@mui/material";

const getError = (err) => err?.response?.data?.message || err?.message || "ส่งงานไม่สำเร็จ";

export default function ModalDispatchCampaign({ open, onClose, summary, onDispatch }) {
  const [scope, setScope] = useState("unsent");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (busy) return;
    setError("");
    setScope("unsent");
    onClose();
  };

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      await onDispatch(scope);
      close();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>ยืนยันการส่งแบบสอบถามทางอีเมล</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            ระบบจะใช้ Email Campaign เดียวกันสำหรับทุกคน แต่ลิงก์ในแต่ละฉบับแตกต่างกัน
          </Alert>
          <Typography variant="body2">อีเมลผู้ส่ง: <strong>survey@siamcentricresearch.com</strong></Typography>
          <RadioGroup value={scope} onChange={(e) => setScope(e.target.value)}>
            <FormControlLabel
              value="unsent"
              control={<Radio />}
              label={`ส่งเฉพาะผู้ที่ยังไม่ได้ส่ง (${Number(summary?.unsent_count ?? 0).toLocaleString("th-TH")} คน)`}
            />
            <FormControlLabel
              value="failed"
              control={<Radio />}
              label={`ส่งใหม่เฉพาะรายที่ส่งไม่สำเร็จ (${Number(summary?.failed_count ?? 0).toLocaleString("th-TH")} คน)`}
            />
          </RadioGroup>
          <Typography variant="body2" color="text.secondary">
            Backend ต้องคัดกรองอีเมลซ้ำ, ลิงก์ที่ตอบแล้ว และรายชื่อที่ไม่มีสิทธิ์รับอีเมล ก่อนส่งจริง
            การกดปุ่มนี้เป็นการส่งงานเข้า Queue ไม่ได้หมายความว่าส่งครบแล้ว
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button disabled={busy} onClick={close}>ยกเลิก</Button>
        <Button
          variant="contained" color="primary"
          onClick={submit} disabled={busy || Number(scope === "unsent" ? summary?.unsent_count : summary?.failed_count) < 1}
        >
          {busy ? "กำลังสร้างงานส่ง..." : "ยืนยันการส่งเข้าคิว"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
