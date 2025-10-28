"use client";

import {
  Add,
  Apps,
  CheckBox,
  Circle,
  Close,
  ColorLens,
  DragHandle,
  DragIndicator,
  Event,
  ExpandCircleDown,
  FileUpload,
  LinearScale,
  Notes,
  Schedule,
  Settings,
  ShortText,
  StarHalf,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  Popover,
  Grid,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  LinearProgress,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import SectionList from "../../../../components/forms/SectionList";
import useApi from "../../../../services";
import { fontTypeOptions } from "../../../../contants/fontTypes";

const colorPaletteDefault = [
  "#1976d2",
  "#43a047",
  "#e53935",
  "#f57c00",
  "#8e24aa",
  "#fbc02d",
];

const FormCreatePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [openThemeMenu, setOpenThemeMenu] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#1976d2");
  const [secondColor, setSecondColor] = useState("#f5f5f5");
  const [fontFamily, setFontFamily] = useState("Sarabun");
  const [logo, setLogo] = useState(null);

  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [colorPickerTarget, setColorPickerTarget] = useState("primary");
  const colorPickerOpen = Boolean(colorAnchorEl);

  const [formDetail, setFormDetail] = useState({
    title: "",
    description: "",
    note: "",
  });
  const [sections, setSections] = useState([
    {
      temp_id: "section-1",
      section_no: 1,
      section_title: "",
      section_note: "",
      note: "",
      questions: [
        {
          temp_id: "question-1",
          question_no: 1,
          question: "",
          question_type_id: 1,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (id && id !== "create") {
      // fetch form detail by id
      fetchFormDetail(id);
    }
  }, [id]);

  const fetchFormDetail = async (formId) => {
    setLoading(true);
    try {
      const response = await useApi.forms.getFormById(formId);
      if (response.status === "success") {
        const formData = response.data;
        setFormDetail({
          title: formData.title,
          description: formData.description,
          note: formData.note,
          allow_multiple_answers: formData.allow_multiple_answers,
          thank_you_message: formData.thank_you_message,
          show_facebook_share: formData.show_facebook_share,
          show_line_share: formData.show_line_share,
          meta_title: formData.meta_title,
          display_title: formData.display_title || "all_pages",
        });
        let formSections = formData.sections.map((section, sIndex) => ({
          ...section,
          temp_id: section.id,
          questions: section.questions.map((question, qIndex) => ({
            ...question,
            temp_id: question.id,
            options: question.options
              ? question.options.map((option, oIndex) => ({
                  ...option,
                  temp_id: option.id,
                }))
              : [],
            matrix_rows: question.matrix_rows
              ? question.matrix_rows.map((row, rIndex) => ({
                  ...row,
                  temp_id: row.id,
                }))
              : [],
            matrix_columns: question.matrix_columns
              ? question.matrix_columns.map((col, cIndex) => ({
                  ...col,
                  temp_id: col.id,
                }))
              : [],
          })),
        }));
        setSections(formSections);
        setPrimaryColor(formData.primary_color);
        setSecondColor(formData.second_color);
        setFontFamily(formData.font_type);
        setLogo(formData.image_url);
      }
    } catch (error) {
      console.error("Failed to fetch form detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (event) => {
    if (event.target.files?.[0]) setLogo(event.target.files[0]);
  };

  const handleOpenColorPicker = (event, target) => {
    setColorAnchorEl(event.currentTarget);
    setColorPickerTarget(target);
  };

  const handleCloseColorPicker = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (color) => {
    if (colorPickerTarget === "primary") setPrimaryColor(color.hex);
    else setSecondColor(color.hex);
  };

  const handleSave = async () => {
    // Logic to save the form
    console.log("Form saved", {
      ...formDetail,
      sections,
      primaryColor,
      secondColor,
      fontFamily,
      logo,
    });
    const formData = new FormData();
    formData.append("title", formDetail.title);
    formData.append("note", formDetail.note);
    formData.append("description", formDetail.description);
    formData.append("font_type", fontFamily);
    formData.append("primary_color", primaryColor);
    formData.append("second_color", secondColor);
    formData.append("image_url", logo);
    formData.append("sections", JSON.stringify(sections));
    formData.append(
      "allow_multiple_answers",
      formDetail.allow_multiple_answers || false
    );
    formData.append("thank_you_message", formDetail.thank_you_message || "");
    formData.append(
      "show_facebook_share",
      formDetail.show_facebook_share || true
    );
    formData.append("show_line_share", formDetail.show_line_share || true);
    formData.append("meta_title", formDetail.meta_title || "");
    formData.append("meta_description", formDetail.meta_description || "");
    formData.append("display_title", formDetail.display_title || "all_pages");

    if (id === "create") {
      // call create form API
      const response = await useApi.forms.createForm(formData);
      console.log("Create form response:", response);
      if (response.success) {
        // redirect to form list page
        router.push("/admin/forms");
      }
    } else {
      // call update form API
      const response = await useApi.forms.updateForm(id, formData);
      console.log("Update form response:", response);
      if (response.success) {
        // redirect to form list page
        router.push("/admin/forms");
      }
    }
  };

  return loading ? (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography> กำลังโหลดแบบสอบถาม...</Typography>
    </Box>
  ) : (
    <>
      <Box sx={{ display: "flex", gap: 2, backgroundColor: secondColor }}>
        {/* ฟอร์มหลัก */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            transition: "all 0.3s ease",
            marginRight: openThemeMenu ? "300px" : 0,
            mb: 6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">
              {id === "create" ? "สร้างแบบสอบถาม" : "แก้ไขแบบสอบถาม"}
            </Typography>
            <IconButton
              onClick={() => setOpenThemeMenu(!openThemeMenu)}
              sx={{ p: 0 }}
            >
              <ColorLens color={openThemeMenu ? "primary" : "action"} />
            </IconButton>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="หัวข้อแบบสอบถาม"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder="ตัวอย่าง: แบบสอบถามความพึงพอใจ"
              value={formDetail.title}
              onChange={(e) =>
                setFormDetail({ ...formDetail, title: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="คำอธิบายแบบสอบถาม"
              variant="outlined"
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
              placeholder="ตัวอย่าง: แบบสอบถามนี้จัดทำขึ้นเพื่อสำรวจความพึงพอใจของลูกค้าเกี่ยวกับบริการของเรา"
              value={formDetail.description}
              onChange={(e) =>
                setFormDetail({ ...formDetail, description: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="หมายเหตุ"
              variant="outlined"
              multiline
              InputLabelProps={{ shrink: true }}
              placeholder="ตัวอย่าง: กรุณาตอบคำถามทุกข้ออย่างตรงไปตรงมา ข้อมูลของคุณจะถูกเก็บเป็นความลับ"
              value={formDetail.note}
              onChange={(e) =>
                setFormDetail({ ...formDetail, note: e.target.value })
              }
            />

            <Divider />
            <Box sx={{ p: 1 }}>
              <Typography variant="h6">
                <Settings />
                การตั้งค่าแบบสอบถาม
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  pl: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* ส่วนเลือกว่าจะแสดงหัวข้อแบบสอบถามในหน้าตอบแบบสอบถาม */}
                <FormControl>
                  <FormLabel
                    id="group-title-display"
                    sx={{
                      fontSize: 14,
                      color: "text.secondary", // สีปกติ
                      "&.Mui-focused": { color: "text.secondary" },
                    }}
                  >
                    การแสดงชื่อแบบสอบถาม:
                  </FormLabel>
                  <RadioGroup
                    row
                    sx={{ ml: 2 }}
                    aria-labelledby="group-title-display"
                    name="title-display-group"
                    value={formDetail?.display_title || "all_pages"}
                    onChange={(e) =>
                      console.log(e.target.value) ||
                      setFormDetail({
                        ...formDetail,
                        display_title: e.target.value ?? "all_pages",
                      })
                    }
                  >
                    <FormControlLabel
                      value="all_pages"
                      control={<Radio size="small" />}
                      label="ทุกหน้า"
                    />
                    <FormControlLabel
                      value="first_page"
                      control={<Radio size="small" />}
                      label="เฉพาะหน้าแรก"
                    />
                  </RadioGroup>
                </FormControl>

                {/* ตั้งค่า SEO (สำหรับการแชร์ลิ้งค์แบบสอบถาม) */}
                <TextField
                  fullWidth
                  label="ตั้งค่า SEO (สำหรับการแชร์ลิ้งค์แบบสอบถาม)"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder="ตัวอย่าง: Survey Forms 2025"
                  value={formDetail.meta_title || ""}
                  onChange={(e) =>
                    setFormDetail({ ...formDetail, meta_title: e.target.value })
                  }
                />

                {/* เลือกว่า สามารถตอบซ้ำได้หรือไม่ */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formDetail.allow_multiple_answers || false}
                      onChange={(e) =>
                        setFormDetail({
                          ...formDetail,
                          allow_multiple_answers: e.target.checked,
                        })
                      }
                    />
                  }
                  label="อนุญาตให้ตอบซ้ำ"
                />

                {/* ข้อความหลังส่งแบบฟอร์มเสร็จ */}
                <TextField
                  fullWidth
                  label="กำหนดข้อความหลังส่งแบบสอบถามเสร็จสิ้น"
                  variant="outlined"
                  multiline
                  rows={2}
                  InputLabelProps={{ shrink: true }}
                  placeholder="ตัวอย่าง: ขอบคุณที่สละเวลาในการตอบแบบสอบถามของเรา"
                  value={formDetail?.thank_you_message || ""}
                  onChange={(e) =>
                    setFormDetail({
                      ...formDetail,
                      thank_you_message: e.target.value,
                    })
                  }
                />

                {/* ตัวเลือกว่าจะแสดง icon แชร์แบบไหนได้บ้าง facebook line */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography>แสดงปุ่มแชร์แบบสอบถาม:</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formDetail?.show_facebook_share || true}
                        onChange={(e) =>
                          setFormDetail({
                            ...formDetail,
                            show_facebook_share: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Facebook"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formDetail?.show_line_share || true}
                        onChange={(e) =>
                          setFormDetail({
                            ...formDetail,
                            show_line_share: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Line"
                  />
                </Box>
              </Box>
            </Box>
            {/* Form goes here */}
          </Box>

          {/* create section and question here */}

          <SectionList sections={sections} setSections={setSections} />
        </Box>

        {/* Theme Panel */}
        {openThemeMenu && (
          <Box
            sx={{
              width: 300,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fff",
              borderLeft: "1px solid #e0e0e0",
              position: "fixed",
              right: 0,
              top: 64,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h6">ธีม</Typography>
              <IconButton onClick={() => setOpenThemeMenu(false)} sx={{ p: 0 }}>
                <Close />
              </IconButton>
            </Box>
            <Divider />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                mt: 2,
              }}
            >
              <TextField
                type="file"
                label="โลโก้"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={handleLogoChange}
              />

              <Autocomplete
                options={fontTypeOptions}
                getOptionLabel={(option) => option.label}
                value={
                  fontTypeOptions.find((f) => f.value === fontFamily) || null
                }
                onChange={(event, newValue) =>
                  setFontFamily(newValue ? newValue.value : "")
                }
                renderInput={(params) => (
                  <TextField {...params} label="ฟอนต์" />
                )}
                fullWidth
              />

              <Typography variant="caption" color="textSecondary">
                เลือกสีหลัก/หัวข้อ
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {colorPaletteDefault.map((color) => (
                  <Box
                    key={color}
                    onClick={(e) => setPrimaryColor(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        primaryColor === color
                          ? "2px solid black"
                          : "2px solid transparent",
                    }}
                  />
                ))}
                {/* ปุ่ม + */}
                <Box
                  onClick={(e) => handleOpenColorPicker(e, "primary")}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: primaryColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px solid transparent",
                  }}
                >
                  <Add />
                </Box>
              </Box>

              <Typography variant="caption" color="textSecondary">
                เลือกสีพื้นหลัง
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {colorPaletteDefault.map((color) => (
                  <Box
                    key={color}
                    onClick={(e) => setSecondColor(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        secondColor === color
                          ? "2px solid black"
                          : "2px solid transparent",
                    }}
                  />
                ))}
                {/* ปุ่ม + */}
                <Box
                  onClick={(e) => handleOpenColorPicker(e, "second")}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: secondColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px solid transparent",
                  }}
                >
                  <Add />
                </Box>
              </Box>
            </Box>

            {/* Popover สำหรับเลือกสี */}
            <Popover
              open={colorPickerOpen}
              anchorEl={colorAnchorEl}
              onClose={handleCloseColorPicker}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <SketchPicker
                color={
                  colorPickerTarget === "primary" ? primaryColor : secondColor
                }
                onChange={handleChangeColor}
              />
            </Popover>
          </Box>
        )}
      </Box>

      {/* save button form */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: openThemeMenu ? 316 : 16,
          transition: "right 0.3s ease",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "grey.700",
              boxShadow: "none",
              "&:hover": { backgroundColor: "grey.100", boxShadow: "none" },
              borderRadius: 3,
              fontSize: 14,
              textTransform: "none",
              border: "1px solid",
              width: 100,
            }}
            onClick={() => router.push("/admin/forms")}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            color="success"
            sx={{
              textTransform: "none",
              borderRadius: 3,
              boxShadow: "none",
              color: "#fff",
              fontSize: 14,
              "&:hover": {
                boxShadow: "none",
              },
              width: 100,
            }}
          >
            บันทึก
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FormCreatePage;
