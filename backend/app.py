
"""
SmartStudy AI - Flask Backend Server
Flask REST API with Gemini AI, SQLite authentication and JWT sessions.
"""

import os
import sys
import logging

from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

logger = logging.getLogger("smartstudy_api")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import (
    init_db,
    create_user,
    authenticate_user,
    generate_token,
    require_auth
)

from services.gemini_service import gemini_service
from sample_data import SAMPLE_PRESETS

from prompts import (
    SUMMARIZE_SYSTEM_PROMPT,
    get_summarize_prompt,
    QUIZ_SYSTEM_PROMPT,
    get_quiz_prompt,
    IMPROVE_ANSWER_SYSTEM_PROMPT,
    get_improve_answer_prompt,
    EXPLAIN_CONCEPT_SYSTEM_PROMPT,
    get_explain_concept_prompt
)


# ============================================================
# FLASK CONFIGURATION
# ============================================================

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

init_db()


# ============================================================
# AUTHENTICATION - REGISTER
# ============================================================

@app.route("/api/auth/register", methods=["POST"])
def register():

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request: JSON body required."
        }), 400

    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    confirm_password = str(data.get("confirmPassword", ""))

    if not name:
        return jsonify({
            "success": False,
            "error": "Full Name is required."
        }), 400

    if not email or "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({
            "success": False,
            "error": "Please provide a valid email address."
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "error": "Password must be at least 6 characters long."
        }), 400

    if password != confirm_password:
        return jsonify({
            "success": False,
            "error": "Passwords do not match."
        }), 400

    try:
        user = create_user(
            name=name,
            email=email,
            password=password
        )

        token = generate_token(
            user["id"],
            user["email"],
            user["name"],
            remember_me=True
        )

        logger.info("New user registered: %s", email)

        return jsonify({
            "success": True,
            "message": "Account created successfully!",
            "token": token,
            "user": user
        }), 201

    except ValueError as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 400

    except Exception:
        logger.exception("Registration error")

        return jsonify({
            "success": False,
            "error": "Failed to create account. Please try again."
        }), 500


# ============================================================
# AUTHENTICATION - LOGIN
# ============================================================

@app.route("/api/auth/login", methods=["POST"])
def login():

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request: JSON body required."
        }), 400

    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    remember_me = bool(data.get("rememberMe", False))

    if not email:
        return jsonify({
            "success": False,
            "error": "Please enter your email address."
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "error": "Please enter your password."
        }), 400

    try:
        user = authenticate_user(
            email=email,
            password=password
        )

        if not user:
            return jsonify({
                "success": False,
                "error": "Invalid email address or password."
            }), 401

        token = generate_token(
            user["id"],
            user["email"],
            user["name"],
            remember_me=remember_me
        )

        logger.info("User logged in: %s", email)

        return jsonify({
            "success": True,
            "message": "Login successful!",
            "token": token,
            "user": user
        })

    except Exception:
        logger.exception("Login error")

        return jsonify({
            "success": False,
            "error": "An error occurred during authentication."
        }), 500


# ============================================================
# AUTHENTICATION - CURRENT USER
# ============================================================

@app.route("/api/auth/me", methods=["GET"])
@require_auth
def get_me():

    return jsonify({
        "success": True,
        "user": g.current_user
    })


# ============================================================
# AUTHENTICATION - LOGOUT
# ============================================================

@app.route("/api/auth/logout", methods=["POST"])
def logout():

    return jsonify({
        "success": True,
        "message": "Successfully logged out."
    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health_check():

    configured = gemini_service.is_configured()
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    return jsonify({
        "status": "online",
        "app": "SmartStudy AI Backend",
        "version": "2.0.0",
        "model": model,
        "geminiConfigured": configured,
        "database": "postgresql",
        "message": (
            "Live Gemini AI Engine is ready."
            if configured
            else "Gemini API key is not configured in backend/.env."
        )
    })


# ============================================================
# SAMPLE DATA
# ============================================================

@app.route("/api/samples", methods=["GET"])
def get_samples():

    return jsonify({
        "success": True,
        "samples": SAMPLE_PRESETS
    })


# ============================================================
# FEATURE 1 - NOTES SUMMARIZER
# ============================================================

@app.route("/api/summarize", methods=["POST"])
@require_auth
def summarize_notes():

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request: JSON body required."
        }), 400

    data = request.get_json(silent=True) or {}

    notes = str(data.get("notes", "")).strip()
    style = str(data.get("style", "balanced")).strip().lower()

    if len(notes) < 15:
        return jsonify({
            "success": False,
            "error": "Please provide at least 15 characters of study notes."
        }), 400

    try:
        prompt = get_summarize_prompt(notes, style=style)

        result = gemini_service.call_gemini(
            feature_name="summarize",
            system_prompt=SUMMARIZE_SYSTEM_PROMPT,
            user_prompt=prompt
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except ValueError as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 400

    except RuntimeError as exc:
        logger.error("Summarizer error: %s", exc)

        return jsonify({
            "success": False,
            "error": str(exc)
        }), 503

    except Exception:
        logger.exception("Unexpected summarizer error")

        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while summarizing notes."
        }), 500


