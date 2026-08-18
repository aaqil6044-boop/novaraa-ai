import {
  FileText,
  FileSearch,
  Image as ImageIcon,
  Code2,
  Bug,
  BookOpenCheck,
  Mail,
  Database,
  SpellCheck,
  BookOpen,
  BookOpenText,
  Layers,
  ListChecks,
  NotebookPen,
  ScanText,
  Languages,
  ShieldCheck,
} from "lucide-react";

import type { ToolDefinition } from "./types";
import {
  resumeReviewerSchema,
  atsCheckerSchema,
  pdfSummarizerSchema,
  codeReviewerSchema,
  bugFinderSchema,
  codeExplainerSchema,
  sqlGeneratorSchema,
  grammarCheckerSchema,
  blogWriterSchema,
  emailWriterSchema,
  translatorSchema,
  imageAnalyzerSchema,
  ocrSchema,
  studyAssistantSchema,
  flashcardGeneratorSchema,
  mcqGeneratorSchema,
  notesGeneratorSchema,
} from "./schemas";

const bulleted = (items: string[]) => (items.length ? items.map((i) => `- ${i}`).join("\n") : "_None found._");
const numbered = (items: string[]) => (items.length ? items.map((i, idx) => `${idx + 1}. ${i}`).join("\n") : "_None found._");

/* ==================================================================== */
/* 1. Resume Reviewer                                                    */
/* ==================================================================== */
const resumeReviewer: ToolDefinition<typeof resumeReviewerSchema> = {
  slug: "resume-reviewer",
  label: "Resume Reviewer",
  description: "A full, recruiter-eye review of your resume — strengths, gaps, and a final verdict.",
  category: "Career",
  icon: FileText,
  accent: "signal",
  placeholder: "Paste your resume text, or attach a PDF/DOCX below...",
  acceptsFile: true,
  fileHint: "PDF, DOCX, or plain text resume",
  examples: [
    "Review my resume for a Senior Product Manager role",
    "Is this resume strong enough for a FAANG SWE application?",
  ],
  loadingSteps: ["Reading your resume", "Checking ATS compatibility", "Weighing strengths & gaps", "Writing the verdict"],
  systemPrompt:
    "You are a Head of Talent Acquisition with 15 years of experience reviewing resumes for competitive roles across tech, finance, and consulting. You give holistic, honest, recruiter-level feedback — not generic encouragement. You judge the whole document: content, structure, ATS-readiness, and overall narrative.",
  buildUserPrompt: (input) =>
    `Review this resume in full. Score it 0-100 overall and 0-100 for ATS compatibility, identify concrete strengths and weaknesses, missing keywords, formatting and grammar issues, and assess experience, education, and skills sections separately. Give a candid first-impression reaction a recruiter would have, and close with a decisive final verdict.\n\nResume:\n${input}`,
  schema: resumeReviewerSchema,
  toMarkdown: (d) => `# Resume Review

**Overall Score:** ${d.overallScore}/100  **ATS Score:** ${d.atsScore}/100

## Recruiter's First Impression
${d.recruiterImpression}

## Strengths
${bulleted(d.strengths)}

## Weaknesses
${bulleted(d.weaknesses)}

## Missing Keywords
${bulleted(d.missingKeywords)}

## Formatting Issues
${bulleted(d.formattingIssues)}

## Grammar Issues
${bulleted(d.grammarIssues)}

## Experience Analysis
${d.experienceAnalysis}

## Education Review
${d.educationReview}

## Skills Review
${d.skillsReview}

## Improvement Suggestions
${numbered(d.improvementSuggestions)}

## Final Verdict
${d.finalVerdict}
`,
};

