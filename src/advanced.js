/**
 * Advanced Pretty RegEx features
 * Extends the basic PrettyRegex with lookaheads, lookbehinds, and other advanced features
 */

class AdvancedPrettyRegex {
  constructor() {
    this.advancedPatterns = {
      // Lookaheads and lookbehinds - these are handled by function calls, not direct replacement
      // 'lookahead': '(?=',     // Handled by function call
      // 'neglookahead': '(?!',  // Handled by function call
      // 'lookbehind': '(?<=',   // Handled by function call
      // 'neglookbehind': '(?<!', // Handled by function call
      
      // Non-capturing groups
      'group': '(?:',         // Non-capturing group
      // 'namedgroup': '(?<',    // Handled by function call
      
      // Atomic groups and possessive quantifiers
      'atomic': '(?>',        // Atomic group
      'possessive+': '+',     // Will be handled specially
      'possessive*': '*',     // Will be handled specially
      'possessive?': '?',     // Will be handled specially
      
      // Conditional patterns
      'if': '(?(',            // Conditional pattern start
      'then': ')',            // Conditional then part
      'else': '|',            // Conditional else part
      
      // Unicode and categories - these are handled by function calls
      // 'unicode': '\\p{',      // Handled by function call
      // 'notunicode': '\\P{',   // Handled by function call
      
      // Common unicode categories shortcuts
      'letter': '\\p{L}',     // Any letter
      'mark': '\\p{M}',       // Any mark
      'number': '\\p{N}',     // Any number
      'punctuation': '\\p{P}', // Any punctuation
      'symbol': '\\p{S}',     // Any symbol
      'separator': '\\p{Z}',  // Any separator
      'other': '\\p{C}',      // Any other character
      
      // Case folding
      'ignorecase': '(?i)',   // Case insensitive mode
      'matchcase': '(?-i)',   // Case sensitive mode
      
      // Multiline and dotall
      'multiline': '(?m)',    // Multiline mode
      'singleline': '(?s)',   // Dotall mode (. matches newlines)
      'nomultiline': '(?-m)', // Disable multiline
      'nosingleline': '(?-s)', // Disable dotall
      
      // Comments and free spacing
      'freeSpacing': '(?x)',  // Free spacing mode
      // 'comment': '(?#',       // Handled by function call
      
      // Recursion and subroutines (limited support)
      'recurse': '(?R)',      // Recurse entire pattern
      'subroutine': '(?',     // Subroutine call (needs number)
      
      // Backtracking control
      'cut': '(*COMMIT)',     // Cut (prevent backtracking)
      'fail': '(*FAIL)',      // Force failure
      'accept': '(*ACCEPT)',  // Force success
      
      // Word boundaries with Unicode
      'wordstart': '\\b(?=\\w)',  // Start of word
      'wordend': '(?<=\\w)\\b',   // End of word
      
      // Specific character classes
      'ascii': '[\\x00-\\x7F]',   // ASCII characters
      'latin': '[\\u0000-\\u024F]', // Latin characters
      'emoji': '[\\u{1F600}-\\u{1F64F}]', // Basic emoji range
      'hex': '[0-9A-Fa-f]',       // Hexadecimal digits
      'octal': '[0-7]',           // Octal digits
      'binary': '[01]',           // Binary digits
      
      // Common patterns
      'email': '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      'url': 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      'ipv4': '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      'ipv6': '\\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\b',
      'phone': '\\b(?:\\+?1[-.]?)?(?:\\(?[0-9]{3}\\)?[-.]?)?[0-9]{3}[-.]?[0-9]{4}\\b',
      'creditcard': '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b',
      'ssn': '\\b[0-9]{3}-?[0-9]{2}-?[0-9]{4}\\b',
      'zipcode': '\\b[0-9]{5}(?:-[0-9]{4})?\\b',
      'time24': '\\b(?:[01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?\\b',
      'time12': '\\b(?:1[0-2]|0?[1-9]):[0-5][0-9](?::[0-5][0-9])?\\s?(?:[AaPp][Mm])\\b',
      'date': '\\b(?:(?:19|20)[0-9]{2}[-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01]))\\b',
      'hexcolor': '#(?:[0-9a-fA-F]{3}){1,2}\\b',
      'uuid': '\\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b'
    };
  }

  /**
   * Parse advanced PRX patterns
   * @param {string} pattern - Advanced PRX pattern
   * @returns {string} - Regex pattern with advanced features
   */
  parseAdvanced(pattern) {
    let result = pattern;
    
    // Handle possessive quantifiers first
    result = result.replace(/possessive([+*?])/g, (match, quantifier) => {
      return quantifier + '+';
    });
    
    // Handle named groups
    result = result.replace(/namedgroup\(([^)]+)\)/g, '(?<$1>');
    