# ============================================================
# FEATURE 2 - QUIZ GENERATOR
# ============================================================

@app.route("/api/quiz", methods=["POST"])
@require_auth
def generate_quiz():

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request: JSON body required."
        }), 400

    data = request.get_json(silent=True) or {}

    content = str(data.get("content", "")).strip()
    difficulty = str(data.get("difficulty", "medium")).strip().lower()

    if len(content) < 15:
        return jsonify({
            "success": False,
            "error": "Please provide at least 15 characters of study notes."
        }), 400

    try:
        prompt = get_quiz_prompt(
            content,
            difficulty=difficulty
        )

        result = gemini_service.call_gemini(
            feature_name="quiz",
            system_prompt=QUIZ_SYSTEM_PROMPT,
            user_prompt=prompt
        )

        questions = result.get("questions", [])

        if not isinstance(questions, list) or not questions:
            return jsonify({
                "success": False,
                "error": "AI could not generate quiz questions. Please try again."
            }), 502

        return jsonify({
            "success": True,
            "data": result
        })

    except ValueError as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 400

    except RuntimeError as exc:
        logger.error("Quiz error: %s", exc)

        return jsonify({
            "success": False,
            "error": str(exc)
        }), 503

    except Exception:
        logger.exception("Unexpected quiz error")

        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while generating the quiz."
        }), 500


# ============================================================
# FEATURE 3 - ANSWER IMPROVER
# ============================================================

@app.route("/api/improve-answer", methods=["POST"])
@require_auth
def improve_answer():

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request: JSON body required."
        }), 400

    data = request.get_json(silent=True) or {}

    question = str(data.get("question", "")).strip()
    draft = str(data.get("draft", "")).strip()
    target_level = str(
        data.get("targetLevel", "undergraduate")
    ).strip()

    if len(draft) < 8:
        return jsonify({
            "success": False,
            "error": "Please provide a complete draft answer."
        }), 400

    try:
        prompt = get_improve_answer_prompt(
            question,
            draft,
            target_level=target_level
        )

        result = gemini_service.call_gemini(
            feature_name="improve_answer",
            system_prompt=IMPROVE_ANSWER_SYSTEM_PROMPT,
            user_prompt=prompt
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except ValueError as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 400

    except RuntimeError as exc:
        logger.error("Answer improver error: %s", exc)

        return jsonify({
            "success": False,
            "error": str(exc)
        }), 503

    except Exception:
        logger.exception("Unexpected answer improver error")

        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while improving your answer."
        }), 500


# ============================================================
# FEATURE 4 - CONCEPT EXPLAINER
# ============================================================

@app.route("/api/explain-concept", methods=["POST"])
@require_auth
def explain_concept():

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request: JSON body required."
        }), 400

    data = request.get_json(silent=True) or {}

    concept = str(data.get("concept", "")).strip()
    depth = str(data.get("depth", "intuitive")).strip().lower()

    if len(concept) < 3:
        return jsonify({
            "success": False,
            "error": "Please enter a valid concept name."
        }), 400

    try:
        prompt = get_explain_concept_prompt(
            concept,
            depth=depth
        )

        result = gemini_service.call_gemini(
            feature_name="explain_concept",
            system_prompt=EXPLAIN_CONCEPT_SYSTEM_PROMPT,
            user_prompt=prompt
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except ValueError as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 400

    except RuntimeError as exc:
        logger.error("Concept explainer error: %s", exc)

        return jsonify({
            "success": False,
            "error": str(exc)
        }), 503

    except Exception:
        logger.exception("Unexpected concept explainer error")

        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while explaining the concept."
        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "127.0.0.1")

    logger.info(
        "Starting SmartStudy AI backend on http://%s:%s",
        host,
        port
    )

    app.run(
        host=host,
        port=port,
        debug=True
    )
