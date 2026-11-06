
"""
Gemini AI Service integration for SmartStudy AI.
Uses the official Google Gen AI SDK.
"""

import os
import re
import json
import logging
from typing import Dict, Any

from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


class GeminiService:

    def __init__(self):
        self.default_model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash"
        ).strip()

        self.preferred_models = [self.default_model]

    def get_api_key(self) -> str:
        """Get Gemini API key from environment."""
        return os.getenv("GEMINI_API_KEY", "").strip()

    def is_configured(self) -> bool:
        """Check whether the API key is configured."""
        key = self.get_api_key()

        return bool(
            key
            and len(key) > 8
            and not key.startswith("YOUR_")
            and not key.startswith("your_")
            and key != "undefined"
        )

    def _clean_json_text(self, text: str) -> str:
        """Clean JSON response from Gemini."""

        text = text.strip()

        if text.startswith("```"):
            text = re.sub(r"^```[a-zA-Z]*\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        match = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)

        if match:
            return match.group(0)

        return text

    def _normalize_response(
        self,
        feature_name: str,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:

        if not isinstance(data, dict):
            raise ValueError("Gemini returned an invalid JSON object.")

        if feature_name == "summarize":

            short_summary = (
                data.get("shortSummary")
                or data.get("overview")
                or ""
            )

            important_points = (
                data.get("importantPoints")
                or data.get("keyTakeaways")
                or []
            )

            key_definitions = (
                data.get("keyDefinitions")
                or data.get("importantFormulasOrTerms")
                or []
            )

            exam_highlights = (
                data.get("examHighlights")
                or data.get("examTips")
                or []
            )

            data["shortSummary"] = short_summary
            data["overview"] = short_summary
            data["importantPoints"] = important_points
            data["keyTakeaways"] = important_points
            data["keyDefinitions"] = key_definitions
            data["importantFormulasOrTerms"] = key_definitions
            data["examHighlights"] = exam_highlights
            data["examTips"] = exam_highlights

        elif feature_name == "quiz":

            questions = data.get("questions", [])

            for idx, question in enumerate(questions):

                if "id" not in question:
                    question["id"] = idx + 1

                if not isinstance(question.get("options"), list):
                    question["options"] = [
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D"
                    ]

                if "correctAnswer" not in question:
                    question["correctAnswer"] = 0

                if "explanation" not in question:
                    question["explanation"] = (
                        "Based on the provided study notes."
                    )

        elif feature_name == "improve_answer":

            improved = data.get("improvedAnswer") or ""
            points = data.get("importantPoints") or []
            suggestions = data.get("suggestedImprovements") or []
            grammar = data.get("grammarCorrections") or []

            data["improvedAnswer"] = improved
            data["importantPoints"] = points
            data["suggestedImprovements"] = suggestions
            data["grammarCorrections"] = grammar

            if not isinstance(data.get("scoreAssessment"), dict):
                data["scoreAssessment"] = {
                    "originalScore": "Not assessed",
                    "improvedScore": "Not assessed",
                    "gradeLevel": "Improved",
                    "evaluationSummary": (
                        "The answer has been improved for clarity "
                        "and academic presentation."
                    )
                }

        elif feature_name == "explain_concept":

            simple_exp = (
                data.get("simpleExplanation")
                or data.get("oneLineDefinition")
                or ""
            )

            steps = (
                data.get("stepByStepUnderstanding")
                or data.get("stepByStepExplanation")
                or []
            )

            terms = (
                data.get("importantTerms")
                or data.get("importantFormulasOrTerms")
                or []
            )

            summary = data.get("quickRevisionSummary") or ""
            analogy = data.get("simpleAnalogy") or ""

            raw_example = (
                data.get("realWorldExample")
                or data.get("realWorldExamples")
            )

            if isinstance(raw_example, list) and raw_example:
                real_example = raw_example[0]

            elif isinstance(raw_example, dict):
                real_example = raw_example

            elif isinstance(raw_example, str):
                real_example = {
                    "scenario": "Practical Application",
                    "explanation": raw_example
                }

            else:
                real_example = {
                    "scenario": "Real-world context",
                    "explanation": (
                        "Demonstrates this concept in action."
                    )
                }

            data["simpleExplanation"] = simple_exp
            data["oneLineDefinition"] = simple_exp
            data["stepByStepUnderstanding"] = steps
            data["stepByStepExplanation"] = steps
            data["realWorldExample"] = real_example
            data["realWorldExamples"] = [real_example]
            data["importantTerms"] = terms
            data["quickRevisionSummary"] = summary
            data["simpleAnalogy"] = analogy

        return data

    def call_gemini(
        self,
        feature_name: str,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """Generate an AI response using Gemini."""

        api_key = self.get_api_key()

        if not self.is_configured():
            raise ValueError(
                "Gemini API key is not configured. "
                "Please check GEMINI_API_KEY in backend/.env."
            )

        try:

            client = genai.Client(api_key=api_key)

            logger.info(
                "Generating %s using model %s",
                feature_name,
                self.default_model
            )

            response = client.models.generate_content(
                model=self.default_model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )

            raw_text = response.text or ""

            if not raw_text.strip():
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            cleaned_text = self._clean_json_text(raw_text)

            parsed_data = json.loads(cleaned_text)

            normalized = self._normalize_response(
                feature_name,
                parsed_data
            )

            normalized["_meta"] = {
                "model": self.default_model,
                "sdk": "google-genai",
                "live": True
            }

            return normalized

        except json.JSONDecodeError as error:

            logger.exception("Gemini returned invalid JSON.")

            raise RuntimeError(
                "Gemini returned an invalid response format. "
                "Please try again."
            ) from error

        except Exception as error:

            error_message = str(error)

            logger.exception(
                "Gemini API failed for feature %s",
                feature_name
            )

            if (
                "API_KEY_INVALID" in error_message
                or "API key not valid" in error_message
            ):
                raise ValueError(
                    "Invalid Gemini API key. "
                    "Please verify GEMINI_API_KEY in backend/.env."
                ) from error

            if (
                "RESOURCE_EXHAUSTED" in error_message
                or "429" in error_message
            ):
                raise RuntimeError(
                    "Gemini API rate limit reached. "
                    "Please wait and try again."
                ) from error

            if "404" in error_message or "NOT_FOUND" in error_message:
                raise RuntimeError(
                    f"Gemini model '{self.default_model}' was not found "
                    "or is unavailable to your API key. "
                    "Check the model name and API access."
                ) from error

            if (
                "Failed to connect" in error_message
                or "Connection refused" in error_message
                or "timed out" in error_message.lower()
            ):
                raise RuntimeError(
                    "Could not connect to Google Gemini. "
                    "Check your internet connection."
                ) from error

            raise RuntimeError(
                f"Gemini AI Service Error: {error_message}"
            ) from error


# Create one shared Gemini service instance
gemini_service = GeminiService()
