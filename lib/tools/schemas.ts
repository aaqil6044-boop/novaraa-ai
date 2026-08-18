import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Shared micro-schemas (reused where the *concept* is genuinely the   */
/* same, e.g. "a severity-tagged issue" — never the whole tool shape). */
/* ------------------------------------------------------------------ */

const severity = z.enum(["low", "medium", "high", "critical"]);

const issue = z.object({
  title: z.string().describe("Short name of the issue"),
  detail: z.string().describe("1-3 sentence explanation"),
  severity,
  location: z.string().optional().describe("Line number, section, or location reference if applicable"),
  fix: z.string().optional().describe("Concrete suggested fix"),
});

/* ------------------------------------------------------------------ */
/* 1. Resume Reviewer — holistic, recruiter-facing review              */
/* ------------------------------------------------------------------ */
export const resumeReviewerSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  recruiterImpression: z.string().describe("What a recruiter would think in the first 6 seconds"),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  missingKeywords: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  grammarIssues: z.array(z.string()),
  experienceAnalysis: z.string(),
  educationReview: z.string(),
  skillsReview: z.string(),
  improvementSuggestions: z.array(z.string()).min(1),
  finalVerdict: z.string().describe("One decisive closing paragraph"),
});
export type ResumeReviewerResult = z.infer<typeof resumeReviewerSchema>;

/* ------------------------------------------------------------------ */
/* 2. ATS Resume Checker — ATS-parsing mechanics ONLY, no career advice */
/* ------------------------------------------------------------------ */
export const atsCheckerSchema = z.object({
  atsCompatibilityScore: z.number().min(0).max(100),
  keywordDensity: z.array(
    z.object({ keyword: z.string(), occurrences: z.number().int().min(0), idealMin: z.number().int().min(0) })
  ),
  missingKeywords: z.array(z.string()),
  sectionAnalysis: z.array(
    z.object({ section: z.string(), present: z.boolean(), note: z.string() })
  ),
  parsingProblems: z.array(z.string()).describe("Things that would literally break an ATS parser"),
  fileCompatibilityNotes: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  improvementTips: z.array(z.string()).min(1),
});
export type AtsCheckerResult = z.infer<typeof atsCheckerSchema>;

/* ------------------------------------------------------------------ */
/* 3. PDF / Document Summarizer                                        */
/* ------------------------------------------------------------------ */
export const pdfSummarizerSchema = z.object({
  executiveSummary: z.string(),
  detailedSummary: z.string(),
  keyInsights: z.array(z.string()).min(1),
  importantNumbers: z.array(z.object({ label: z.string(), value: z.string(), context: z.string().optional() })),
  actionItems: z.array(z.string()),
  questionsAnswered: z.array(z.object({ question: z.string(), answer: z.string() })),
  timeline: z.array(z.object({ when: z.string(), what: z.string() })).describe("Empty array if the document has no chronological events"),
  finalTakeaways: z.array(z.string()).min(1),
});
export type PdfSummarizerResult = z.infer<typeof pdfSummarizerSchema>;

/* ------------------------------------------------------------------ */
/* 4. Code Reviewer — quality/security/performance, holistic            */
/* ------------------------------------------------------------------ */
export const codeReviewerSchema = z.object({
  codeQualityScore: z.number().min(0).max(100),
  language: z.string().describe("Detected programming language"),
  securityIssues: z.array(issue),
  performanceIssues: z.array(issue),
  bugs: z.array(issue),
  codeSmells: z.array(issue),
  bestPractices: z.array(z.string()).describe("Good practices already followed, or ones to adopt"),
  suggestedImprovements: z.array(z.string()).min(1),
  refactoredCode: z.string().describe("The full improved code. Empty string only if no changes are warranted."),
});
export type CodeReviewerResult = z.infer<typeof codeReviewerSchema>;