/* ==================================================================== */
/* 2. ATS Resume Checker — ATS parsing mechanics ONLY                    */
/* ==================================================================== */
const atsChecker: ToolDefinition<typeof atsCheckerSchema> = {
  slug: "ats-score",
  label: "ATS Resume Checker",
  description: "Simulates an Applicant Tracking System parse — nothing about career advice, only whether the machine can read it.",
  category: "Career",
  icon: ListChecks,
  accent: "nova",
  placeholder: "Paste your resume and, ideally, the target job description...",
  acceptsFile: true,
  fileHint: "PDF, DOCX, or plain text",
  examples: ["Will this resume pass an ATS for a Data Analyst posting?", "Check keyword density against this job description"],
  loadingSteps: ["Simulating ATS parser", "Scanning for section headers", "Measuring keyword density", "Flagging parsing risks"],
  systemPrompt:
    "You are an Applicant Tracking System (ATS) parsing engine — think Workday or Greenhouse's resume parser, not a human reviewer. You do not give career advice, tone feedback, or opinions about experience quality. You ONLY report on whether the document structure and keywords would parse and match correctly in an automated system.",
  buildUserPrompt: (input) =>
    `Simulate an ATS parse of this resume (and job description, if included). Report ATS compatibility score, keyword density for the most relevant terms (with an ideal minimum occurrence count), missing keywords, whether standard sections (Experience, Education, Skills, Contact) are detected, literal parsing problems (tables, columns, images, headers/footers, non-standard fonts), file/format compatibility notes, and formatting issues. End with concrete ATS improvement tips only — no general resume advice.\n\n${input}`,
  schema: atsCheckerSchema,
  toMarkdown: (d) => `# ATS Compatibility Report

**ATS Compatibility Score:** ${d.atsCompatibilityScore}/100

## Keyword Density
${d.keywordDensity.map((k) => `- **${k.keyword}**: ${k.occurrences} occurrences (ideal min: ${k.idealMin})`).join("\n") || "_None found._"}

## Missing Keywords
${bulleted(d.missingKeywords)}

## Section Analysis
${d.sectionAnalysis.map((s) => `- ${s.present ? "✅" : "❌"} **${s.section}** — ${s.note}`).join("\n")}

## Parsing Problems
${bulleted(d.parsingProblems)}

## File Compatibility Notes
${bulleted(d.fileCompatibilityNotes)}

## Formatting Issues
${bulleted(d.formattingIssues)}

## ATS Improvement Tips
${numbered(d.improvementTips)}
`,
};

/* ==================================================================== */
/* 3. PDF Summarizer                                                     */
/* ==================================================================== */
const pdfSummarizer: ToolDefinition<typeof pdfSummarizerSchema> = {
  slug: "pdf-summarizer",
  label: "PDF Summarizer",
  description: "Turns long documents into an executive summary, key insights, numbers, and a timeline.",
  category: "Documents",
  icon: FileSearch,
  accent: "signal",
  placeholder: "Attach a PDF, or paste text to summarize...",
  acceptsFile: true,
  fileHint: "PDF, DOCX, or TXT",
  examples: ["Summarize this contract and flag the deadlines", "Give me the key numbers from this earnings report"],
  loadingSteps: ["Reading the document", "Extracting key insights", "Pulling out numbers & dates", "Writing the summary"],
  systemPrompt:
    "You are a research analyst who reads dense documents and distills them into decision-ready briefs for busy executives. You never pad the summary with filler — every sentence earns its place.",
  buildUserPrompt: (input) =>
    `Summarize this document. Produce a short executive summary, a longer detailed summary, key insights as distinct bullets, any important numbers/stats/figures with context, action items, direct answers to any implicit or explicit questions the document raises, a chronological timeline if the document has dated events (empty array otherwise), and final takeaways.\n\n${input}`,
  schema: pdfSummarizerSchema,
  toMarkdown: (d) => `# Document Summary

## Executive Summary
${d.executiveSummary}

## Detailed Summary
${d.detailedSummary}

## Key Insights
${bulleted(d.keyInsights)}

## Important Numbers
${d.importantNumbers.map((n) => `- **${n.label}:** ${n.value}${n.context ? ` — ${n.context}` : ""}`).join("\n") || "_None found._"}

## Action Items
${bulleted(d.actionItems)}

## Questions Answered
${d.questionsAnswered.map((q) => `**Q: ${q.question}**\nA: ${q.answer}`).join("\n\n") || "_None._"}

${d.timeline.length ? `## Timeline\n${d.timeline.map((t) => `- **${t.when}** — ${t.what}`).join("\n")}\n` : ""}
## Final Takeaways
${bulleted(d.finalTakeaways)}
`,
};

/* ==================================================================== */
/* 4. Code Reviewer — holistic quality/security/performance              */
/* ==================================================================== */
const codeReviewer: ToolDefinition<typeof codeReviewerSchema> = {
  slug: "code-reviewer",
  label: "Code Reviewer",
  description: "A thorough senior-engineer review: quality, security, performance, and a refactor.",
  category: "Code",
  icon: Code2,
  accent: "nova",
  placeholder: "Paste your code here...",
  acceptsFile: false,
  examples: ["Review this React component for best practices", "Review this Python API endpoint for security issues"],
  loadingSteps: ["Parsing the code", "Checking security & performance", "Spotting code smells", "Drafting a refactor"],
  systemPrompt:
    "You are a staff-level software engineer doing a thorough pull request review. You care about correctness, security, performance, and long-term maintainability equally, and you always propose a concretely improved version of the code, not just complaints.",
  buildUserPrompt: (input) =>
    `Review this code. Give an overall code quality score 0-100, detect the language, and separately list security issues, performance issues, bugs, and code smells (each with severity and a fix where relevant). List best practices already followed or worth adopting, suggested improvements, and a fully refactored version of the code.\n\n\`\`\`\n${input}\n\`\`\``,
  schema: codeReviewerSchema,
  toMarkdown: (d) => `# Code Review — ${d.language}

**Code Quality Score:** ${d.codeQualityScore}/100

## Security Issues
${d.securityIssues.map((i) => `- **[${i.severity}] ${i.title}** — ${i.detail}${i.fix ? ` _Fix: ${i.fix}_` : ""}`).join("\n") || "_None found._"}

## Performance Issues
${d.performanceIssues.map((i) => `- **[${i.severity}] ${i.title}** — ${i.detail}${i.fix ? ` _Fix: ${i.fix}_` : ""}`).join("\n") || "_None found._"}

## Bugs
${d.bugs.map((i) => `- **[${i.severity}] ${i.title}** — ${i.detail}`).join("\n") || "_None found._"}

## Code Smells
${d.codeSmells.map((i) => `- **${i.title}** — ${i.detail}`).join("\n") || "_None found._"}

## Best Practices
${bulleted(d.bestPractices)}

## Suggested Improvements
${numbered(d.suggestedImprovements)}

## Refactored Code
\`\`\`
${d.refactoredCode || "// No changes needed"}
\`\`\`
`,
};

