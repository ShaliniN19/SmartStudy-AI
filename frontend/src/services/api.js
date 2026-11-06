
/**
 * SmartStudy AI - Frontend API Client
 * Handles authentication, API requests, and error management.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const TOKEN_KEY = 'smartstudy_token';

// Authentication management
export const auth = {
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  saveToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  isLoggedIn() {
    return !!this.getToken();
  }
};

// Centralized API request handler
async function request(endpoint, options = {}) {
  const token = auth.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      'Unable to connect to SmartStudy AI. Please check your internet connection and try again.'
    );
  }

  let data = {};

  try {
    const responseText = await response.text();
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    if ([502, 503, 504].includes(response.status)) {
      throw new Error(
        'SmartStudy AI is temporarily unavailable. Please try again in a few moments.'
      );
    }

    if (response.status === 401) {
      throw new Error(
        data.error || 'Your session has expired. Please sign in again.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        data.error || 'You do not have permission to perform this action.'
      );
    }

    if (response.status === 404) {
      throw new Error(
        data.error || 'The requested service could not be found.'
      );
    }

    if (response.status === 429) {
      throw new Error(
        'Too many requests. Please wait a moment and try again.'
      );
    }

    if (response.status >= 500) {
      throw new Error(
        'A server error occurred. Please try again later.'
      );
    }

    throw new Error(
      data.error || 'Something went wrong. Please try again.'
    );
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(
      'Invalid response received from SmartStudy AI. Please try again.'
    );
  }

  return data;
}

// SmartStudy AI API services
export const api = {

  // User registration
  async register(name, email, password, confirmPassword) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword
      }),
    });

    if (data.token) {
      auth.saveToken(data.token);
    }

    return data;
  },

  // User login
  async login(email, password, rememberMe = false) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        rememberMe
      }),
    });

    if (data.token) {
      auth.saveToken(data.token);
    }

    return data;
  },

  // Get current user
  async getMe() {
    return request('/auth/me', {
      method: 'GET',
    });
  },

  // User logout
  async logout() {
    try {
      return await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      auth.clearToken();
    }
  },

  // Check backend health
  async checkHealth() {
    return request('/health', {
      method: 'GET',
    });
  },

  // Get sample content
  async getSamples() {
    return request('/samples', {
      method: 'GET',
    });
  },

  // Notes summarizer
  async summarize(notes, style = 'balanced') {
    return request('/summarize', {
      method: 'POST',
      body: JSON.stringify({
        notes,
        style
      }),
    });
  },

  // Quiz generator
  async generateQuiz(content, difficulty = 'medium') {
    return request('/quiz', {
      method: 'POST',
      body: JSON.stringify({
        content,
        difficulty
      }),
    });
  },

  // Answer improver
  async improveAnswer(question, draft, targetLevel = 'undergraduate') {
    return request('/improve-answer', {
      method: 'POST',
      body: JSON.stringify({
        question,
        draft,
        targetLevel
      }),
    });
  },

  // Concept explainer
  async explainConcept(concept, depth = 'intuitive') {
    return request('/explain-concept', {
      method: 'POST',
      body: JSON.stringify({
        concept,
        depth
      }),
    });
  },
};