/* ------------------------------------------------------------------ */
/* 5. Bug Finder — defects ONLY, never style/quality opinions           */
/* ------------------------------------------------------------------ */
export const bugFinderSchema = z.object({
  totalIssuesFound: z.number().int().min(0),
  runtimeErrors: z.array(issue),
  logicalErrors: z.array(issue),
  edgeCases: z.array(issue),
  potentialCrashes: z.array(issue),
  memoryIssues: z.array(issue),
  fixSuggestions: z.array(z.object({ issue: z.string(), fix: z.string(), codeSnippet: z.string().optional() })),
});
export type BugFinderResult = z.infer<typeof bugFinderSchema>;

/* ------------------------------------------------------------------ */
/* 6. Code Explainer — pedagogy, step-by-step, purpose                  */
/* ------------------------------------------------------------------ */
export const codeExplainerSchema = z.object({
  language: z.string(),
  overallPurpose: z.string(),
  steps: z.array(z.object({ title: z.string(), explanation: z.string(), codeExcerpt: z.string().optional() })).min(1),
  keyConcepts: z.array(z.object({ concept: z.string(), whyItMatters: z.string() })),
  potentialGotchas: z.array(z.string()),
});
export type CodeExplainerResult = z.infer<typeof codeExplainerSchema>;

/* ------------------------------------------------------------------ */
/* 7. SQL Generator                                                     */
/* ------------------------------------------------------------------ */
export const sqlGeneratorSchema = z.object({
  sqlQuery: z.string(),
  dialect: z.string().describe("e.g. PostgreSQL, MySQL, SQLite"),
  explanation: z.string(),
  optimizationTips: z.array(z.string()),
  exampleOutput: z.array(z.record(z.string(), z.string())).describe("A few sample rows illustrating what the query returns, as key-value objects"),
  alternativeQueries: z.array(z.object({ label: z.string(), query: z.string(), tradeoff: z.string() })),
});
export type SqlGeneratorResult = z.infer<typeof sqlGeneratorSchema>;

/* ------------------------------------------------------------------ */
/* 8. Grammar Checker                                                   */
/* ------------------------------------------------------------------ */
export const grammarCheckerSchema = z.object({
  readabilityScore: z.number().min(0).max(100),
  grammarErrors: z.array(z.object({ original: z.string(), corrected: z.string(), explanation: z.string() })),
  spellingErrors: z.array(z.object({ original: z.string(), corrected: z.string() })),
  sentenceImprovements: z.array(z.object({ original: z.string(), improved: z.string(), reason: z.string() })),
  correctedText: z.string(),
  professionalRewrite: z.string(),
});
export type GrammarCheckerResult = z.infer<typeof grammarCheckerSchema>;

/* ------------------------------------------------------------------ */
/* 9. Blog Writer                                                       */
/* ------------------------------------------------------------------ */
export const blogWriterSchema = z.object({
  seoTitle: z.string(),
  metaDescription: z.string().describe("Under 160 characters"),
  outline: z.array(z.string()).min(1),
  fullBlog: z.string().describe("Full post in Markdown, with headings"),
  keywords: z.array(z.string()),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  callToAction: z.string(),
  estimatedReadingMinutes: z.number().min(1),
});
export type BlogWriterResult = z.infer<typeof blogWriterSchema>;

/* ------------------------------------------------------------------ */
/* 10. Email Writer                                                     */
/* ------------------------------------------------------------------ */
export const emailWriterSchema = z.object({
  subjectLines: z.array(z.string()).min(1).describe("2-3 subject line options"),
  tone: z.string(),
  body: z.string(),
  shorterVersion: z.string().describe("A punchier, 3-4 sentence version"),
  followUpSuggestion: z.string(),
});
export type EmailWriterResult = z.infer<typeof emailWriterSchema>;