/* ==================================================================== */
/* 5. Bug Finder — defects ONLY                                          */
/* ==================================================================== */
const bugFinder: ToolDefinition<typeof bugFinderSchema> = {
  slug: "bug-finder",
  label: "Bug Finder",
  description: "Hunts only for real defects — runtime errors, logic bugs, crashes, and edge cases. No style opinions.",
  category: "Code",
  icon: Bug,
  accent: "danger",
  placeholder: "Paste code you suspect has a bug...",
  acceptsFile: false,
  examples: ["Find the bug causing this function to return undefined", "What edge cases am I missing here?"],
  loadingSteps: ["Tracing execution paths", "Checking edge cases", "Hunting for crashes", "Compiling fixes"],
  systemPrompt:
    "You are a debugging specialist. Your ONLY job is finding defects that would actually break at runtime: crashes, logic errors, unhandled edge cases, and memory issues. You explicitly ignore code style, naming, and architectural opinions — those are out of scope for this tool.",
  buildUserPrompt: (input) =>
    `Find bugs ONLY — no style or best-practice commentary. Categorize findings into runtime errors, logical errors, unhandled edge cases, potential crashes, and memory issues. For each, note severity and location. Then give a consolidated list of fix suggestions, each with a code snippet where useful.\n\n\`\`\`\n${input}\n\`\`\``,
  schema: bugFinderSchema,
  toMarkdown: (d) => `# Bug Report

**Total Issues Found:** ${d.totalIssuesFound}

## Runtime Errors
${d.runtimeErrors.map((i) => `- **[${i.severity}] ${i.title}**${i.location ? ` (${i.location})` : ""} — ${i.detail}`).join("\n") || "_None found._"}

## Logical Errors
${d.logicalErrors.map((i) => `- **[${i.severity}] ${i.title}**${i.location ? ` (${i.location})` : ""} — ${i.detail}`).join("\n") || "_None found._"}

## Edge Cases
${d.edgeCases.map((i) => `- **[${i.severity}] ${i.title}** — ${i.detail}`).join("\n") || "_None found._"}

## Potential Crashes
${d.potentialCrashes.map((i) => `- **[${i.severity}] ${i.title}** — ${i.detail}`).join("\n") || "_None found._"}

## Memory Issues
${d.memoryIssues.map((i) => `- **[${i.severity}] ${i.title}** — ${i.detail}`).join("\n") || "_None found._"}

## Fix Suggestions
${d.fixSuggestions.map((f) => `**${f.issue}**\n${f.fix}${f.codeSnippet ? `\n\`\`\`\n${f.codeSnippet}\n\`\`\`` : ""}`).join("\n\n") || "_None._"}
`,
};