    // Handle lookaheads with content - handle negative patterns first to avoid partial matches
    result = result.replace(/neglookahead\(([^)]+)\)/g, '(?!$1)');
    result = result.replace(/neglookbehind\(([^)]+)\)/g, '(?<!$1)');
    result = result.replace(/lookahead\(([^)]+)\)/g, '(?=$1)');
    result = result.replace(/lookbehind\(([^)]+)\)/g, '(?<=$1)');
    
    // Handle unicode properties - handle negative patterns first
    result = result.replace(/notunicode\(([^)]+)\)/g, '\\P{$1}');
    result = result.replace(/unicode\(([^)]+)\)/g, '\\p{$1}');
    
    // Handle comments - fix to preserve content correctly
    result = result.replace(/comment\(([^)]*)\)/g, '(?#$1)');
    
    // Handle conditional patterns
    result = result.replace(/if\(([^)]+)\)then\(([^)]+)\)else\(([^)]+)\)/g, '(?($1)$2|$3)');
    result = result.replace(/if\(([^)]+)\)then\(([^)]+)\)/g, '(?($1)$2)');
    
    // Handle subroutine calls
    result = result.replace(/subroutine\((\d+)\)/g, '(?$1)');
    
    // Only replace standalone patterns that haven't been processed by the function calls above
    const processedPatterns = ['lookahead', 'neglookahead', 'lookbehind', 'neglookbehind', 
                              'unicode', 'notunicode', 'comment', 'namedgroup'];
    
    // Replace all advanced patterns - sort by length to handle longer patterns first
    const sortedPatterns = Object.entries(this.advancedPatterns)
      .filter(([patternName]) => !processedPatterns.includes(patternName))
      .sort((a, b) => b[0].length - a[0].length);
    
    for (const [patternName, replacement] of sortedPatterns) {
      // Use exact match for better precision
      const regex = new RegExp('\\b' + this.escapeRegExp(patternName) + '\\b', 'g');
      result = result.replace(regex, replacement);
    }
    
    return result;
  }

  /**
   * Escape special regex characters for use in RegExp constructor
   * @param {string} string - String to escape
   * @returns {string} - Escaped string
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Validate if a pattern uses advanced features correctly
   * @param {string} pattern - Pattern to validate
   * @returns {Object} - Validation result with errors and warnings
   */
  validateAdvanced(pattern) {
    const errors = [];
    const warnings = [];
    
    // Check for unmatched parentheses in advanced constructs
    const openParens = (pattern.match(/\(/g) || []).length;
    const closeParens = (pattern.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Unmatched parentheses in pattern');
    }
    
    // Check for unsupported features in JavaScript
    if (pattern.includes('lookbehind') && !this.supportsLookbehind()) {
      warnings.push('Lookbehind assertions may not be supported in all JavaScript engines');
    }
    
    if (pattern.includes('unicode') && !this.supportsUnicode()) {
      warnings.push('Unicode property escapes may not be supported in all JavaScript engines');
    }
    
    // Check for potentially inefficient patterns
    if (pattern.includes('recurse')) {
      warnings.push('Recursive patterns can be slow and may cause stack overflow');
    }
    
    if (pattern.match(/\*.*\*/)) {
      warnings.push('Nested quantifiers detected - this may cause catastrophic backtracking');
    }
    
    return { errors, warnings };
  }

  /**
   * Check if current JavaScript engine supports lookbehind
   * @returns {boolean} - Whether lookbehind is supported
   */
  supportsLookbehind() {
    try {
      new RegExp('(?<=a)b');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if current JavaScript engine supports Unicode property escapes
   * @returns {boolean} - Whether Unicode properties are supported
   */
  supportsUnicode() {
    try {
      new RegExp('\\p{L}', 'u');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get suggested flags for a pattern
   * @param {string} pattern - Pattern to analyze
   * @returns {string} - Suggested flags
   */
  suggestFlags(pattern) {
    let flags = '';
    
    if (pattern.includes('unicode') || pattern.includes('emoji') || pattern.includes('\\p')) {
      flags += 'u';
    }
    
    if (pattern.includes('multiline') || pattern.includes('^') || pattern.includes('$')) {
      flags += 'm';
    }
    
    if (pattern.includes('singleline') || pattern.includes('any')) {
      flags += 's';
    }
    
    if (pattern.includes('ignorecase')) {
      flags += 'i';
    }
    
    return flags;
  }
}

module.exports = AdvancedPrettyRegex; 