import { Question, QuestionType } from '../types';
import { FACTS } from '../data/facts';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  typeCounts: Record<QuestionType, number>;
  tierCounts: { easy: number; moderate: number; difficult: number };
}

export function validateBank(questions: Question[], moduleId: string): ValidationResult {
  const errors: string[] = [];
  const typeCounts: Record<QuestionType, number> = {
    mcq: 0,
    truefalse: 0,
    multiselect: 0,
    match: 0,
    sort: 0,
    order: 0,
    odd: 0,
    tap: 0,
  };
  const tierCounts = { easy: 0, moderate: 0, difficult: 0 };
  const promptSet = new Set<string>();
  const idSet = new Set<string>();

  // Tier types tracker
  const tierTypes: Record<string, Set<QuestionType>> = {
    easy: new Set(),
    moderate: new Set(),
    difficult: new Set(),
  };

  // Rule 1: Exactly 40 questions
  if (questions.length !== 40) {
    errors.push(`Module ${moduleId}: expected 40 questions, got ${questions.length}`);
  }

  // Check 10 easy, 20 moderate, 10 difficult order
  questions.forEach((q, idx) => {
    // Unique ID
    if (idSet.has(q.id)) {
      errors.push(`Duplicate ID: ${q.id} at index ${idx}`);
    }
    idSet.add(q.id);

    // Module ID matches
    if (q.moduleId !== moduleId) {
      errors.push(`Question ${q.id} has wrong moduleId ${q.moduleId}, expected ${moduleId}`);
    }

    // Tier index check
    if (idx < 10) {
      if (q.tier !== 'easy') errors.push(`Question index ${idx} should be tier 'easy', got ${q.tier}`);
      tierCounts.easy++;
      tierTypes.easy.add(q.type);
    } else if (idx < 30) {
      if (q.tier !== 'moderate') errors.push(`Question index ${idx} should be tier 'moderate', got ${q.tier}`);
      tierCounts.moderate++;
      tierTypes.moderate.add(q.type);
    } else {
      if (q.tier !== 'difficult') errors.push(`Question index ${idx} should be tier 'difficult', got ${q.tier}`);
      tierCounts.difficult++;
      tierTypes.difficult.add(q.type);
    }

    // Count types
    if (typeCounts[q.type] !== undefined) {
      typeCounts[q.type]++;
    }

    // Fact reference validity
    if (!q.factRef || !FACTS[q.factRef]) {
      errors.push(`Question ${q.id} has invalid or missing factRef: ${q.factRef}`);
    }

    // Explanation non-empty
    if (!q.explanation || q.explanation.trim().length === 0) {
      errors.push(`Question ${q.id} missing explanation`);
    }

    // Prompt uniqueness
    const normalizedPrompt = q.prompt.trim().toLowerCase();
    if (promptSet.has(normalizedPrompt)) {
      errors.push(`Question ${q.id} has duplicate prompt: "${q.prompt}"`);
    }
    promptSet.add(normalizedPrompt);

    // Question type structure checks
    switch (q.type) {
      case 'mcq':
      case 'odd': {
        if (!q.options || q.options.length < 3 || q.options.length > 4) {
          errors.push(`Question ${q.id} (${q.type}): must have 3 or 4 options, got ${q.options?.length}`);
        }
        const correctCount = q.options?.filter((o) => o.isCorrect).length || 0;
        if (correctCount !== 1) {
          errors.push(`Question ${q.id} (${q.type}): must have exactly 1 correct option, got ${correctCount}`);
        }
        break;
      }
      case 'truefalse': {
        if (typeof q.answer !== 'boolean') {
          errors.push(`Question ${q.id} (truefalse): missing boolean answer`);
        }
        break;
      }
      case 'multiselect': {
        if (!q.options || q.options.length < 3) {
          errors.push(`Question ${q.id} (multiselect): must have at least 3 options`);
        }
        const correctCount = q.options?.filter((o) => o.isCorrect).length || 0;
        if (correctCount < 1) {
          errors.push(`Question ${q.id} (multiselect): must have at least 1 correct option`);
        }
        break;
      }
      case 'match': {
        if (!q.pairs || q.pairs.length < 2) {
          errors.push(`Question ${q.id} (match): must have at least 2 pairs`);
        }
        break;
      }
      case 'sort': {
        if (!q.groups || q.groups.length < 2) {
          errors.push(`Question ${q.id} (sort): must have at least 2 groups`);
        }
        const totalItems = q.groups?.reduce((acc, g) => acc + g.items.length, 0) || 0;
        if (totalItems < 3) {
          errors.push(`Question ${q.id} (sort): must have at least 3 items to sort`);
        }
        break;
      }
      case 'order': {
        if (!q.order || q.order.length < 3) {
          errors.push(`Question ${q.id} (order): must have at least 3 items to order`);
        }
        break;
      }
      case 'tap': {
        if (!q.tokens || q.tokens.length < 2) {
          errors.push(`Question ${q.id} (tap): must have tokens to tap`);
        }
        if (!q.answerTokenIds || q.answerTokenIds.length < 1) {
          errors.push(`Question ${q.id} (tap): must have answerTokenIds`);
        }
        break;
      }
    }

    // Check consecutive type rule: Never more than 2 of same type in a row
    if (idx >= 2) {
      if (questions[idx].type === questions[idx - 1].type && questions[idx].type === questions[idx - 2].type) {
        errors.push(`Question ${q.id} (idx ${idx}): 3 consecutive questions of type ${q.type}`);
      }
    }
  });

  // Check variety rules:
  // At least 7 different question types per module
  const distinctTypes = Object.entries(typeCounts).filter(([, count]) => count > 0).length;
  if (distinctTypes < 7) {
    errors.push(`Module ${moduleId}: requires at least 7 distinct question types, found ${distinctTypes}`);
  }

  // MCQ at most 10
  if (typeCounts.mcq > 10) {
    errors.push(`Module ${moduleId}: MCQ count is ${typeCounts.mcq}, max allowed is 10`);
  }

  // Every other used type appears 3 to 6 times (if distinctTypes >= 7, all active types should be 3-6 except mcq which is up to 10)
  for (const [t, count] of Object.entries(typeCounts)) {
    if (t !== 'mcq' && count > 0) {
      if (count < 3 || count > 6) {
        errors.push(`Module ${moduleId}: type ${t} count is ${count}, expected 3 to 6`);
      }
    }
  }

  // Inside each tier use at least 4 different types
  if (tierTypes.easy.size < 4) {
    errors.push(`Module ${moduleId}: easy tier has only ${tierTypes.easy.size} types, requires at least 4`);
  }
  if (tierTypes.moderate.size < 4) {
    errors.push(`Module ${moduleId}: moderate tier has only ${tierTypes.moderate.size} types, requires at least 4`);
  }
  if (tierTypes.difficult.size < 4) {
    errors.push(`Module ${moduleId}: difficult tier has only ${tierTypes.difficult.size} types, requires at least 4`);
  }

  return {
    valid: errors.length === 0,
    errors,
    typeCounts,
    tierCounts,
  };
}
