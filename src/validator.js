/**
 * Pattern validation utilities for Pretty RegEx
 */

const { ValidationError, RangeError } = require('./errors');

class PatternValidator {
  constructor() {
    this.maxPatternLength = 10000; // Prevent extremely long patterns
    this.maxNestingDepth = 50; // Prevent excessive nesting
  }

  /**
   * Validate a PRX pattern before parsing
   * @param {string} pattern - The pattern to validate
   * @returns {Object} - Validation result with errors and warnings
   */
  validate(pattern) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    if (!pattern || typeof pattern !== 'string') {
      result.errors.push(new ValidationError(
        'Pattern must be a non-empty string',
        pattern,
        'Provide a valid string pattern'
      ));
      result.isValid = false;
      return result;
    }

    // Check pattern length
    if (pattern.length > this.maxPatternLength) {
      result.warnings.push(new ValidationError(
        `Pattern is very long (${pattern.length} characters). Consider breaking it into smaller parts.`,
        pattern,
        'Break the pattern into smaller, more manageable pieces'
      ));
    }

    // Check for balanced brackets and parentheses
    this.checkBalancedDelimiters(pattern, result);
    
    // Check for common syntax issues
    this.checkSyntaxIssues(pattern, result);
    
    // Check for potential performance issues
    this.checkPerformanceIssues(pattern, result);

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Check for balanced delimiters
   * @param {string} pattern - The pattern to check
   * @param {Object} result - Validation result object
   */
  checkBalancedDelimiters(pattern, result) {
    const stack = [];
    const delimiters = {
      '[': ']',
      '(': ')',
      '{': '}'
    };

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      
      if (delimiters[char]) {
        stack.push({ char, position: i });
      } else if (Object.values(delimiters).includes(char)) {
        if (stack.length === 0) {
          result.errors.push(new ValidationError(
            `Unexpected closing delimiter '${char}' at position ${i}`,
            pattern,
            `Remove the unexpected '${char}' or add a matching opening delimiter`
          ));
        } else {
          const last = stack.pop();
          if (delimiters[last.char] !== char) {
            result.errors.push(new ValidationError(
              `Mismatched delimiters: '${last.char}' at position ${last.position} and '${char}' at position ${i}`,
              pattern,
              `Ensure matching delimiters: '${last.char}' should be closed with '${delimiters[last.char]}'`
            ));
          }
        }
      }
    }

    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      result.errors.push(new ValidationError(
        `Unclosed delimiter '${unclosed.char}' at position ${unclosed.position}`,
        pattern,
        `Add a closing '${delimiters[unclosed.char]}' to match the opening '${unclosed.char}'`
      ));
    }
  }

  /**
   * Check for common syntax issues
   * @param {string} pattern - The pattern to check
   * @param {Object} result - Validation result object
   */
  checkSyntaxIssues(pattern, result) {
    // Check for invalid ranges (but allow mixed case ranges like a-E)
    const rangeRegex = /\[([^\]]*)-([^\]]*)\]/g;
    let match;
    
    while ((match = rangeRegex.exec(pattern)) !== null) {
      const [, start, end] = match;
      if (start && end && start.length === 1 && end.length === 1) {
        const startCode = start.charCodeAt(0);
        const endCode = end.charCodeAt(0);
        
        // Allow mixed case ranges (like a-E) by checking if they're the same letter
        const startLower = start.toLowerCase();
        const endLower = end.toLowerCase();
        
        // Check if it's a valid mixed case range
        const isMixedCaseRange = (
          startLower === endLower || // Same letter, different case (a-A)
          (startLower !== endLower && 
           ((start === startLower && end !== endLower) || 
            (start !== startLower && end === endLower))) // Different letters, mixed case (a-E)
        );
        
        if (startCode > endCode && !isMixedCaseRange) {
          result.errors.push(new RangeError(
            `Invalid range '${start}-${end}': start character '${start}' comes after end character '${end}'`,
            start,
            end
          ));
        }
      }
    }

    // Check for empty character classes
    if (pattern.includes('[]')) {
      result.warnings.push(new ValidationError(
        'Empty character class detected. This will never match anything.',
        pattern,
        'Remove the empty character class or add characters to it'
      ));
    }

    // Check for quantifier issues
    const quantifierRegex = /(\+|\*|\?|\{\d+(?:,\d*)?\})\s*(\+|\*|\?|\{\d+(?:,\d*)?\})/g;
    while ((match = quantifierRegex.exec(pattern)) !== null) {
      result.warnings.push(new ValidationError(
        `Adjacent quantifiers detected: '${match[1]}' followed by '${match[2]}'`,
        pattern,
        'Consider combining quantifiers or using grouping to clarify intent'
      ));
    }
  }

  /**
   * Check for potential performance issues
   * @param {string} pattern - The pattern to check
   * @param {Object} result - Validation result object
   */
  checkPerformanceIssues(pattern, result) {
    // Check for nested quantifiers
    const nestedQuantifierRegex = /(\+|\*|\?|\{\d+(?:,\d*)?\}).*(\+|\*|\?|\{\d+(?:,\d*)?\})/g;
    if (nestedQuantifierRegex.test(pattern)) {
      result.warnings.push(new ValidationError(
        'Nested quantifiers detected. This may cause performance issues.',
        pattern,
        'Consider simplifying the pattern or using atomic groups'
      ));
    }

    // Check for very long character classes
    const longCharClassRegex = /\[[^\]]{100,}\]/g;
    if (longCharClassRegex.test(pattern)) {
      result.warnings.push(new ValidationError(
        'Very long character class detected. This may impact performance.',
        pattern,
        'Consider using ranges or predefined character classes'
      ));
    }
  }

  /**
   * Get suggestions for improving a pattern
   * @param {string} pattern - The pattern to analyze
   * @returns {Array} - Array of suggestions
   */
  getSuggestions(pattern) {
    const suggestions = [];

    // Suggest using ranges instead of long character lists
    if (pattern.includes('[0123456789]')) {
      suggestions.push('Consider using [0-9] instead of [0123456789]');
    }

    // Suggest using predefined character classes
    if (pattern.includes('[ABCDEFGHIJKLMNOPQRSTUVWXYZ]')) {
      suggestions.push('Consider using charU instead of [ABCDEFGHIJKLMNOPQRSTUVWXYZ]');
    }

    if (pattern.includes('[abcdefghijklmnopqrstuvwxyz]')) {
      suggestions.push('Consider using charL instead of [abcdefghijklmnopqrstuvwxyz]');
    }

    // Suggest using anchors for full string matching
    if (pattern.includes('+') && !pattern.includes('start') && !pattern.includes('end')) {
      suggestions.push('Consider adding start/end anchors if you want to match the entire string');
    }

    return suggestions;
  }
}

module.exports = PatternValidator; 