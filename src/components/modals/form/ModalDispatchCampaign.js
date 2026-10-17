"use client";

import React, { useState } from "react";
import {
  Alert,
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "ส่งงานไม่สำเร็จ";

const formatNumber = (value) => Number(value ?? 0).toLocaleString("th-TH");

export default function ModalDispatchCampaign({
  open,
  onClose,
  summary,
  onDispatch,
}) {
  const [scope, setScope] = useState("eligible");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const scopeCounts = {
    eligible: Number(summary?.eligible_count ?? 0),
    unsent: Number(summary?.unsent_count ?? 0),
    failed: Number(summary?.failed_count ?? 0),
  };

  const selectedCount = scopeCounts[scope] ?? 0;

  const close = () => {
    if (busy) return;

    setError("");
    setScope("eligible");
    onClose();
  };

  const submit = async () => {
    if (busy || selectedCount < 1) return;

    setError("");
    setBusy(true);

    try {
      await onDispatch(scope);

      setScope("eligible");
      setError("");
      onClose();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        ยืนยันการส่งแบบสอบถามทางอีเมล
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            ระบบจะใช้ Email Campaign เดียวกันสำหรับทุกคน
            แต่ลิงก์ในแต่ละฉบับแตกต่างกัน
            โดยผู้ที่ตอบแบบสอบถามสำเร็จแล้วจะไม่ได้รับอีเมลซ้ำ
          </Alert>

          <Typography variant="body2">
            อีเมลผู้ส่ง: <strong>survey@siamcentricresearch.com</strong>
          </Typography>

          <RadioGroup value={scope} onChange={(e) => setScope(e.target.value)}>
            <FormControlLabel
              value="eligible"
              disabled={busy}
              control={<Radio />}
              label={`ส่งให้ทุกคนที่ยังตอบไม่สำเร็จ (${formatNumber(
                scopeCounts.eligible
              )} คน)`}
            />

            <FormControlLabel
              value="unsent"
              disabled={busy}
              control={<Radio />}
              label={`ส่งเฉพาะผู้ที่ยังไม่ได้ส่ง (${formatNumber(
                scopeCounts.unsent
              )} คน)`}
            />

            <FormControlLabel
              value="failed"
              disabled={busy}
              control={<Radio />}
              label={`ส่งใหม่เฉพาะรายที่ส่งไม่สำเร็จ (${formatNumber(
                scopeCounts.failed
              )} คน)`}
            />
          </RadioGroup>

          <Alert severity="warning">
            ระบบจะสร้างงานส่งอีเมลจำนวน{" "}
            <strong>{formatNumber(selectedCount)} รายชื่อ</strong> และประมวลผลใน
            Background โดยไม่ส่งให้ผู้ที่ตอบสำเร็จ ลิงก์หมดอายุ หรือถูกยกเลิก
          </Alert>

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button disabled={busy} onClick={close}>
          ยกเลิก
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={submit}
          disabled={busy || selectedCount < 1}
          sx={{
            borderRadius: 3,
            backgroundColor: colors.lightBlue[700],
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
            padding: "8px 16px",
            color: "white",
            "&:hover": { backgroundColor: colors.lightBlue[600] },
          }}
        >
          {busy
            ? "กำลังสร้างงานส่ง..."
            : `ยืนยันส่ง ${formatNumber(selectedCount)} รายชื่อ`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