/* ==================================================================== */
/* 6. Code Explainer                                                     */
/* ==================================================================== */
const codeExplainer: ToolDefinition<typeof codeExplainerSchema> = {
  slug: "code-explainer",
  label: "Code Explainer",
  description: "Step-by-step, plain-language walkthrough of what code does and why.",
  category: "Code",
  icon: BookOpenCheck,
  accent: "success",
  placeholder: "Paste code you want explained...",
  acceptsFile: false,
  examples: ["Explain this recursive function line by line", "What does this regex do?"],
  loadingSteps: ["Reading the code", "Breaking it into steps", "Identifying key concepts"],
  systemPrompt:
    "You are a patient CS teacher explaining code to someone learning to program. You break things into digestible steps and always name the underlying concepts, never just narrate syntax.",
  buildUserPrompt: (input) =>
    `Explain this code for a learner. Detect the language, state the overall purpose in one paragraph, then break the logic into ordered steps (each with a short excerpt if helpful), list key concepts used and why they matter, and flag any potential gotchas or non-obvious behavior.\n\n\`\`\`\n${input}\n\`\`\``,
  schema: codeExplainerSchema,
  toMarkdown: (d) => `# Code Explanation — ${d.language}

## Overall Purpose
${d.overallPurpose}

## Step by Step
${d.steps.map((s, i) => `### ${i + 1}. ${s.title}\n${s.explanation}${s.codeExcerpt ? `\n\`\`\`\n${s.codeExcerpt}\n\`\`\`` : ""}`).join("\n\n")}

## Key Concepts
${d.keyConcepts.map((k) => `- **${k.concept}** — ${k.whyItMatters}`).join("\n")}

## Potential Gotchas
${bulleted(d.potentialGotchas)}
`,
};

/* ==================================================================== */
/* 7. SQL Generator                                                      */
/* ==================================================================== */
const sqlGenerator: ToolDefinition<typeof sqlGeneratorSchema> = {
  slug: "sql-generator",
  label: "SQL Generator",
  description: "Plain English to production-ready SQL, with optimization tips and alternatives.",
  category: "Code",
  icon: Database,
  accent: "nova",
  placeholder: "Describe the query you need, and your table schema if relevant...",
  acceptsFile: false,
  examples: ["Get the top 5 customers by revenue this quarter", "Find users who signed up but never made a purchase"],
  loadingSteps: ["Parsing your request", "Writing the query", "Checking for optimizations"],
  systemPrompt:
    "You are a database engineer who writes precise, efficient SQL and always explains tradeoffs. Default to PostgreSQL syntax unless another dialect is specified or implied.",
  buildUserPrompt: (input) =>
    `Generate a SQL query for this request. State the dialect assumed, explain what the query does, give optimization tips (indexing, query plan considerations), a few example output rows as illustrative data, and 1-2 alternative queries with their tradeoffs (e.g. a window-function version vs a subquery version).\n\nRequest: ${input}`,
  schema: sqlGeneratorSchema,
  toMarkdown: (d) => `# SQL Query — ${d.dialect}

\`\`\`sql
${d.sqlQuery}
\`\`\`

## Explanation
${d.explanation}

## Optimization Tips
${bulleted(d.optimizationTips)}

## Example Output
${d.exampleOutput.length ? d.exampleOutput.map((row) => JSON.stringify(row)).join("\n") : "_No sample rows generated._"}

## Alternative Queries
${d.alternativeQueries.map((a) => `### ${a.label}\n\`\`\`sql\n${a.query}\n\`\`\`\n_Tradeoff: ${a.tradeoff}_`).join("\n\n") || "_None._"}
`,
};

/* ==================================================================== */
/* 8. Grammar Checker                                                    */
/* ==================================================================== */
const grammarChecker: ToolDefinition<typeof grammarCheckerSchema> = {
  slug: "grammar-checker",
  label: "Grammar Checker",
  description: "Fixes grammar and spelling, then upgrades the writing itself.",
  category: "Writing",
  icon: SpellCheck,
  accent: "success",
  placeholder: "Paste text to check...",
  acceptsFile: false,
  examples: ["Check this cover letter paragraph", "Proofread this LinkedIn post"],
  loadingSteps: ["Scanning for errors", "Checking readability", "Polishing the prose"],
  systemPrompt:
    "You are a meticulous copy editor. You correct every grammar and spelling error precisely, and separately offer a more polished, professional rewrite — without changing the author's intent.",
  buildUserPrompt: (input) =>
    `Correct all grammar and spelling errors in this text (list each original → corrected pair with a short explanation), suggest sentence-level improvements for clarity, score readability 0-100, provide the fully corrected text, and a separate professional rewrite.\n\n${input}`,
  schema: grammarCheckerSchema,
  toMarkdown: (d) => `# Grammar Check

**Readability Score:** ${d.readabilityScore}/100

## Grammar Errors
${d.grammarErrors.map((e) => `- ~~${e.original}~~ → **${e.corrected}** — ${e.explanation}`).join("\n") || "_None found._"}

## Spelling Errors
${d.spellingErrors.map((e) => `- ~~${e.original}~~ → **${e.corrected}**`).join("\n") || "_None found._"}

## Sentence Improvements
${d.sentenceImprovements.map((s) => `- ${s.original} → **${s.improved}** _(${s.reason})_`).join("\n") || "_None._"}

## Corrected Text
${d.correctedText}

## Professional Rewrite
${d.professionalRewrite}
`,
};

/* ==================================================================== */
/* 9. Blog Writer                                                        */
/* ==================================================================== */
const blogWriter: ToolDefinition<typeof blogWriterSchema> = {
  slug: "blog-writer",
  label: "Blog Writer",
  description: "A complete, SEO-ready blog post — title, outline, full draft, and FAQ.",
  category: "Writing",
  icon: NotebookPen,
  accent: "signal",
  placeholder: "Give a topic, target audience, and tone...",
  acceptsFile: false,
  examples: ["Write a blog post about remote work productivity for startup founders", "Blog post: why small businesses should use AI, casual tone"],
  loadingSteps: ["Researching the angle", "Building the outline", "Drafting the post", "Writing SEO metadata"],
  systemPrompt:
    "You are a content strategist and SEO copywriter who writes engaging, well-structured blog posts that rank and convert — never generic filler content.",
  buildUserPrompt: (input) =>
    `Write a complete blog post for this brief. Produce an SEO title, a meta description under 160 characters, an outline, the full post in Markdown with headings, target keywords, an FAQ section, a call to action, and an estimated reading time in minutes.\n\nBrief: ${input}`,
  schema: blogWriterSchema,
  toMarkdown: (d) => `# ${d.seoTitle}

_${d.metaDescription}_

**Estimated reading time:** ${d.estimatedReadingMinutes} min

## Outline
${numbered(d.outline)}

---

${d.fullBlog}

---

## FAQ
${d.faq.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}

## Call To Action
${d.callToAction}

## Target Keywords
${d.keywords.join(", ")}
`,
};

/* ==================================================================== */
/* 10. Email Writer                                                      */
/* ==================================================================== */
const emailWriter: ToolDefinition<typeof emailWriterSchema> = {
  slug: "email-writer",
  label: "Email Writer",
  description: "Drafts a professional email with subject line options and a shorter alternative.",
  category: "Writing",
  icon: Mail,
  accent: "signal",
  placeholder: "Describe what the email needs to say and who it's to...",
  acceptsFile: false,
  examples: ["Follow-up email after no response for a week", "Politely decline a meeting invite"],
  loadingSteps: ["Drafting the email", "Writing subject lines"],
  systemPrompt:
    "You are an executive assistant who writes clear, appropriately-toned professional emails that get results without being pushy or overly formal.",
  buildUserPrompt: (input) =>
    `Write a professional email for this request. Give 2-3 subject line options, note the tone used, write the full body, a punchier 3-4 sentence shorter version, and a suggested follow-up if there's no reply.\n\nRequest: ${input}`,
  schema: emailWriterSchema,
  toMarkdown: (d) => `# Email Draft

**Subject line options:**
${bulleted(d.subjectLines)}

**Tone:** ${d.tone}

## Body
${d.body}

## Shorter Version
${d.shorterVersion}

## Suggested Follow-Up
${d.followUpSuggestion}
`,
};

