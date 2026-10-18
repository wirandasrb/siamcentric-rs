"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUploadOutlined, FileDownloadOutlined } from "@mui/icons-material";
import useApi from "../../../services";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "เกิดข้อผิดพลาดในการนำเข้า";
const unwrap = (response) => response?.data ?? response;
const count = (value) => Number(value ?? 0).toLocaleString("th-TH");
const STATUS = {
  ready: { text: "นำเข้าได้", color: "success" },
  importable: { text: "นำเข้าได้", color: "success" },
  duplicate_in_file: { text: "ซ้ำในไฟล์", color: "warning" },
  already_exists: { text: "มีในแบบสอบถามแล้ว", color: "info" },
  invalid: { text: "ข้อมูลไม่ถูกต้อง", color: "error" },
};

export default function ModalImportRecipients({
  open,
  onClose,
  onImportFile,
  onPreviewFile,
  onPreviewSheet,
  onCommit,
  onImported,
}) {
  const [source, setSource] = useState("file");
  const [file, setFile] = useState(null);
  const [sheetUrl, setSheetUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSource("file");
    setFile(null);
    setSheetUrl("");
    setPreview(null);
    setResult(null);
    setError("");
  }, [open]);

  const onSelectFile = (event) => {
    const next = event.target.files?.[0] || null;
    setFile(next);
    setPreview(null);
    setResult(null);
    setError("");
  };

  const makePreview = async () => {
    setError("");
    setPreview(null);
    setResult(null);
    if (source === "file") {
      if (!file) return setError("กรุณาเลือกไฟล์ Excel หรือ CSV");
      if (!/\.(xlsx|csv)$/i.test(file.name)) {
        return setError("รองรับเฉพาะ .xlsx หรือ .csv เท่านั้น");
      }
      if (file.size > MAX_FILE_BYTES) {
        return setError("ไฟล์ใหญ่เกิน 10 MB");
      }
    } else if (
      !/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]+/i.test(
        sheetUrl.trim()
      )
    ) {
      return setError("กรุณากรอกลิงก์ Google Sheets ที่ถูกต้อง");
    }
    setLoading(true);
    try {
      const response =
        source === "file"
          ? await onPreviewFile(file)
          : await onPreviewSheet(sheetUrl.trim());
      const data = unwrap(response);
      if (!data?.import_id || !data?.summary) {
        throw new Error("API ไม่ได้คืน import_id หรือข้อมูลสรุปสำหรับพรีวิว");
      }
      setPreview(data);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const commit = async () => {
    if (!preview?.import_id) return;
    setError("");
    setCommitting(true);
    try {
      const response = await onCommit(preview.import_id);
      setResult(unwrap(response));
      setPreview(null);
      await onImported?.();
    } catch (err) {
      setError(getError(err));
    } finally {
      setCommitting(false);
    }
  };

  const locked = loading || committing;
  const summary = preview?.summary || {};
  const samples = Array.isArray(preview?.sample) ? preview.sample : [];
  const canImport = Number(summary.importable_rows ?? 0) > 0;

  const handleImportExcel = async () => {
    setError("");

    if (!file) {
      setError("กรุณาเลือกไฟล์ Excel");
      return;
    }

    if (!/\.xlsx$/i.test(file.name)) {
      setError("รองรับเฉพาะไฟล์ .xlsx");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError("ไฟล์ใหญ่เกิน 10 MB");
      return;
    }

    console.log("File:", file);
    console.log("Is File:", file instanceof File);
    console.log("File name:", file.name);
    console.log("File size:", file.size);

    setLoading(true);

    try {
      const response = await onImportFile(file);
      const data = unwrap(response);

      setResult(data);
      setPreview(null);

      await onImported?.();
    } catch (error) {
      setError(getError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={locked ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        นำเข้ารายชื่อผู้รับแบบสอบถาม
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2.5}>
          <Alert severity="info">
            ขั้นตอนนี้นำเข้ารายชื่อและสร้าง Invitation เฉพาะบุคคลเท่านั้น
            <strong> ยังไม่ส่งอีเมล</strong> เมื่อพร้อมจึงค่อยกดส่งผ่าน Resend
            จากหน้า Campaign
          </Alert>
          {result ? (
            <Alert severity="success">
              <Typography fontWeight={700}>
                นำเข้ารายชื่อเรียบร้อยแล้ว
              </Typography>

              <Stack spacing={0.5} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  รายชื่อทั้งหมด: {count(result.total_rows)}
                </Typography>

                <Typography variant="body2">
                  สร้าง Invitation สำเร็จ: {count(result.created_count)}
                </Typography>

                <Typography variant="body2">
                  มีในระบบแล้ว: {count(result.existing_count)}
                </Typography>

                <Typography variant="body2">
                  ซ้ำภายในไฟล์: {count(result.duplicate_in_file_count)}
                </Typography>

                <Typography variant="body2">
                  ข้อมูลไม่ถูกต้อง: {count(result.invalid_count)}
                </Typography>
              </Stack>

              <Typography variant="body2" sx={{ mt: 1 }}>
                สามารถดูรายชื่อและคัดลอกลิงก์ได้จากตารางรายการลิงก์เฉพาะบุคคล
              </Typography>
            </Alert>
          ) : (
            <>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  เลือกแหล่งข้อมูล
                </Typography>
                <RadioGroup
                  row
                  value={source}
                  onChange={(event) => {
                    setSource(event.target.value);
                    setPreview(null);
                    setResult(null);
                    setError("");
                  }}
                >
                  <FormControlLabel
                    value="file"
                    control={<Radio />}
                    label="Excel / CSV"
                    disabled={locked}
                  />
                  {/* <FormControlLabel
                    value="sheet"
                    control={<Radio />}
                    label="Google Sheets"
                    disabled={locked}
                  /> */}
                </RadioGroup>
              </Box>

              {source === "file" ? (
                <Stack spacing={1.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadOutlined />}
                      disabled={locked}
                    >
                      เลือกไฟล์ .xlsx / .csv
                      <input
                        hidden
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={onSelectFile}
                      />
                    </Button>
                    <Button
                      component="a"
                      variant="text"
                      startIcon={<FileDownloadOutlined />}
                      href="/templates/survey-recipients-template.xlsx"
                      download
                    >
                      ดาวน์โหลดไฟล์ตัวอย่าง
                    </Button>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {file
                      ? `ไฟล์ที่เลือก: ${file.name} (${(
                          file.size / 1024
                        ).toFixed(1)} KB)`
                      : "ยังไม่ได้เลือกไฟล์"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    รองรับไฟล์ .xlsx ไม่เกิน 10 MB โดยใช้คอลัมน์ Name และ Email
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <TextField
                    label="ลิงก์ Google Sheets"
                    fullWidth
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=0"
                    value={sheetUrl}
                    disabled={locked}
                    onChange={(event) => {
                      setSheetUrl(event.target.value);
                      setPreview(null);
                      setResult(null);
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    ใช้ Google Sheet ที่ Backend ได้รับสิทธิ์อ่าน (เช่น แชร์ให้
                    Service Account) โดยข้อมูลอยู่ในชีตที่ระบุด้วย gid
                    หรือตามชีตแรก
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={source === "file" ? handleImportExcel : makePreview}
                  disabled={locked}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: colors.lightBlue[700],
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                    padding: "8px 16px",
                    color: "white",
                    "&:hover": { backgroundColor: colors.lightBlue[600] },
                  }}
                >
                  {loading && (
                    <CircularProgress
                      size={18}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                  )}

                  {source === "file"
                    ? loading
                      ? "กำลังนำเข้า Excel..."
                      : "นำเข้ารายชื่อจาก Excel"
                    : loading
                    ? "กำลังตรวจสอบ..."
                    : "ตรวจสอบข้อมูลก่อนนำเข้า"}
                </Button>
              </Stack>
            </>
          )}

          {preview && !result && (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={700}>ผลการตรวจสอบรายชื่อ</Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ my: 2 }}
              >
                <Chip
                  variant="outlined"
                  label={`ทั้งหมด ${count(summary.total_rows)}`}
                />
                <Chip
                  color="success"
                  variant="outlined"
                  label={`นำเข้าได้ ${count(summary.importable_rows)}`}
                />
                <Chip
                  color="warning"
                  variant="outlined"
                  label={`ซ้ำในไฟล์ ${count(summary.duplicate_in_file)}`}
                />
                <Chip
                  color="info"
                  variant="outlined"
                  label={`มีอยู่แล้ว ${count(summary.already_exists)}`}
                />
                <Chip
                  color="error"
                  variant="outlined"
                  label={`ข้อมูลผิด ${count(summary.invalid_rows)}`}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ตัวอย่างผลตรวจสอบ {samples.length} แถว (ผลรวมตรวจทั้งหมดที่
                Backend)
              </Typography>
              <TableContainer
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  maxHeight: 280,
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>แถว</TableCell>
                      <TableCell>ชื่อผู้รับ</TableCell>
                      <TableCell>อีเมล</TableCell>
                      <TableCell>ผลตรวจ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {samples.map((row, index) => {
                      const status = STATUS[row.status] || STATUS.invalid;
                      return (
                        <TableRow key={`${row.row_number ?? index}-${index}`}>
                          <TableCell>{row.row_number ?? "-"}</TableCell>
                          <TableCell>{row.recipient_name || "-"}</TableCell>
                          <TableCell>{row.email || "-"}</TableCell>
                          <TableCell>
                            <Stack spacing={0.5} alignItems="flex-start">
                              <Chip
                                size="small"
                                label={status.text}
                                color={status.color}
                              />
                              {row.reason ? (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {row.reason}
                                </Typography>
                              ) : null}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {samples.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          ไม่มีตัวอย่างข้อมูล
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Alert severity="warning" sx={{ mt: 2 }}>
                ระบบจะเพิ่มเฉพาะรายชื่อที่นำเข้าได้ ไม่เปลี่ยน Token
                หรือสถานะของผู้รับเดิม และไม่ส่งอีเมลอัตโนมัติ
              </Alert>
              {!canImport && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  ไม่มีรายชื่อใหม่ที่นำเข้าได้
                </Alert>
              )}
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={locked}>
          {result ? "เสร็จสิ้น" : "ยกเลิก"}
        </Button>
        {preview && !result && (
          <Button
            variant="contained"
            onClick={commit}
            disabled={!canImport || locked}
          >
            {committing
              ? "กำลังนำเข้า..."
              : `ยืนยันนำเข้า ${count(summary.importable_rows)} รายชื่อ`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
