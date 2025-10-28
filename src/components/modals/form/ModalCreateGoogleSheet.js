import { Add, DatasetLinked } from "@mui/icons-material";
import {
  Box,
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import useApi from "../../../services";

const ModalCreateGoogleSheet = ({
  open,
  onClose,
  onCreate,
  formId,
  isEdit = true,
}) => {
  const [inputEmail, setInputEmail] = React.useState("");
  const [emails, setEmails] = React.useState([]);

  const handleAddEmail = () => {
    if (inputEmail && !emails.includes(inputEmail)) {
      setEmails([...emails, inputEmail]);
      setInputEmail("");
    }
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    if (!open) {
      setInputEmail("");
      setEmails([]);
    } else {
      if (isEdit && formId) {
        fetchData();
      }
    }
  }, [open]);

  const fetchData = async () => {
    if (isEdit && formId) {
      // ดึงข้อมูลอีเมลที่ซิงค์จาก API
      try {
        const response = await useApi.forms.getEmailSyncGoogleSheet(formId);
        console.log("Fetched synced emails:", response);
        if (response && response.data.length > 0) {
          let formattedEmails = [];
          response.data.forEach((item) => {
            if (item.email) {
              formattedEmails.push(item.email);
            }
          });
          setEmails(formattedEmails);
        }
      } catch (error) {
        console.error("Error fetching synced emails:", error);
      }
    }
  };
  console.log("Current synced emails:", emails);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      size="md"
      fullWidth
    >
      <DialogTitle>ซิงค์อีเมล Google Sheet</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 2,
            gap: 2,
          }}
        >
          <DatasetLinked
            sx={{
              fontSize: 60,
              color: colors.lightBlue[300],
            }}
          />
          <Typography sx={{ color: "#555" }}>
            การซิงค์อีเมลจะช่วยให้คุณสามารถนำเข้าข้อมูลผู้ตอบแบบสอบถามจาก Google
            Sheet ได้อย่างง่ายดาย
          </Typography>
        </Box>
        <TextField
          label="เพิ่มอีเมล"
          variant="outlined"
          value={inputEmail}
          type="email"
          placeholder="กรอกอีเมลที่ต้องการซิงค์"
          onChange={(e) => setInputEmail(e.target.value)}
          fullWidth
          sx={{
            marginBottom: 2,
            "& .MuiInputBase-root": { height: 40 },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            handleAddEmail();
          }}
          disabled={
            !inputEmail ||
            emails?.includes(inputEmail) ||
            !validateEmail(inputEmail)
          }
          sx={{
            borderRadius: 3,
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
          startIcon={<Add />}
        >
          เพิ่มอีเมล
        </Button>

        <Typography
          sx={{
            color: colors.blue[700],
            mt: 2,
            fontWeight: "medium",
          }}
        >
          อีเมลที่ซิงค์:
        </Typography>
        {/* รายการอีเมลที่ซิงค์จะแสดงที่นี่ */}
        <Box
          sx={{
            mt: 1,
            padding: 1,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            height: 250,
            overflowY: "auto",
          }}
        >
          {emails.length > 0 ? (
            emails.map((email, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 1,
                  borderRadius: 4,
                  backgroundColor: colors.blue[50],
                  px: 2,
                  mt: 1,
                }}
              >
                <Typography sx={{ color: "#555" }}>{email}</Typography>
                <Button
                  onClick={() => {
                    const newEmails = emails.filter((e) => e !== email);
                    setEmails(newEmails);
                  }}
                  sx={{
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "#ffebee",
                      borderRadius: 2,
                    },
                  }}
                >
                  ลบ
                </Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ marginLeft: 2, color: "#999" }}>
              ไม่มีอีเมลที่ซิงค์
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 2,
        }}
      >
        <Button onClick={onClose} color="error">
          ยกเลิก
        </Button>
        <Button onClick={() => onCreate(emails)} color="primary">
          {isEdit ? "บันทึก" : "สร้าง"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreateGoogleSheet;