/* ==================================================================== */
/* 11. Text Translator                                                   */
/* ==================================================================== */
const translator: ToolDefinition<typeof translatorSchema> = {
  slug: "translator",
  label: "Text Translator",
  description: "Translates with tone/idiom notes and a literal alternative, not just a raw conversion.",
  category: "Writing",
  icon: Languages,
  accent: "nova",
  placeholder: "Paste text and specify the target language, e.g. 'Translate to French: ...'",
  acceptsFile: false,
  examples: ["Translate to Spanish: Let's touch base next week", "Translate this to Japanese for a business email"],
  loadingSteps: ["Detecting the language", "Translating", "Checking tone & idioms"],
  systemPrompt:
    "You are a professional translator fluent in tone and idiom, not just vocabulary. You always flag where a literal translation would sound wrong or lose meaning.",
  buildUserPrompt: (input) =>
    `Translate the following. Detect the source language and target language (default to English if unspecified, and note the detected source). Give the natural translation, a more literal word-for-word alternative for learners, notes on any idioms/tone/cultural nuance, and 1-2 alternative phrasings.\n\n${input}`,
  schema: translatorSchema,
  toMarkdown: (d) => `# Translation (${d.detectedSourceLanguage} → ${d.targetLanguage})

## Translation
${d.translation}

## Literal Translation
${d.literalTranslation}

## Tone & Idiom Notes
${bulleted(d.toneNotes)}

## Alternative Phrasings
${bulleted(d.alternativePhrasings)}
`,
};