/* ------------------------------------------------------------------ */
/* 11. Text Translator                                                  */
/* ------------------------------------------------------------------ */
export const translatorSchema = z.object({
  detectedSourceLanguage: z.string(),
  targetLanguage: z.string(),
  translation: z.string(),
  literalTranslation: z.string().describe("A more word-for-word rendering, for language learners"),
  toneNotes: z.array(z.string()).describe("Idioms, tone, or cultural notes worth flagging"),
  alternativePhrasings: z.array(z.string()),
});
export type TranslatorResult = z.infer<typeof translatorSchema>;

/* ------------------------------------------------------------------ */
/* 12. Image Analyzer                                                   */
/* ------------------------------------------------------------------ */
export const imageAnalyzerSchema = z.object({
  sceneDescription: z.string(),
  objects: z.array(z.object({ name: z.string(), confidence: z.number().min(0).max(100) })),
  ocrText: z.string().describe("Any text visible in the image, empty string if none"),
  colors: z.array(z.string()).describe("Dominant colors"),
  summary: z.string(),
  questionsAnswered: z.array(z.object({ question: z.string(), answer: z.string() })).describe("Only populated if the user asked something specific"),
  overallConfidence: z.number().min(0).max(100),
});
export type ImageAnalyzerResult = z.infer<typeof imageAnalyzerSchema>;

/* ------------------------------------------------------------------ */
/* 13. OCR — text extraction ONLY, structure preserved                  */
/* ------------------------------------------------------------------ */
export const ocrSchema = z.object({
  extractedText: z.string().describe("Full text in reading order, Markdown for structure"),
  documentType: z.string().describe("e.g. invoice, handwritten note, receipt, form, book page"),
  language: z.string(),
  uncertainSections: z.array(z.string()).describe("Snippets the model wasn't fully confident about"),
  confidence: z.number().min(0).max(100),
});
export type OcrResult = z.infer<typeof ocrSchema>;

/* ------------------------------------------------------------------ */
/* 14. Study Assistant — broad tutoring                                 */
/* ------------------------------------------------------------------ */
export const studyAssistantSchema = z.object({
  summary: z.string(),
  explanation: z.string().describe("Full tutor-style explanation, as if teaching it for the first time"),
  examples: z.array(z.string()).min(1),
  mnemonics: z.array(z.string()),
  examNotes: z.array(z.string()),
  flashcards: z.array(z.object({ question: z.string(), answer: z.string() })).max(6),
  practiceQuestions: z.array(z.object({ question: z.string(), answer: z.string() })).max(6),
});
export type StudyAssistantResult = z.infer<typeof studyAssistantSchema>;

/* ------------------------------------------------------------------ */
/* 15. Flashcard Generator — ONLY flashcards                            */
/* ------------------------------------------------------------------ */
export const flashcardGeneratorSchema = z.object({
  topic: z.string(),
  flashcards: z
    .array(z.object({ question: z.string(), answer: z.string(), difficulty: z.enum(["easy", "medium", "hard"]) }))
    .min(1),
});
export type FlashcardGeneratorResult = z.infer<typeof flashcardGeneratorSchema>;

/* ------------------------------------------------------------------ */
/* 16. MCQ Generator — ONLY multiple choice questions                   */
/* ------------------------------------------------------------------ */
export const mcqGeneratorSchema = z.object({
  topic: z.string(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctIndex: z.number().int().min(0).max(3),
        difficulty: z.enum(["easy", "medium", "hard"]),
        explanation: z.string(),
      })
    )
    .min(1),
});
export type McqGeneratorResult = z.infer<typeof mcqGeneratorSchema>;

/* ------------------------------------------------------------------ */
/* 17. Notes Generator — condensation into structured study notes       */
/* ------------------------------------------------------------------ */
export const notesGeneratorSchema = z.object({
  title: z.string(),
  sections: z.array(z.object({ heading: z.string(), bullets: z.array(z.string()).min(1) })).min(1),
  keyTerms: z.array(z.object({ term: z.string(), definition: z.string() })),
  summary: z.string(),
});
export type NotesGeneratorResult = z.infer<typeof notesGeneratorSchema>;
