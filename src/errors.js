/**
 * Custom error classes for Pretty RegEx
 */

class PrettyRegexError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PrettyRegexError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class ParseError extends PrettyRegexError {
  constructor(message, position, context = '') {
    super(message, 'PARSE_ERROR', { position, context });
    this.name = 'ParseError';
  }
}

class ValidationError extends PrettyRegexError {
  constructor(message, pattern, suggestion = '') {
    super(message, 'VALIDATION_ERROR', { pattern, suggestion });
    this.name = 'ValidationError';
  }
}

class RangeError extends PrettyRegexError {
  constructor(message, startChar, endChar) {
    super(message, 'RANGE_ERROR', { startChar, endChar });
    this.name = 'RangeError';
  }
}

class QuantifierError extends PrettyRegexError {
  constructor(message, quantifier) {
    super(message, 'QUANTIFIER_ERROR', { quantifier });
    this.name = 'QuantifierError';
  }
}

class CharacterClassError extends PrettyRegexError {
  constructor(message, content) {
    super(message, 'CHARACTER_CLASS_ERROR', { content });
    this.name = 'CharacterClassError';
  }
}

module.exports = {
  PrettyRegexError,
  ParseError,
  ValidationError,
  RangeError,
  QuantifierError,
  CharacterClassError
}; 