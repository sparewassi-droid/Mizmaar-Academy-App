import { ALL_QUESTIONS_MAP } from '../src/data/modules';
import { validateBank } from '../src/utils/validateBank';

let allPassed = true;
const summary: any[] = [];

for (const [moduleId, questions] of Object.entries(ALL_QUESTIONS_MAP)) {
  const result = validateBank(questions, moduleId);
  if (!result.valid) {
    allPassed = false;
    console.error(`FAILED: ${moduleId}`);
    console.error(result.errors);
  } else {
    summary.push({
      Module: moduleId,
      Easy: result.tierCounts.easy,
      Mod: result.tierCounts.moderate,
      Diff: result.tierCounts.difficult,
      Total: questions.length,
      MCQ: result.typeCounts.mcq,
      TF: result.typeCounts.truefalse,
      Multi: result.typeCounts.multiselect,
      Match: result.typeCounts.match,
      Sort: result.typeCounts.sort,
      Order: result.typeCounts.order,
      Odd: result.typeCounts.odd,
      Tap: result.typeCounts.tap,
    });
  }
}

if (allPassed) {
  console.log('\n================ ALL 11 MODULES (440 QUESTIONS) VALIDATION PASSED! ================');
  console.table(summary);
} else {
  console.error('\nValidation failed for one or more modules.');
  process.exit(1);
}
