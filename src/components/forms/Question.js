"use client";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  Add,
  AddCircle,
  Apps,
  CheckBox,
  Circle,
  Close,
  ColorLens,
  ContentCopy,
  Delete,
  DragHandle,
  DragIndicator,
  Event,
  ExpandCircleDown,
  ExpandLess,
  ExpandMore,
  FileUpload,
  LinearScale,
  Notes,
  Schedule,
  ShortText,
  StarHalf,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import OptionsList from "./Options";
import RatingQuestion from "./RatingQuestion";
import { questionTypes } from "../../contants/questionTypes";
import { getRandomId } from "../../helpers/random";
import LinearScaleQuestion from "./LinearScaleQuestion";
import BarScaleQuestion from "./BarScaleQuestion";
import { defaultScaleLabels } from "../../contants/scaleBarLabel";
import MatrixQuestion from "./MatrixQuestion";
import { Switch } from "@mui/material";
import { Shuffle } from "@mui/icons-material";

const externalSources = [
  { id: 1, label: "จังหวัด" },
  { id: 2, label: "อำเภอ" },
  { id: 3, label: "ตำบล" },
];

function QuestionItem({
  sections,
  questions,
  question,
  onChange,
  onDelete,
  onAdd,
  onMove,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.temp_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddOption = () => {
    // ถ้าเพิ่ม option ใหม่ ให้เพิ่ม option_no ตามจำนวน option ปัจจุบัน แต่ถ้ามี option อื่นๆ (โปรดระบุ) อยู่แล้ว ให้ไม่นับรวม ให้แทรกหน้า option อื่นๆ (โปรดระบุ)
    const hasOtherOption = question.options?.some((option) => option.is_other);
    const newOption = {
      temp_id: `option-${getRandomId()}`,
      option: "",
      option_no: question.options
        ? hasOtherOption
          ? question.options.length
          : question.options.length + 1
        : 1,
      is_other: false,
    };
    let newOptions = question.options ? [...question.options] : [];
    if (hasOtherOption) {
      const otherOptionIndex = newOptions.findIndex(
        (option) => option.is_other
      );
      newOptions.splice(otherOptionIndex, 0, newOption);
    } else {
      newOptions.push(newOption);
    }
    onChange({ ...question, options: newOptions });
  };

  const handleOptionOther = () => {
    const newOption = {
      temp_id: `option-${getRandomId()}`,
      option: "อื่นๆ (โปรดระบุ)",
      option_no: question.options ? question.options.length + 1 : 1,
      is_other: true,
    };
    const newOptions = question.options
      ? [...question.options, newOption]
      : [newOption];
    onChange({ ...question, options: newOptions });
  };

  const handleDuplicateQuestion = () => {
    const optionsCopy = question.options?.map((opt) => {
      const { id, ...optRest } = opt;
      return {
        ...optRest,
        id: undefined,
        temp_id: `option-${getRandomId()}`,
      };
    });

    const matrixRowsCopy = question.matrix_rows?.map((row) => {
      const { id, ...rowRest } = row;
      return { ...rowRest, id: undefined };
    });

    const matrixColumnsCopy = question.matrix_columns?.map((col) => {
      const { id, ...colRest } = col;
      return { ...colRest, id: undefined };
    });

    // scape_labels ก็ต้องทำเหมือนกันถ้ามี
    if (question?.scale_labels && question.scale_labels.length > 0) {
      question.scale_labels = question.scale_labels.map((label) => {
        const { id, ...labelRest } = label;
        return { ...labelRest, id: undefined };
      });
    }

    const { id, ...rest } = question;

    const duplicatedQuestion = {
      ...rest,
      id: undefined,
      temp_id: `question-${getRandomId()}`,
      options: optionsCopy || rest.options || [],
      ...(matrixRowsCopy ? { matrix_rows: matrixRowsCopy } : {}),
      ...(matrixColumnsCopy ? { matrix_columns: matrixColumnsCopy } : {}),
      ...(question?.scale_labels
        ? { scale_labels: question.scale_labels }
        : {}),
    };

    onAdd(question.temp_id, duplicatedQuestion);
  };

  const handleMoveQuestionUp = () => {
    const index = questions.findIndex((q) => q.temp_id === question.temp_id);
    if (index > 0) {
      const newQuestions = arrayMove(questions, index, index - 1).map(
        (q, i) => ({ ...q, question_no: i + 1 })
      );
      onMove(newQuestions); // 🔹 เรียก onMove แทน onChange
    }
  };

  const handleMoveQuestionDown = () => {
    const index = questions.findIndex((q) => q.temp_id === question.temp_id);
    if (index < questions.length - 1) {
      const newQuestions = arrayMove(questions, index, index + 1).map(
        (q, i) => ({ ...q, question_no: i + 1 })
      );
      onMove(newQuestions); // 🔹 เรียก onMove แทน onChange
    }
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ display: "flex", flexDirection: "row", gap: 1 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <IconButton
          {...listeners}
          {...attributes}
          aria-describedby="drag-handle-question"
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            "&:hover": { color: "primary.main", backgroundColor: "white" },
            cursor: "grab",
          }}
        >
          <DragIndicator />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Chip
          label={`คำถามที่ ${question.question_no}`}
          size="small"
          color="primary"
          sx={{ width: "fit-content" }}
        />
        <TextField
          fullWidth
          label={`คำถาม`}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          placeholder="พิมพ์คำถามที่นี่"
          value={question.question || ""}
          sx={{
            "& .MuiInputBase-root": { height: "40px" },
          }}
          onChange={(e) => onChange({ ...question, question: e.target.value })}
        />
        <Autocomplete
          options={questionTypes}
          getOptionLabel={(option) => option.label}
          value={
            questionTypes.find(
              (type) => type.id === question.question_type_id
            ) || null
          }
          onChange={(e, newValue) => {
            if (!newValue) return;
            let formateddValue = question;
            // ถ้าเปลี่ยนจากประเภทตัวเลือก ให้ลบ options ทิ้ง
            if (
              question.question_type_id === 3 ||
              question.question_type_id === 4 ||
              question.question_type_id === 5
            ) {
              if (
                !(newValue.id === 3 || newValue.id === 4 || newValue.id === 5)
              ) {
                formateddValue = {
                  ...question,
                  question_type_id: newValue.id,
                  options: [],
                  dropdown_source_type: newValue.id === 5 ? "internal" : null,
                  external_source_id: null,
                  rating_type_id: newValue.id === 6 ? 1 : null,
                  max_scale:
                    newValue.id === 6 ? 5 : newValue.id === 7 ? 5 : null,
                  min_scale: newValue.id === 7 ? 1 : null,
                  scale_labels: newValue.id === 8 ? defaultScaleLabels : [],
                };
              } else {
                formateddValue = { ...question, question_type_id: newValue.id };
              }
            } else {
              if (newValue.id === 3 || newValue.id === 4 || newValue.id === 5) {
                formateddValue = {
                  ...question,
                  question_type_id: newValue.id,
                  options: [
                    {
                      temp_id: `option-${getRandomId()}`,
                      option: "",
                      option_no: 1,
                      is_other: false,
                    },
                  ],
                  dropdown_source_type: newValue.id === 5 ? "internal" : null,
                  external_source_id: null,
                  rating_type_id: null,
                  max_scale: null,
                  min_scale: null,
                  scale_labels: [],
                };
              } else {
                formateddValue = {
                  ...question,
                  question_type_id: newValue.id,
                  dropdown_source_type: newValue.id === 5 ? "internal" : null,
                  external_source_id: null,
                  rating_type_id: newValue.id === 6 ? 1 : null,
                  max_scale:
                    newValue.id === 6 ? 5 : newValue.id === 7 ? 5 : null,
                  min_scale: newValue.id === 7 ? 1 : null,
                  scale_labels: newValue.id === 8 ? defaultScaleLabels : [],
                };
              }
            }
            onChange(formateddValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="ประเภทคำถาม" />
          )}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <Box
                key={key}
                component="li"
                {...rest}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {option.icon} {option.label}
              </Box>
            );
          }}
          sx={{
            "& .MuiInputBase-root": { height: "40px" },
          }}
        />
        {question.question_type_id === 3 ||
        question.question_type_id === 4 ||
        question.question_type_id === 5 ? (
          <>
            {question.question_type_id === 5 && (
              <FormControl>
                <RadioGroup
                  row
                  name="radio-buttons-group"
                  aria-labelledby="dropdown_source_type"
                  value={question?.dropdown_source_type || "internal"}
                  onChange={(e) => {
                    onChange({
                      ...question,
                      dropdown_source_type: e.target.value,
                      options:
                        e.target.value === "internal"
                          ? question.options && question.options.length > 0
                            ? question.options
                            : [
                                {
                                  temp_id: `option-${getRandomId()}`,
                                  option: "",
                                  option_no: 1,
                                  is_other: false,
                                },
                              ]
                          : [],
                    });
                  }}
                  sx={{
                    fontSize: 14,
                    color: "text.secondary",
                    "& .MuiSvgIcon-root": { fontSize: 16 },
                    "& .MuiFormControlLabel-root": { mr: 3 },
                  }}
                >
                  <FormControlLabel
                    value="internal"
                    control={<Radio />}
                    label="สร้างตัวเลือกเอง (Customize)"
                  />
                  <FormControlLabel
                    value="external"
                    control={<Radio />}
                    label="ดึงข้อมูลอัตโนมัติ (Autocomplete)"
                  />
                </RadioGroup>
              </FormControl>
            )}
            {question.question_type_id === 5 &&
            question?.dropdown_source_type === "external" ? (
              <>
                <Autocomplete
                  options={externalSources}
                  getOptionLabel={(option) => option.label}
                  value={
                    externalSources.find(
                      (source) => source.id === question.external_source_id
                    ) || null
                  }
                  onChange={(e, newValue) => {
                    onChange({ ...question, external_source_id: newValue?.id });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="แหล่งข้อมูลตัวเลือก (Dropdown Source)"
                      placeholder="กรุณาเลือกแหล่งข้อมูล เช่น จังหวัด"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  sx={{ "& .MuiInputBase-root": { height: "40px" } }}
                />
              </>
            ) : (
              <>
                <OptionsList
                  options={question.options || []}
                  setOptions={(newOptions) =>
                    onChange({ ...question, options: newOptions })
                  }
                  question={question}
                  questions={questions}
                  sections={sections}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    ml: 4,
                  }}
                >
                  <Button
                    sx={{
                      textTransform: "none",
                      fontWeight: "normal",
                      color: "primary.main",
                      border: "none",

                      "&:hover": {
                        border: "none",
                        color: "primary.dark",
                      },
                    }}
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddOption}
                  >
                    เพิ่มตัวเลือก
                  </Button>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ ml: 2 }}
                  >
                    หรือ
                  </Typography>
                  <Button
                    sx={{
                      textTransform: "none",
                      fontWeight: "normal",
                      color: "primary.main",
                      border: "none",
                      "&:hover": {
                        border: "none",
                        color: "primary.dark",
                      },
                      "&:disabled": {
                        color: "text.disabled",
                        border: "none",
                      },
                    }}
                    variant="outlined"
                    onClick={handleOptionOther}
                    disabled={question.options?.some(
                      (option) =>
                        option.option === "อื่นๆ (โปรดระบุ)" || option.is_other
                    )}
                  >
                    เพิ่มตัวเลือกอื่นๆ
                  </Button>
                </Box>

                {[3, 4].includes(Number(question.question_type_id)) && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 2,
                      ml: 4,
                      px: 2,
                      py: 1,
                      bgcolor: question.is_shuffle_options
                        ? "#EFF6FF"
                        : "#F8FAFC",
                      border: "1px solid",
                      borderColor: question.is_shuffle_options
                        ? "#93C5FD"
                        : "#E2E8F0",
                      borderRadius: 2,
                      width: "fit-content",
                      maxWidth: "calc(100% - 32px)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Shuffle
                      sx={{
                        fontSize: 18,
                        color: question.is_shuffle_options
                          ? "primary.main"
                          : "text.secondary",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          color: question.is_shuffle_options
                            ? "primary.main"
                            : "text.primary",
                        }}
                      >
                        สลับลำดับตัวเลือก
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        สุ่มลำดับตัวเลือกสำหรับผู้ตอบแต่ละคน
                      </Typography>
                    </Box>

                    <Switch
                      size="small"
                      checked={Boolean(question.is_shuffle_options)}
                      onChange={(e) =>
                        onChange({
                          ...question,
                          is_shuffle_options: e.target.checked,
                        })
                      }
                      inputProps={{
                        "aria-label": "สลับลำดับตัวเลือก",
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        ) : question.question_type_id === 6 ? (
          <RatingQuestion
            question={question}
            onChange={(newValue) => onChange({ ...question, ...newValue })}
          />
        ) : question.question_type_id === 7 ? (
          <LinearScaleQuestion
            question={question}
            onChange={(newValue) => onChange({ ...question, ...newValue })}
          />
        ) : question.question_type_id === 8 ? (
          <BarScaleQuestion
            question={question}
            onChange={(newValue) => onChange({ ...question, ...newValue })}
          />
        ) : question.question_type_id === 9 ? (
          <MatrixQuestion
            question={question}
            onChange={(newValue) => onChange({ ...question, ...newValue })}
          />
        ) : null}

        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={question.is_required || false}
                  onChange={(e) =>
                    onChange({ ...question, is_required: e.target.checked })
                  }
                />
              }
              label="บังคับตอบคำถามนี้"
              sx={{
                userSelect: "none",
                "& .MuiTypography-root": { fontSize: 14 },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="เพิ่มคำถามถัดไป">
              <IconButton
                aria-label="add-question-back"
                color="primary"
                sx={{ p: 0 }}
                onClick={() => onAdd(question.temp_id)}
              >
                <AddCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="คัดลอกคำถาม">
              <IconButton
                aria-label="duplicate-question"
                color="default"
                sx={{ p: 0 }}
                onClick={handleDuplicateQuestion}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title="ลบคำถามนี้">
              <IconButton
                aria-label="delete-question"
                color="error"
                sx={{ p: 0 }}
                onClick={() => onDelete(question.temp_id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                borderLeft: 1,
                borderColor: "divider",
                height: 24,
                ml: 2,
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="เลื่อนขึ้น">
                <IconButton
                  disabled={question.question_no === 1}
                  aria-label="collapse-question"
                  onClick={handleMoveQuestionUp}
                  sx={{ p: 0 }}
                >
                  <ExpandLess />
                </IconButton>
              </Tooltip>
              <Tooltip title="เลื่อนลง">
                <IconButton
                  aria-label="expand-question"
                  sx={{ p: 0 }}
                  onClick={handleMoveQuestionDown}
                >
                  <ExpandMore />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const QuestionDragAndDrop = ({ questions, onChange, sections }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.temp_id === active.id);
      const newIndex = questions.findIndex((q) => q.temp_id === over.id);
      // question_no ต้องเรียงใหม่ด้วย
      const updatedQuestions = arrayMove(questions, oldIndex, newIndex).map(
        (q, i) => ({ ...q, question_no: i + 1 })
      );
      onChange(updatedQuestions);
    }
  };

  const handleQuestionChange = (updatedQuestion) => {
    onChange(
      questions.map((q) =>
        q.temp_id === updatedQuestion.temp_id ? updatedQuestion : q
      )
    );
  };

  const handleQuestionDelete = (question_id) => {
    onChange(questions.filter((q) => q.temp_id !== question_id));
    // ถ้ามีการลบคำถามแล้วให้รีเซ็ตค่า question_no ใหม่ทั้งหมดให้เรียงต่อกัน
    const formatedQuestions = questions
      .filter((q) => q.temp_id !== question_id)
      .map((q, i) => ({ ...q, question_no: i + 1 }));
    onChange(formatedQuestions);
  };

  const handleAddQuestion = (question_id, duplicatedQuestion) => {
    const index = questions.findIndex((q) => q.temp_id === question_id);

    const newQuestion = duplicatedQuestion || {
      temp_id: `question-${Date.now()}`,
      question_no: index + 2,
      question: "",
      question_type_id: 1,
      is_required: true,
      options: [],
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    // ปรับ question_no ใหม่ทั้งหมดให้เรียงต่อกัน
    const formatedQuestions = newQuestions.map((q, i) => ({
      ...q,
      question_no: i + 1,
    }));
    onChange(formatedQuestions);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q.temp_id)}
        strategy={verticalListSortingStrategy}
      >
        {questions.map((question) => (
          <QuestionItem
            key={question.temp_id}
            sections={sections}
            questions={questions}
            question={question}
            onChange={handleQuestionChange}
            onDelete={handleQuestionDelete}
            onAdd={handleAddQuestion}
            onMove={(newQuestions) => onChange(newQuestions)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default QuestionDragAndDrop;
