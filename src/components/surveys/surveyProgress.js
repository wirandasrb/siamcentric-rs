/**
 * Read-only progress calculator for survey questionnaires.
 * Uses the actual navigation path rather than reimplementing skip_section navigation.
 * Respects skip_question / require_question visibility rules.
 */
export function calculateSurveyProgress(sections = [], answers = [], navigationPath = [0]) {
  const skippedSections = new Set();
  for (let i = 1; i < navigationPath.length; i += 1) {
    const from = navigationPath[i - 1];
    const to = navigationPath[i];
    if (to > from + 1) {
      for (let step = from + 1; step < to; step += 1) {
        skippedSections.add(step);
      }
    }
  }

  const allQuestions = sections.flatMap((section) => section.questions || []);
  const questionById = new Map(allQuestions.map((q) => [String(q.id), q]));
  const skippedQuestionIds = new Set(
    sections.flatMap((section, index) =>
      skippedSections.has(index) ? (section.questions || []).map((q) => String(q.id)) : []
    )
  );

  const rulesByTarget = new Map();
  for (const question of allQuestions) {
    for (const option of question.options || []) {
      for (const condition of option.conditions || []) {
        if (!['skip_question', 'require_question'].includes(condition.condition_type)) continue;
        if (condition.target_question_id == null) continue;
        const targetId = String(condition.target_question_id);
        const existing = rulesByTarget.get(targetId) || [];
        existing.push({
          type: condition.condition_type,
          sourceId: String(question.id),
          optionId: String(condition.required_option_id || option.id),
        });
        rulesByTarget.set(targetId, existing);
      }
    }
  }

  const selectedByQuestion = new Map();
  for (const answer of answers) {
    if (answer.question_id == null) continue;
    const id = String(answer.question_id);
    const values = Array.isArray(answer.answer_option_id)
      ? answer.answer_option_id
      : answer.answer_option_id != null ? [answer.answer_option_id] : [];
    if (!selectedByQuestion.has(id)) selectedByQuestion.set(id, new Set());
    for (const value of values) {
      if (value != null) selectedByQuestion.get(id).add(String(value));
    }
  }

  function isVisible(id, parents = new Set()) {
    id = String(id);
    if (skippedQuestionIds.has(id) || parents.has(id)) return false;
    const question = questionById.get(id);
    if (!question) return false;
    const nextParents = new Set(parents);
    nextParents.add(id);
    const rules = rulesByTarget.get(id) || [];

    for (const rule of rules) {
      if (rule.type !== 'skip_question') continue;
      if (isVisible(rule.sourceId, nextParents) &&
          selectedByQuestion.get(rule.sourceId)?.has(rule.optionId)) {
        return false;
      }
    }

    const required = rules.filter((rule) => rule.type === 'require_question');
    if (!required.length) return true;
    return required.some((rule) =>
      isVisible(rule.sourceId, nextParents) &&
      selectedByQuestion.get(rule.sourceId)?.has(rule.optionId)
    );
  }

  function hasAnswerValue(answer) {
    const selected = answer.answer_option_id;
    return (
      (Array.isArray(selected) ? selected.length > 0 : selected != null && selected !== '') ||
      (answer.answer_value != null && String(answer.answer_value).trim() !== '') ||
      (typeof answer.answer_text === 'string' && answer.answer_text.trim() !== '') ||
      Boolean(answer.attachment_url)
    );
  }

  function isQuestionComplete(question) {
    const questionAnswers = answers.filter(
      (answer) => String(answer.question_id) === String(question.id)
    );
    if (Number(question.question_type_id) === 9 && (question.matrix_rows || []).length) {
      return question.matrix_rows.every((row) =>
        questionAnswers.some((answer) =>
          String(answer.matrix_row_id) === String(row.id) && hasAnswerValue(answer)
        )
      );
    }
    if (!questionAnswers.some(hasAnswerValue)) return false;

    // Selecting an 'Other' option requires the associated custom text.
    const selected = selectedByQuestion.get(String(question.id)) || new Set();
    const otherSelected = (question.options || []).some((option) =>
      option.is_other && selected.has(String(option.id))
    );
    return !otherSelected || questionAnswers.some(
      (answer) => typeof answer.answer_text === 'string' && answer.answer_text.trim() !== ''
    );
  }

  const applicableQuestions = allQuestions.filter((question) => isVisible(question.id));
  const totalQuestions = applicableQuestions.length;
  const answeredQuestions = applicableQuestions.filter(isQuestionComplete).length;
  const progress = totalQuestions > 0
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

  return { totalQuestions, answeredQuestions, progress };
}
