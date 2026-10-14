"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  colors,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddLink,
  ContentCopy,
  EmailOutlined,
  Refresh,
  SaveOutlined,
  SendOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import useApi from "../../services";
import ModalCreateInvitation from "../modals/form/ModalCreateInvitation";
import ModalDispatchCampaign from "../modals/form/ModalDispatchCampaign";
import ModalImportRecipients from "../modals/form/ModalImportRecipients";

const defaultCampaign = {
  name: "",
  subject: "ขอเชิญเข้าร่วมตอบแบบสอบถาม",
  body: "เรียน {{recipient_name}}\n\nขอเชิญท่านตอบแบบสอบถามตามลิงก์ต่อไปนี้\n{{survey_link}}\n\nขอบคุณสำหรับความร่วมมือ",
};

const stateNames = {
  pending: "ยังไม่ส่ง",
  sent: "ส่งแล้ว",
  opened: "เปิดลิงก์แล้ว",
  started: "กำลังตอบ",
  completed: "ตอบสำเร็จ",
  failed: "ส่งล้มเหลว",
  expired: "หมดอายุ",
  revoked: "ยกเลิก",
};
const stateColors = {
  sent: "info",
  opened: "info",
  started: "warning",
  completed: "success",
  failed: "error",
  revoked: "error",
};
const errorMessage = (err) =>
  err?.response?.data?.message || err?.message || "เกิดข้อผิดพลาด";
const unwrap = (res) => res?.data ?? res;
const fmtNumber = (n) => Number(n ?? 0).toLocaleString("th-TH");
const fmtDate = (date) => (date ? new Date(date).toLocaleString("th-TH") : "-");
const PAGE_SIZE = 25;