/* ==================================================================== */
/* 12. Image Analyzer                                                    */
/* ==================================================================== */
const imageAnalyzer: ToolDefinition<typeof imageAnalyzerSchema> = {
  slug: "image-analyzer",
  label: "Image Analyzer",
  description: "Object detection, scene description, and OCR in one pass over an image.",
  category: "Vision",
  icon: ImageIcon,
  accent: "nova",
  placeholder: "Attach an image and optionally ask a specific question about it...",
  acceptsFile: true,
  fileHint: "JPG, PNG, or WEBP",
  examples: ["What's in this photo?", "Is there any text in this screenshot, and what does it say?"],
  loadingSteps: ["Looking at the image", "Detecting objects", "Reading any visible text"],
  systemPrompt:
    "You are a computer vision analyst. You describe scenes precisely, detect objects with realistic confidence estimates, and transcribe any visible text — you never guess at things you can't actually see in the image.",
  buildUserPrompt: (input) =>
    input?.trim()
      ? `Analyze the attached image. Describe the scene, detect objects with confidence scores, transcribe any visible text (OCR), note dominant colors, give an overall summary, and specifically answer: ${input}`
      : "Analyze the attached image. Describe the scene, detect objects with confidence scores, transcribe any visible text (OCR), note dominant colors, and give an overall summary.",
  schema: imageAnalyzerSchema,
  toMarkdown: (d) => `# Image Analysis

**Overall Confidence:** ${d.overallConfidence}%

## Scene Description
${d.sceneDescription}

## Objects Detected
${d.objects.map((o) => `- ${o.name} (${o.confidence}%)`).join("\n") || "_None detected._"}

${d.ocrText ? `## Text Found (OCR)\n${d.ocrText}\n` : ""}
## Dominant Colors
${d.colors.join(", ")}

## Summary
${d.summary}

${d.questionsAnswered.length ? `## Questions Answered\n${d.questionsAnswered.map((q) => `**${q.question}**\n${q.answer}`).join("\n\n")}` : ""}
`,
};

/* ==================================================================== */
/* 13. OCR — Extract Text ONLY                                           */
/* ==================================================================== */
const ocr: ToolDefinition<typeof ocrSchema> = {
  slug: "ocr",
  label: "OCR — Extract Text",
  description: "Pulls exact text out of scans, screenshots, or photos — structure preserved, nothing interpreted.",
  category: "Vision",
  icon: ScanText,
  accent: "success",
  placeholder: "Attach a scanned document or screenshot...",
  acceptsFile: true,
  fileHint: "Scanned PDF, photo, or screenshot",
  examples: ["Extract the text from this receipt", "Transcribe this handwritten note"],
  loadingSteps: ["Scanning the image", "Extracting text", "Checking uncertain sections"],
  systemPrompt:
    "You are an OCR engine. Your ONLY job is faithful text extraction, preserving structure with Markdown (headings, lists, tables). You never summarize, interpret, or comment on content — only transcribe it. Mark genuinely illegible sections rather than guessing silently.",
  buildUserPrompt: () =>
    "Extract all text visible in the attached image/document exactly as written, preserving structure as Markdown. Identify the document type and language. List any sections you're not fully confident about, and give an overall confidence score.",
  schema: ocrSchema,
  toMarkdown: (d) => `# OCR Result

**Document type:** ${d.documentType} · **Language:** ${d.language} · **Confidence:** ${d.confidence}%

## Extracted Text
${d.extractedText}

${d.uncertainSections.length ? `## Uncertain Sections\n${bulleted(d.uncertainSections)}` : ""}
`,
};

/* ==================================================================== */
/* 14. Study Assistant — broad tutoring                                  */
/* ==================================================================== */
const studyAssistant: ToolDefinition<typeof studyAssistantSchema> = {
  slug: "study-assistant",
  label: "Study Assistant",
  description: "A full tutoring pass on any topic: explanation, examples, mnemonics, and practice questions.",
  category: "Study",
  icon: BookOpen,
  accent: "signal",
  placeholder: "What topic or question do you need help understanding?",
  acceptsFile: true,
  fileHint: "Optional: attach notes or a textbook page",
  examples: ["Explain the Krebs cycle for a first-year bio exam", "Help me understand recursion with examples"],
  loadingSteps: ["Understanding the topic", "Building examples", "Writing practice questions"],
  systemPrompt:
    "You are a patient, expert tutor who teaches a topic as if the student is seeing it for the very first time — always with concrete examples and memory aids, never just a dry definition.",
  buildUserPrompt: (input) =>
    `Teach this topic/question thoroughly. Give a short summary, a full explanation with at least one worked example, memorable mnemonics if applicable, condensed exam notes, up to 6 flashcards, and up to 6 practice questions with answers.\n\n${input}`,
  schema: studyAssistantSchema,
  toMarkdown: (d) => `# Study Guide

## Summary
${d.summary}

## Explanation
${d.explanation}

## Examples
${bulleted(d.examples)}

${d.mnemonics.length ? `## Mnemonics\n${bulleted(d.mnemonics)}\n` : ""}
## Exam Notes
${bulleted(d.examNotes)}

## Flashcards
${d.flashcards.map((f) => `**Q:** ${f.question}\n**A:** ${f.answer}`).join("\n\n") || "_None._"}

## Practice Questions
${d.practiceQuestions.map((p) => `**Q:** ${p.question}\n**A:** ${p.answer}`).join("\n\n") || "_None._"}
`,
};

/* ==================================================================== */
/* 15. Flashcard Generator — ONLY flashcards                             */
/* ==================================================================== */
const flashcardGenerator: ToolDefinition<typeof flashcardGeneratorSchema> = {
  slug: "flashcard-generator",
  label: "Flashcard Generator",
  description: "Generates ONLY flashcards — nothing else — ready to flip through and study.",
  category: "Study",
  icon: Layers,
  accent: "nova",
  placeholder: "Paste notes or a topic to generate flashcards from...",
  acceptsFile: true,
  fileHint: "Optional: attach notes or a textbook excerpt",
  examples: ["Flashcards for WWII key dates", "Flashcards on Spanish irregular verbs"],
  loadingSteps: ["Reading the material", "Writing flashcards"],
  systemPrompt:
    "You generate flashcards ONLY. No summaries, no explanations, no extra commentary — just tight, memorable question/answer pairs suitable for spaced repetition, tagged by difficulty.",
  buildUserPrompt: (input) =>
    `Generate a set of flashcards ONLY (question, answer, difficulty easy/medium/hard) from this material. Do not include any summary or explanation outside the flashcards.\n\nMaterial:\n${input}`,
  schema: flashcardGeneratorSchema,
  toMarkdown: (d) => `# Flashcards — ${d.topic}

${d.flashcards.map((f, i) => `### ${i + 1}. [${f.difficulty}]\n**Q:** ${f.question}\n**A:** ${f.answer}`).join("\n\n")}
`,
};

/* ==================================================================== */
/* 16. MCQ Generator — ONLY multiple-choice questions                    */
/* ==================================================================== */
const mcqGenerator: ToolDefinition<typeof mcqGeneratorSchema> = {
  slug: "mcq-generator",
  label: "MCQ Generator",
  description: "Generates ONLY multiple-choice questions, with a difficulty spread and answer key.",
  category: "Study",
  icon: ShieldCheck,
  accent: "danger",
  placeholder: "Paste notes or a topic to generate quiz questions from...",
  acceptsFile: true,
  fileHint: "Optional: attach notes or a textbook excerpt",
  examples: ["MCQs on photosynthesis for a 9th grade class", "Quiz me on JavaScript closures"],
  loadingSteps: ["Reading the material", "Writing questions", "Building the answer key"],
  systemPrompt:
    "You generate multiple-choice questions ONLY. Each question has exactly 4 options, one correct answer, a difficulty rating, and a short explanation of why the answer is correct. No flashcards, no summaries — only MCQs.",
  buildUserPrompt: (input) =>
    `Generate multiple-choice questions ONLY from this material, with a spread of difficulty levels (easy/medium/hard), each with exactly 4 options, the correct answer index, and a short explanation.\n\nMaterial:\n${input}`,
  schema: mcqGeneratorSchema,
  toMarkdown: (d) => `# MCQ Quiz — ${d.topic}

${d.questions
  .map(
    (q, i) =>
      `### ${i + 1}. [${q.difficulty}] ${q.question}\n${q.options.map((o, idx) => `${String.fromCharCode(65 + idx)}. ${o}${idx === q.correctIndex ? " ✅" : ""}`).join("\n")}\n\n_Explanation: ${q.explanation}_`
  )
  .join("\n\n")}
`,
};

/* ==================================================================== */
/* 17. Notes Generator                                                   */
/* ==================================================================== */
const notesGenerator: ToolDefinition<typeof notesGeneratorSchema> = {
  slug: "notes-generator",
  label: "Notes Generator",
  description: "Condenses long material into clean, sectioned notes with a key-terms glossary.",
  category: "Study",
  icon: BookOpenText,
  accent: "success",
  placeholder: "Paste material to condense into study notes...",
  acceptsFile: true,
  fileHint: "Optional: attach a chapter or article",
  examples: ["Turn this chapter into structured notes", "Condense this article into study notes"],
  loadingSteps: ["Reading the material", "Structuring sections", "Building the glossary"],
  systemPrompt:
    "You are a note-taking specialist who converts dense material into clean, hierarchically organized study notes with a glossary of key terms — never a wall of prose.",
  buildUserPrompt: (input) =>
    `Convert this material into structured study notes: a title, multiple sections each with a heading and bullet points, a glossary of key terms with definitions, and a short closing summary.\n\n${input}`,
  schema: notesGeneratorSchema,
  toMarkdown: (d) => `# ${d.title}

${d.sections.map((s) => `## ${s.heading}\n${bulleted(s.bullets)}`).join("\n\n")}

## Key Terms
${d.keyTerms.map((k) => `- **${k.term}**: ${k.definition}`).join("\n") || "_None._"}

## Summary
${d.summary}
`,
};

export const TOOLS = [
  resumeReviewer,
  atsChecker,
  pdfSummarizer,
  codeReviewer,
  bugFinder,
  codeExplainer,
  sqlGenerator,
  grammarChecker,
  blogWriter,
  emailWriter,
  translator,
  imageAnalyzer,
  ocr,
  studyAssistant,
  flashcardGenerator,
  mcqGenerator,
  notesGenerator,
] as const;
