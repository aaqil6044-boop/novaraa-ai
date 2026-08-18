import type { ComponentType } from "react";

import ResumeReviewerView from "./ResumeReviewerView";
import AtsCheckerView from "./AtsCheckerView";
import PdfSummarizerView from "./PdfSummarizerView";
import CodeReviewerView from "./CodeReviewerView";
import BugFinderView from "./BugFinderView";
import CodeExplainerView from "./CodeExplainerView";
import SqlGeneratorView from "./SqlGeneratorView";
import GrammarCheckerView from "./GrammarCheckerView";
import BlogWriterView from "./BlogWriterView";
import EmailWriterView from "./EmailWriterView";
import TranslatorView from "./TranslatorView";
import ImageAnalyzerView from "./ImageAnalyzerView";
import OcrView from "./OcrView";
import StudyAssistantView from "./StudyAssistantView";
import FlashcardGeneratorView from "./FlashcardGeneratorView";
import McqGeneratorView from "./McqGeneratorView";
import NotesGeneratorView from "./NotesGeneratorView";

/**
 * Every tool renders through its own component with its own layout, its own
 * interactions (flip cards, quiz reveal, keyword density bars, etc.), and
 * its own visual hierarchy — never a single generic "render this JSON as a
 * list" component shared across tools.
 */
export const RESULT_VIEWS: Record<string, ComponentType<{ data: any }>> = {
  "resume-reviewer": ResumeReviewerView,
  "ats-score": AtsCheckerView,
  "pdf-summarizer": PdfSummarizerView,
  "code-reviewer": CodeReviewerView,
  "bug-finder": BugFinderView,
  "code-explainer": CodeExplainerView,
  "sql-generator": SqlGeneratorView,
  "grammar-checker": GrammarCheckerView,
  "blog-writer": BlogWriterView,
  "email-writer": EmailWriterView,
  translator: TranslatorView,
  "image-analyzer": ImageAnalyzerView,
  ocr: OcrView,
  "study-assistant": StudyAssistantView,
  "flashcard-generator": FlashcardGeneratorView,
  "mcq-generator": McqGeneratorView,
  "notes-generator": NotesGeneratorView,
};