// ใช้ 1 Campaign ต่อ 1 Form, ส่ง Bulk จากรายชื่อใน DB ที่ Backend คัดเลือก
export default function SurveyEmailCampaign({ formId, formTitle = "" }) {
  const [campaign, setCampaign] = useState(defaultCampaign);
  const [campaignReady, setCampaignReady] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copyingId, setCopyingId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [createMode, setCreateMode] = useState("copy");
  const [createOpen, setCreateOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const summaryCards = [
    {
      label: "รายชื่อที่ใช้ส่งได้",
      value: summary?.eligible_count,
      color: "#7C3AED",
      bgcolor: "#F5F3FF",
    },
    {
      label: "ยังไม่ส่ง",
      value: summary?.unsent_count,
      color: "#F59E0B",
      bgcolor: "#FFFBEB",
    },
    {
      label: "ส่งแล้ว",
      value: summary?.sent_count,
      color: "#0284C7",
      bgcolor: "#F0F9FF",
    },
    {
      label: "ส่งไม่สำเร็จ",
      value: summary?.failed_count,
      color: "#DC2626",
      bgcolor: "#FEF2F2",
    },
    {
      label: "ตอบแล้ว",
      value: summary?.completed_count,
      color: "#16A34A",
      bgcolor: "#F0FDF4",
    },
  ];

  const notify = useCallback((message, severity = "success") => {
    setSnack({ open: true, message, severity });
  }, []);

  const refreshSummary = useCallback(async () => {
    if (!formId) return;
    const result = await useApi.emailCampaigns.getCampaignSummary(formId);
    setSummary(unwrap(result));
  }, [formId]);

  const refreshRows = useCallback(async () => {
    if (!formId) return;
    setListLoading(true);
    try {
      const result = await useApi.emailCampaigns.getInvitations(formId, {
        page: page + 1,
        page_size: PAGE_SIZE,
        search,
      });
      const data = unwrap(result);
      setRows(Array.isArray(data?.items) ? data.items : []);
      setTotalRows(Number(data?.total ?? 0));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setListLoading(false);
    }
  }, [formId, page, search]);

  const fetchInviteList = useCallback(async () => {
    if (!formId) return;

    setListLoading(true);

    try {
      const response = await useApi.invitation.getInvitations(formId, {
        page: page + 1,
        page_size: PAGE_SIZE,
        search,
      });

      const data = response?.data ?? response;

      setRows(Array.isArray(data?.items) ? data.items : []);
      setTotalRows(Number(data?.total ?? 0));
    } catch (error) {
      console.error("Error fetching invitation list:", error);
      setError(errorMessage(error));
    } finally {
      setListLoading(false);
    }
  }, [formId, page, search]);

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([refreshSummary(), fetchInviteList()]);
    } catch (error) {
      setError(errorMessage(error));
    }
  }, [refreshSummary, fetchInviteList]);

  useEffect(() => {
    if (!formId) return;
    let active = true;
    setCampaignLoading(true);
    setCampaign(defaultCampaign);
    setCampaignReady(false);
    setIsDirty(false);
    setSummary(null);
    setPage(0);
    Promise.resolve()
      .then(() => useApi.emailCampaigns.getCampaign(formId))
      .then((response) => {
        if (!active) return;
        const data = unwrap(response);
        setCampaign({
          name: data?.name || "",
          subject: data?.subject || defaultCampaign.subject,
          body: data?.body || defaultCampaign.body,
        });
        setCampaignReady(Boolean(data?.id));
        setIsDirty(false);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.response?.status !== 404) setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setCampaignLoading(false);
      });
    return () => {
      active = false;
    };
  }, [formId]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!formId || !["queued", "sending"].includes(summary?.status)) return;
    const timer = setInterval(() => {
      refreshSummary().catch((err) => setError(errorMessage(err)));
      refreshRows();
    }, 10000);
    return () => clearInterval(timer);
  }, [formId, summary?.status, refreshSummary, refreshRows]);

  const setValue = (field) => (event) => {
    setCampaign((prev) => ({ ...prev, [field]: event.target.value }));
    setIsDirty(true);
  };

  const save = async () => {
    setError("");
    if (
      !campaign.name.trim() ||
      !campaign.subject.trim() ||
      !campaign.body.trim()
    ) {
      setError("กรุณากรอกชื่อ Campaign, หัวข้อ และเนื้อหาอีเมล");
      return;
    }
    if (!campaign.body.includes("{{survey_link}}")) {
      setError(
        "ข้อความอีเมลต้องมี {{survey_link}} สำหรับลิงก์ของผู้รับแต่ละคน"
      );
      return;
    }
    setSaving(true);
    try {
      const response = await useApi.emailCampaigns.saveCampaign(formId, {
        name: campaign.name.trim(),
        subject: campaign.subject.trim(),
        body: campaign.body.trim(),
      });
      const saved = unwrap(response);
      setCampaignReady(Boolean(saved?.id));
      setIsDirty(false);
      notify("บันทึก Email Campaign สำหรับแบบสอบถามนี้แล้ว");
      await refreshSummary();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const openCreate = (mode) => {
    setCreateMode(mode);
    setCreateOpen(true);
  };
  const queueBulk = async (scope) => {
    await useApi.emailCampaigns.dispatchCampaign(formId, scope);
    setDispatchOpen(false);
    notify("รับคำขอส่งอีเมลแล้ว ระบบกำลังจัดคิวส่งด้วย Resend");
    await refreshAll();
  };

  const copyExistingLink = async (invite_code) => {
    const inviteUrl = `${window.location.origin}/surveys/${invite_code}`;

    await navigator.clipboard.writeText(inviteUrl);

    notify("คัดลอกลิงก์สำเร็จ");
  };

  const jobActive = ["queued", "sending"].includes(summary?.status);
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={1}
          >
            <Box>
              <Typography fontWeight={700} variant="h6">
                Email Campaign สำหรับแบบสอบถาม
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formTitle || "แบบสอบถาม"} • หนึ่งชุดข้อความสำหรับผู้รับทุกคน
              </Typography>
            </Box>
            <Chip
              label="ผู้ส่ง: survey@siamcentricresearch.com"
              color="primary"
              variant="outlined"
            />
          </Stack>
          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
          {isDirty && (
            <Alert sx={{ mt: 2 }} severity="warning">
              มีการแก้ไขข้อความที่ยังไม่บันทึก กรุณาบันทึกก่อนส่งอีเมล
            </Alert>
          )}
          {campaignLoading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="ชื่อ Campaign"
                fullWidth
                required
                value={campaign.name}
                onChange={setValue("name")}
                placeholder={`เชิญตอบแบบสอบถาม ${formTitle}`}
              />
              <TextField
                label="หัวข้ออีเมล"
                fullWidth
                required
                value={campaign.subject}
                onChange={setValue("subject")}
              />
              <TextField
                label="ข้อความอีเมล"
                fullWidth
                required
                multiline
                minRows={7}
                value={campaign.body}
                onChange={setValue("body")}
                helperText="ใช้ {{recipient_name}} สำหรับชื่อผู้รับ และ {{survey_link}} สำหรับลิงก์เฉพาะบุคคล"
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  disabled={saving || jobActive}
                  onClick={save}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: colors.lightBlue[700],
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                    padding: "8px 16px",
                    color: "white",
                    "&:hover": { backgroundColor: colors.lightBlue[600] },
                  }}
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก Campaign"}
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          gap={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography fontWeight={700} variant="h6">
              การส่งคำเชิญ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              นำเข้ารายชื่อจาก Excel / Google Sheets แล้วค่อยเลือกส่งอีเมล
              หรือสร้างลิงก์เป็นรายคน
            </Typography>
          </Box>
          <Chip
            label={
              jobActive
                ? "กำลังส่งตามคิว"
                : summary?.status === "completed"
                ? "ส่งชุดล่าสุดเสร็จแล้ว"
                : "พร้อมจัดการ"
            }
            color={jobActive ? "warning" : "default"}
            variant="outlined"
          />
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: 2,
            width: "100%",
            mb: 2,
          }}
        >
          {summaryCards.map(({ label, value, color, bgcolor }) => (
            <Box
              key={label}
              sx={{
                bgcolor,
                border: `1.5px solid ${color}`,
                borderRadius: 2,
                p: 2,
                minWidth: 0,
                minHeight: 110,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {label}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color,
                  fontWeight: 700,
                }}
              >
                {fmtNumber(value)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Button
            variant="contained"
            startIcon={<SendOutlined />}
            disabled={
              !campaignReady ||
              isDirty ||
              jobActive ||
              Number(summary?.unsent_count ?? 0) +
                Number(summary?.failed_count ?? 0) ===
                0
            }
            onClick={() => setDispatchOpen(true)}
          >
            ส่งอีเมลจากรายชื่อในฐานข้อมูล
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFileOutlined />}
            disabled={!campaignReady || isDirty || jobActive}
            onClick={() => setImportOpen(true)}
          >
            นำเข้ารายชื่อ Excel / Google Sheets
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddLink />}
            onClick={() => openCreate("copy")}
          >
            สร้างลิงก์และคัดลอก
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailOutlined />}
            disabled={!campaignReady || isDirty}
            onClick={() => openCreate("email")}
          >
            ส่งอีเมลรายบุคคล
          </Button>
          <Button variant="text" startIcon={<Refresh />} onClick={refreshAll}>
            รีเฟรช
          </Button>
        </Stack>
        <Typography sx={{ mt: 1 }} variant="caption" color="text.secondary">
          การนำเข้าจะสร้าง Invitation เป็นสถานะยังไม่ส่ง
          และไม่ส่งอีเมลอัตโนมัติ; บันทึก Campaign ก่อนนำเข้า/ส่ง
          การส่งหลายพันคนทำงานใน Background ที่ Backend
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 2 }}>
          <Typography fontWeight={700} variant="h6">
            รายการลิงก์เฉพาะบุคคล
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="ค้นหาชื่อหรืออีเมล (ค้นหาจากฐานข้อมูล)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(0);
                  setSearch(searchValue.trim());
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                setPage(0);
                setSearch(searchValue.trim());
              }}
            >
              ค้นหา
            </Button>
          </Stack>
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell>ชื่อผู้รับ</TableCell>
                <TableCell>อีเมล</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>ส่งล่าสุด</TableCell>
                <TableCell>ตอบสำเร็จ</TableCell>
                <TableCell align="right">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={22} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    ไม่พบข้อมูลผู้รับ
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.recipient_name || "-"}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={stateNames[row.status] || row.status || "-"}
                        color={stateColors[row.status] || "default"}
                      />
                    </TableCell>
                    <TableCell>{fmtDate(row.sent_at)}</TableCell>
                    <TableCell>{fmtDate(row.completed_at)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<ContentCopy />}
                        disabled={
                          copyingId === row.id ||
                          ["revoked", "expired", "completed"].includes(
                            row.status
                          )
                        }
                        onClick={() => copyExistingLink(row.invite_code)}
                      >
                        คัดลอก
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          labelRowsPerPage="รายการต่อหน้า"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} จาก ${count}`
          }
        />
      </Paper>

      <ModalCreateInvitation
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initialMode={createMode}
        campaignReady={campaignReady && !isDirty}
        onCreate={(payload) =>
          useApi.invitation.createInvitation(formId, payload)
        }
        onSendEmail={(payload) =>
          useApi.emailCampaigns.sendInvitationEmail(formId, payload)
        }
        onSaved={refreshAll}
      />
      <ModalImportRecipients
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onPreviewFile={(file) =>
          useApi.emailCampaigns.previewRecipientsFile(formId, file)
        }
        onPreviewSheet={(sheetUrl) =>
          useApi.emailCampaigns.previewRecipientsSheet(formId, sheetUrl)
        }
        onCommit={(importId) =>
          useApi.emailCampaigns.commitRecipientsImport(formId, importId)
        }
        onImported={async () => {
          setPage(0);
          await refreshAll();
          notify("นำเข้ารายชื่อผู้รับเรียบร้อยแล้ว");
        }}
      />
      <ModalDispatchCampaign
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        summary={summary}
        onDispatch={queueBulk}
      />
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
