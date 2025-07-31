const { 
  ParseError, 
  ValidationError, 
  RangeError, 
  QuantifierError, 
  CharacterClassError 
} = require('./errors');
const PatternValidator = require('./validator');

class PrettyRegex {
  constructor(options = {}) {
    this.charClasses = {
      'charU': '[A-Z]',
      'charL': '[a-z]',
      'char': '[a-zA-Z]',
      '0-9': '[0-9]',
      'digit': '[0-9]',
      'space': ' ',
      'tab': '\\t',
      'newline': '\\n',
      'whitespace': '\\s',
      'notwhitespace': '\\S',
      'wordchar': '\\w',
      'notwordchar': '\\W',
      'any': '.',
      'start': '^',
      'end': '$',
      'word': '\\b',
      'notword': '\\B'
    };
    
    this.quantifiers = {
      '+': '+',
      '*': '*',
      '?': '?'
    };

    // Initialize validator
    this.validator = new PatternValidator();
    
    // Configuration options
    this.options = {
      validatePatterns: options.validatePatterns !== false, // Default to true
      throwOnError: options.throwOnError !== false, // Default to true
      logWarnings: options.logWarnings !== false, // Default to true
      ...options
    };
  }

  /**
   * Parse PRX syntax and convert to regular expression
   * @param {string} prxPattern     The Pretty RegEx pattern
   * @param {string} flags          RegExp flags (g, i, m, etc.)
   * @returns {RegExp}              The compiled regular expression
   */
  compile(prxPattern, flags = '') {
    try {
      // Validate pattern if enabled
      if (this.options.validatePatterns) {
        const validation = this.validator.validate(prxPattern);
        
        if (!validation.isValid) {
          const errorMessage = validation.errors.map(e => e.message).join('; ');
          if (this.options.throwOnError) {
            throw new ValidationError(
              `Pattern validation failed: ${errorMessage}`,
              prxPattern,
              validation.errors[0]?.details?.suggestion || ''
            );
          }
        }
        
        // Log warnings if enabled
        if (this.options.logWarnings && validation.warnings.length > 0) {
          console.warn('Pretty RegEx warnings:', validation.warnings.map(w => w.message));
        }
      }

      // Check if pattern contains case insensitive string literals
      const hasCaseInsensitive = /string\([^)]*,\s*(caseinsensitive|ci|nocase)/i.test(prxPattern);
      const finalFlags = hasCaseInsensitive ? flags + 'i' : flags;

      const regexPattern = this.parse(prxPattern);
      return new RegExp(regexPattern, finalFlags);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ParseError) {
        throw error;
      }
      
      // Wrap unexpected errors
      throw new ParseError(
        `Failed to compile pattern: ${error.message}`,
        0,
        prxPattern
      );
    }
  }

  /**
   * Parse PRX syntax and return regex string
   * @param {string} prxPattern - The Pretty RegEx pattern
   * @returns {string} - The regex pattern string
   */
  parse(prxPattern) {
    let result = '';
    let i = 0;
    let isInCharacterClass = false;
    
    while (i < prxPattern.length) {
      const char = prxPattern[i];
      
      // Handle character classes and special tokens
      if (char === '[') {
        isInCharacterClass = true;
        const classEnd = prxPattern.indexOf(']', i);
        if (classEnd === -1) {
          throw new CharacterClassError(
            'Unclosed character class',
            prxPattern.substring(i)
          );
        }
        
        const classContent = prxPattern.substring(i + 1, classEnd);
        result += this.parseCharacterClass(classContent);
        i = classEnd + 1;
        isInCharacterClass = false;
        continue;
      }
      
      // Handle string literals with string()
      if (prxPattern.substring(i).startsWith('string(')) {
        const closeParenIndex = prxPattern.indexOf(')', i + 7);
        if (closeParenIndex === -1) {
          throw new ParseError(
            'Unclosed string() literal',
            i,
            prxPattern.substring(i, i + 15)
          );
        }
        
        const stringContent = prxPattern.substring(i + 7, closeParenIndex);
        const parsedString = this.parseStringLiteral(stringContent);
        
        // Add appropriate boundaries based on context
        const nextChar = prxPattern[closeParenIndex + 1];
        const isFollowedByQuantifier = nextChar && /[+*?{]/.test(nextChar);
        const isInOrContext = this.isInOrContext(prxPattern, i);
        const isInSequence = this.isInSequence(prxPattern, i);
        const containsSpecialChars = /[^a-zA-Z0-9]/.test(parsedString);
        

        
        // Add appropriate boundaries based on context
        if (parsedString && !isInCharacterClass && !isFollowedByQuantifier) {
          if (isInOrContext) {
            // In OR context, check if we're in a group with quantifier
            const isInGroupWithQuantifier = this.isInGroupWithQuantifier(prxPattern, i);
            
            // Debug logging
            if (this.options.logWarnings) {
              console.log('OR context - Position:', i);
              console.log('OR context - Is in group with quantifier:', isInGroupWithQuantifier);
            }
            
            if (isInGroupWithQuantifier) {
              // In groups with quantifiers, don't add word boundaries to allow concatenation
              result += parsedString;
            } else {
              // Use start/end anchors for standalone OR contexts
              result += `^${parsedString}$`;
            }
          } else if (isInSequence) {
            // In sequence, just use the parsed string (no boundaries)
            result += parsedString;
          } else {
            // Standalone string literals
            if (containsSpecialChars) {
              // For strings with special chars, use start/end anchors
              result += `^${parsedString}$`;
            } else if (/\w/.test(parsedString)) {
              // For word-only strings, use word boundaries
              result += `\\b${parsedString}\\b`;
            } else {
              // For other strings, just use the parsed string
              result += parsedString;
            }
          }
        } else {
          result += parsedString;
        }
        

        
        i = closeParenIndex + 1;
        continue;
      }
      
      // Handle literal characters with char()
      if (prxPattern.substring(i).startsWith('char(')) {
        const closeParenIndex = prxPattern.indexOf(')', i + 5);
        if (closeParenIndex === -1) {
          throw new ParseError(
            'Unclosed char() literal',
            i,
            prxPattern.substring(i, i + 10)
          );
        }
        
        const literalChar = prxPattern.substring(i + 5, closeParenIndex);
        // Don't escape if it's already escaped (starts with backslash)
        if (literalChar.startsWith('\\')) {
          result += literalChar;
        } else {
          result += this.escapeLiteral(literalChar);
        }
        i = closeParenIndex + 1;
        continue;
      }
      
      // Handle quantifiers with {}
      if (char === '{') {
        const closeIndex = prxPattern.indexOf('}', i);
        if (closeIndex === -1) {
          throw new QuantifierError(
            'Unclosed quantifier',
            prxPattern.substring(i, i + 10)
          );
        }
        
        const quantifier = prxPattern.substring(i, closeIndex + 1);
        result += quantifier;
        i = closeIndex + 1;
        continue;
      }
      
      // Handle grouping
      if (char === '(') {
        result += '(';
        i++;
        continue;
      }
      
      if (char === ')') {
        result += ')';
        i++;
        continue;
      }
      
      // Handle OR operator
      if (char === '|') {
        result += '|';
        i++;
        continue;
      }
      
      // Handle quantifiers
      if (this.quantifiers[char]) {
        result += this.quantifiers[char];
        i++;
        continue;
      }
      
      // Handle predefined patterns - order by length to avoid partial matches
      let foundPattern = false;
      const sortedPatterns = Object.entries(this.charClasses).sort((a, b) => b[0].length - a[0].length);
      
      for (const [pattern, replacement] of sortedPatterns) {
        if (prxPattern.substring(i).startsWith(pattern)) {
          result += replacement;
          i += pattern.length;
          foundPattern = true;
          break;
        }
      }
      
      if (foundPattern) {
        continue;
      }
      
      // Handle literal characters
      result += this.escapeLiteral(char);
      i++;
    }
    
    return result;
  }

  /**
   * Parse string literal with case sensitivity options
   * @param {string} content - Content inside string() with optional case flags
   * @returns {string} - Escaped string literal with case handling
   */
  parseStringLiteral(content) {
    // Handle empty string case
    if (!content || content.trim() === '') {
      return '(?:)'; // Non-capturing empty group
    }
    
    // Trim the content to handle extra whitespace
    const trimmedContent = content.trim();
    
    // Check for case sensitivity flags with better regex patterns
    const caseInsensitiveMatch = trimmedContent.match(/^(.+?)(?:\s*,\s*(caseinsensitive|ci|nocase))$/i);
    const caseSensitiveMatch = trimmedContent.match(/^(.+?)(?:\s*,\s*(casesensitive|cs|case))$/i);
    const multicaseMatch = trimmedContent.match(/^(.+?)(?:\s*,\s*(multicase|mc))$/i);
    

    
    let stringValue = content;
    
    if (caseInsensitiveMatch) {
      stringValue = caseInsensitiveMatch[1].trim();
      // For case insensitive, we'll rely on the 'i' flag being passed to compile()
      return this.escapeLiteral(stringValue);
    } else if (caseSensitiveMatch) {
      stringValue = caseSensitiveMatch[1].trim();
      return this.escapeLiteral(stringValue);
    } else if (multicaseMatch) {
      stringValue = multicaseMatch[1].trim();
      return this.createMulticasePattern(stringValue);
    }
    
    // Default case sensitive
    return this.escapeLiteral(stringValue);
  }

  /**
   * Check if a position is in an OR context (between | operators)
   * @param {string} pattern - The full pattern
   * @param {number} position - Current position
   * @returns {boolean} - Whether we're in an OR context
   */
  isInOrContext(pattern, position) {
    // Look backwards for the nearest | or ( or start of pattern
    let i = position - 1;
    let parenCount = 0;
    
    while (i >= 0) {
      const char = pattern[i];
      if (char === ')') {
        parenCount++;
      } else if (char === '(') {
        parenCount--;
        if (parenCount < 0) break;
      } else if (char === '|' && parenCount === 0) {
        return true;
      }
      i--;
    }
    
    // Also look ahead for | operators
    i = position + 1;
    parenCount = 0;
    
    while (i < pattern.length) {
      const char = pattern[i];
      if (char === '(') {
        parenCount++;
      } else if (char === ')') {
        parenCount--;
        if (parenCount < 0) break;
      } else if (char === '|' && parenCount === 0) {
        return true;
      }
      i++;
    }
    
    return false;
  }

  /**
   * Check if a position is in a group with quantifier
   * @param {string} pattern - The full pattern
   * @param {number} position - Current position
   * @returns {boolean} - Whether we're in a group with quantifier
   */
  isInGroupWithQuantifier(pattern, position) {
    // First, check if we're inside parentheses by looking backwards
    let i = position - 1;
    let parenCount = 0;
    let inGroup = false;
    
    while (i >= 0) {
      const char = pattern[i];
      if (char === ')') {
        parenCount++;
      } else if (char === '(') {
        parenCount--;
        if (parenCount < 0) {
          // Found the start of our group
          inGroup = true;
          break;
        }
      }
      i--;
    }
    
    if (!inGroup) {
      return false;
    }
    
    // Now look ahead from the current position to find the end of the group
    i = position;
    parenCount = 0;
    
    while (i < pattern.length) {
      const char = pattern[i];
      if (char === '(') {
        parenCount++;
      } else if (char === ')') {
        parenCount--;
        if (parenCount < 0) {
          // Found the end of our group, check if next char is a quantifier
          const nextChar = pattern[i + 1];
          return nextChar && /[+*?{]/.test(nextChar);
        }
      }
      i++;
    }
    
    return false;
  }

  /**
   * Check if a position is in a sequence (followed by another string literal)
   * @param {string} pattern - The full pattern
   * @param {number} position - Current position
   * @returns {boolean} - Whether we're in a sequence
   */
  isInSequence(pattern, position) {
    // Look ahead to see if there's another string() call immediately after this one
    const remainingPattern = pattern.substring(position);
    const nextStringMatch = remainingPattern.match(/string\(/);
    

    
    if (nextStringMatch && nextStringMatch.index > 0) {
      const nextStringPos = position + nextStringMatch.index;
      // Check if there's only whitespace and parentheses between current position and next string
      const betweenText = pattern.substring(position, nextStringPos);
      const isSequence = /^[\s()]*$/.test(betweenText);
      

      
      return isSequence;
    }
    
    // Look for the next string() call after the current one
    // Skip the current string() call first
    const currentStringEnd = pattern.indexOf(')', position);
    if (currentStringEnd !== -1) {
      const afterCurrentString = pattern.substring(currentStringEnd + 1);
      const nextStringMatch = afterCurrentString.match(/string\(/);
      

      
      if (nextStringMatch) {
        const nextStringPos = currentStringEnd + 1 + nextStringMatch.index;
        // Check if there's only whitespace and parentheses between current string end and next string
        const betweenText = pattern.substring(currentStringEnd + 1, nextStringPos);
        const isSequence = /^[\s()]*$/.test(betweenText);
        

        
        return isSequence;
      }
      
      // If there's no next string but we're in a sequence context, check if there was a previous string
      // Look backwards to see if there was a string() call before this one
      let i = position - 1;
      while (i >= 0) {
        const char = pattern[i];
        if (char === ')') {
          // Found the end of a previous string() call
          const beforeCurrentString = pattern.substring(0, i + 1);
          const prevStringMatch = beforeCurrentString.match(/string\([^)]*\)$/);
          if (prevStringMatch) {
            // Check if there's only whitespace and parentheses between the previous string and current position
            const betweenText = pattern.substring(i + 1, position);
            const isSequence = /^[\s()]*$/.test(betweenText);
            

            
            return isSequence;
          }
          break;
        }
        i--;
      }
    }
    
    // Also check if we're in a grouping context (inside parentheses)
    let i = position - 1;
    let parenCount = 0;
    
    while (i >= 0) {
      const char = pattern[i];
      if (char === ')') {
        parenCount++;
      } else if (char === '(') {
        parenCount--;
        if (parenCount < 0) break;
      }
      i--;
    }
    
    const inGrouping = parenCount > 0; // We're inside parentheses
    

    
    return inGrouping;
  }

  /**
   * Create a multicase pattern that matches all case variations
   * @param {string} text - The text to create multicase pattern for
   * @returns {string} - Regex pattern matching all case variations
   */
  createMulticasePattern(text) {
    if (!text || text.length === 0) {
      return '';
    }
    
    // For each character, create a pattern that matches both upper and lowercase
    const patterns = [];
    
    for (const char of text) {
      if (/[a-zA-Z]/.test(char)) {
        // For letters, create [Aa] pattern
        const lower = char.toLowerCase();
        const upper = char.toUpperCase();
        if (lower === upper) {
          // Same character (non-letter)
          patterns.push(this.escapeLiteral(char));
        } else {
          patterns.push(`[${lower}${upper}]`);
        }
      } else {
        // For non-letters, just escape
        patterns.push(this.escapeLiteral(char));
      }
    }
    
    return patterns.join('');
  }

  /**
   * Parse character class content (inside [])
   * @param {string} content - Content inside the brackets
   * @returns {string} - Parsed character class or lookahead combination
   */
  parseCharacterClass(content) {
    // Check if this contains MUST requirements (& operators) - but not inside char() calls
    if (content.includes('&') && !this.hasCharWithSpecialChar(content, '&')) {
      return this.parseMustCharacterClass(content);
    }
    
    // Check if this contains AND/OR (union) bridges (+ operators) - but not inside char() calls
    if (content.includes('+') && !this.hasCharWithSpecialChar(content, '+')) {
      return this.parseAndOrCharacterClass(content);
    }
    
    // Regular character class parsing (no special operators)
    let result = '[';
    let i = 0;
    
    while (i < content.length) {
      // Handle char() literals FIRST to avoid conflicts with 'char' pattern
      if (content.substring(i).startsWith('char(')) {
        const closeParenIndex = content.indexOf(')', i + 5);
        if (closeParenIndex === -1) {
          throw new Error('Unclosed char() in character class');
        }
        
        const literalChar = content.substring(i + 5, closeParenIndex);
        result += this.escapeInCharClass(literalChar);
        i = closeParenIndex + 1;
        continue;
      }
      
      // Check for predefined character classes - order by length to avoid partial matches
      let foundPattern = false;
      const sortedPatterns = Object.entries(this.charClasses).sort((a, b) => b[0].length - a[0].length);
      
      for (const [pattern, replacement] of sortedPatterns) {
        if (content.substring(i).startsWith(pattern)) {
          // Remove the outer brackets if it's a character class
          const cleanReplacement = replacement.startsWith('[') && replacement.endsWith(']') 
            ? replacement.slice(1, -1) 
            : replacement;
          result += cleanReplacement;
          i += pattern.length;
          foundPattern = true;
          break;
        }
      }
      
      if (foundPattern) {
        continue;
      }
      
      // Handle character ranges (e.g., 0-9, a-z, A-Z)
      if (i + 2 < content.length && content[i + 1] === '-') {
        const startChar = content[i];
        const endChar = content[i + 2];
        
        // Validate range (both characters should be of the same type)
        if (this.isValidRange(startChar, endChar)) {
          // Handle mixed case ranges like a-E
          if (this.isMixedCaseRange(startChar, endChar)) {
            // For mixed case ranges, create a range that includes both cases
            const startLower = startChar.toLowerCase();
            const endLower = endChar.toLowerCase();
            result += `${startLower  }-${  endLower  }${startChar.toUpperCase()  }-${  endChar.toUpperCase()}`;
          } else {
            result += `${startChar  }-${  endChar}`;
          }
          i += 3; // Skip start, -, and end characters
          continue;
        }
      }
      
      // Handle other characters
      result += this.escapeInCharClass(content[i]);
      i++;
    }
    
    result += ']';
    return result;
  }

  /**
   * Parse character class with MUST semantics using lookaheads
   * @param {string} content - Content inside the brackets with & operators
   * @returns {string} - Lookahead pattern ensuring all character types are present
   */
  parseMustCharacterClass(content) {
    // Split by & to get individual requirements
    const requirements = content.split('&').map(req => req.trim()).filter(req => req.length > 0);
    
    if (requirements.length <= 1) {
      // No MUST requirements, fall back to regular parsing
      return this.parseCharacterClass(content.replace('&', ''));
    }
    
    const lookaheads = [];
    const allCharClasses = [];
    
    for (const requirement of requirements) {
      const parsed = this.parseCharacterRequirement(requirement);
      if (parsed.lookahead) {
        lookaheads.push(parsed.lookahead);
      }
      if (parsed.charClass) {
        allCharClasses.push(parsed.charClass);
      }
    }
    
    // Combine all character classes into one
    let combinedCharClass = '[';
    for (const charClass of allCharClasses) {
      if (charClass.startsWith('[') && charClass.endsWith(']')) {
        // Remove brackets and add content
        combinedCharClass += charClass.slice(1, -1);
      } else {
        // Add as-is
        combinedCharClass += charClass;
      }
    }
    combinedCharClass += ']';
    
    // Build the complete pattern with lookaheads for MUST requirements
    let result = '';
    for (const lookahead of lookaheads) {
      result += `(?=.*${lookahead})`;
    }
    result += combinedCharClass;
    
    return result;
  }

  /**
   * Parse character class with AND/OR (union) semantics
   * @param {string} content - Content inside the brackets with + operators
   * @returns {string} - Union character class (may only contain these types)
   */
  parseAndOrCharacterClass(content) {
    // Split by + to get individual character types for union
    const requirements = content.split('+').map(req => req.trim()).filter(req => req.length > 0);
    
    if (requirements.length <= 1) {
      // No union requirements, fall back to regular parsing
      return this.parseCharacterClass(content.replace('+', ''));
    }
    
    // For AND/OR (union), just combine all character classes without lookaheads
    let combinedCharClass = '[';
    
    for (const requirement of requirements) {
      const parsed = this.parseCharacterRequirement(requirement);
      if (parsed.charClass) {
        if (parsed.charClass.startsWith('[') && parsed.charClass.endsWith(']')) {
          // Remove brackets and add content
          combinedCharClass += parsed.charClass.slice(1, -1);
        } else {
          // Add as-is
          combinedCharClass += parsed.charClass;
        }
      }
    }
    
    combinedCharClass += ']';
    return combinedCharClass;
  }

  /**
   * Parse a single character requirement for AND/OR logic
   * @param {string} requirement - Single requirement (e.g., 'charU', '0-9', 'char(.)')
   * @returns {Object} - Object with lookahead and charClass properties
   */
  parseCharacterRequirement(requirement) {
    let i = 0;
    let lookaheadClass = '';
    const charClassParts = [];
    
    while (i < requirement.length) {
      // Handle char() literals FIRST to avoid conflicts with 'char' pattern
      if (requirement.substring(i).startsWith('char(')) {
        const closeParenIndex = requirement.indexOf(')', i + 5);
        if (closeParenIndex === -1) {
          throw new Error('Unclosed char() in character requirement');
        }
        
        const literalChar = requirement.substring(i + 5, closeParenIndex);
        // Don't escape if it's already escaped (starts with backslash)
        const finalChar = literalChar.startsWith('\\') ? literalChar : this.escapeLiteral(literalChar);
        lookaheadClass = finalChar;
        charClassParts.push(finalChar);
        i = closeParenIndex + 1;
        continue;
      }
      
      // Check for predefined character classes
      let foundPattern = false;
      const sortedPatterns = Object.entries(this.charClasses).sort((a, b) => b[0].length - a[0].length);
      
      for (const [pattern, replacement] of sortedPatterns) {
        if (requirement.substring(i).startsWith(pattern)) {
          // For lookahead, use the replacement directly
          lookaheadClass = replacement;
          // For character class, collect the replacement
          charClassParts.push(replacement);
          i += pattern.length;
          foundPattern = true;
          break;
        }
      }
      
      if (foundPattern) {
        continue;
      }
      
      // Handle character ranges (e.g., 0-9, a-z, A-Z)
      if (i + 2 < requirement.length && requirement[i + 1] === '-') {
        const startChar = requirement[i];
        const endChar = requirement[i + 2];
        
        // Validate range (both characters should be of the same type)
        if (this.isValidRange(startChar, endChar)) {
          // Handle mixed case ranges like a-E
          if (this.isMixedCaseRange(startChar, endChar)) {
            // For mixed case ranges, create a range that includes both cases
            const startLower = startChar.toLowerCase();
            const endLower = endChar.toLowerCase();
            const rangeStr = `${startLower  }-${  endLower  }${startChar.toUpperCase()  }-${  endChar.toUpperCase()}`;
            lookaheadClass = `[${  rangeStr  }]`;
            charClassParts.push(rangeStr);
          } else {
            const rangeStr = `${startChar  }-${  endChar}`;
            lookaheadClass = `[${  rangeStr  }]`;
            charClassParts.push(rangeStr);
          }
          i += 3; // Skip start, -, and end characters
          continue;
        }
      }
      
      // Handle other characters
      const escaped = this.escapeInCharClass(requirement[i]);
      lookaheadClass = escaped;
      charClassParts.push(escaped);
      i++;
    }
    
    return {
      lookahead: lookaheadClass,
      charClass: charClassParts.join('')
    };
  }

  /**
   * Escape literal characters for regex
   * @param {string} char - Character to escape
   * @returns {string} - Escaped character
   */
  escapeLiteral(char) {
    const regexSpecialChars = /[.*+?^${}()|[\]\\]/g;
    return char.replace(regexSpecialChars, '\\$&');
  }

  /**
   * Escape characters within character classes
   * @param {string} char - Character to escape
   * @returns {string} - Escaped character for character class
   */
  escapeInCharClass(char) {
    // Don't escape - as it's used for ranges, only escape other special chars
    const charClassSpecialChars = /[\]\\^]/g;
    return char.replace(charClassSpecialChars, '\\$&');
  }

  /**
   * Check if two characters form a valid range
   * @param {string} startChar - Start character of the range
   * @param {string} endChar - End character of the range
   * @returns {boolean} - Whether the range is valid
   */
  isValidRange(startChar, endChar) {
    // Both characters must be single characters
    if (startChar.length !== 1 || endChar.length !== 1) {
      return false;
    }
    
    // Check if both are digits
    if (/^\d$/.test(startChar) && /^\d$/.test(endChar)) {
      const isValid = parseInt(startChar) <= parseInt(endChar);
      if (!isValid) {
        throw new RangeError(
          `Invalid numeric range '${startChar}-${endChar}': start digit '${startChar}' is greater than end digit '${endChar}'`,
          startChar,
          endChar
        );
      }
      return true;
    }
    
    // Check if both are lowercase letters
    if (/^[a-z]$/.test(startChar) && /^[a-z]$/.test(endChar)) {
      const isValid = startChar <= endChar;
      if (!isValid) {
        throw new RangeError(
          `Invalid lowercase range '${startChar}-${endChar}': start letter '${startChar}' comes after end letter '${endChar}'`,
          startChar,
          endChar
        );
      }
      return true;
    }
    
    // Check if both are uppercase letters
    if (/^[A-Z]$/.test(startChar) && /^[A-Z]$/.test(endChar)) {
      const isValid = startChar <= endChar;
      if (!isValid) {
        throw new RangeError(
          `Invalid uppercase range '${startChar}-${endChar}': start letter '${startChar}' comes after end letter '${endChar}'`,
          startChar,
          endChar
        );
      }
      return true;
    }
    
    // For mixed case ranges, we need to handle them specially
    // a-E should become a-zA-Z (case insensitive range)
    const startLower = startChar.toLowerCase();
    const endLower = endChar.toLowerCase();
    
    // If they're the same letter in different cases, it's valid
    if (startLower === endLower) {
      return true;
    }
    
    // Check if they're different letters but one is lowercase and one is uppercase
    if (startLower !== endLower && 
        ((startChar === startLower && endChar !== endLower) || 
         (startChar !== startLower && endChar === endLower))) {
      const isValid = startLower <= endLower;
      if (!isValid) {
        throw new RangeError(
          `Invalid mixed case range '${startChar}-${endChar}': start letter '${startLower}' comes after end letter '${endLower}'`,
          startChar,
          endChar
        );
      }
      return true;
    }
    
    return false;
  }

  /**
   * Check if two characters form a mixed case range (e.g., a-E)
   * @param {string} startChar - Start character of the range
   * @param {string} endChar - End character of the range
   * @returns {boolean} - Whether it's a mixed case range
   */
  isMixedCaseRange(startChar, endChar) {
    const startLower = startChar.toLowerCase();
    const endLower = endChar.toLowerCase();
    
    // Check if they're the same letter but different cases
    if (startLower === endLower && startChar !== endChar) {
      return true;
    }
    
    // Check if they're different letters but one is lowercase and one is uppercase
    if (startLower !== endLower && 
        ((startChar === startLower && endChar !== endLower) || 
         (startChar !== startLower && endChar === endLower))) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if a character class content contains a special character inside char() calls
   * @param {string} content - Character class content
   * @param {string} specialChar - Special character to check for
   * @returns {boolean} - Whether the special char is inside a char() call
   */
  hasCharWithSpecialChar(content, specialChar) {
    let i = 0;
    while (i < content.length) {
      if (content.substring(i).startsWith('char(')) {
        const closeParenIndex = content.indexOf(')', i + 5);
        if (closeParenIndex !== -1) {
          const charContent = content.substring(i + 5, closeParenIndex);
          if (charContent.includes(specialChar)) {
            return true;
          }
        }
        i = closeParenIndex !== -1 ? closeParenIndex + 1 : content.length;
      } else {
        i++;
      }
    }
    return false;
  }

  /**
   * Test if a string matches the PRX pattern
   * @param {string} prxPattern - The Pretty RegEx pattern
   * @param {string} testString - String to test
   * @param {string} flags - RegExp flags
   * @returns {boolean} - Whether the string matches
   */
  test(prxPattern, testString, flags = '') {
    const regex = this.compile(prxPattern, flags);
    return regex.test(testString);
  }

  /**
   * Find matches in a string using PRX pattern
   * @param {string} prxPattern - The Pretty RegEx pattern
   * @param {string} testString - String to search
   * @param {string} flags - RegExp flags
   * @returns {Array} - Array of matches
   */
  match(prxPattern, testString, flags = 'g') {
    const regex = this.compile(prxPattern, flags);
    return testString.match(regex) || [];
  }

  /**
   * Replace matches in a string using PRX pattern
   * @param {string} prxPattern - The Pretty RegEx pattern
   * @param {string} testString - String to search and replace
   * @param {string} replacement - Replacement string
   * @param {string} flags - RegExp flags
   * @returns {string} - String with replacements
   */
  replace(prxPattern, testString, replacement, flags = 'g') {
    const regex = this.compile(prxPattern, flags);
    return testString.replace(regex, replacement);
  }

  /**
   * Validate a pattern and return detailed results
   * @param {string} pattern - The pattern to validate
   * @returns {Object} - Validation result with errors, warnings, and suggestions
   */
  validate(pattern) {
    return this.validator.validate(pattern);
  }

  /**
   * Get suggestions for improving a pattern
   * @param {string} pattern - The pattern to analyze
   * @returns {Array} - Array of suggestions
   */
  getSuggestions(pattern) {
    return this.validator.getSuggestions(pattern);
  }

  /**
   * Debug a pattern by showing the compilation steps
   * @param {string} pattern - The pattern to debug
   * @returns {Object} - Debug information
   */
  debug(pattern) {
    try {
      const validation = this.validator.validate(pattern);
      const parsed = this.parse(pattern);
      const compiled = new RegExp(parsed);
      
      return {
        original: pattern,
        parsed,
        compiled: compiled.toString(),
        validation,
        suggestions: this.validator.getSuggestions(pattern),
        isValid: validation.isValid && compiled.toString() !== '/(?:)/'
      };
    } catch (error) {
      return {
        original: pattern,
        error: error.message,
        isValid: false
      };
    }
  }

  /**
   * Get information about supported features
   * @returns {Object} - Feature information
   */
  getFeatures() {
    return {
      characterClasses: Object.keys(this.charClasses),
      quantifiers: Object.keys(this.quantifiers),
      operators: ['&', '+', '|'],
      anchors: ['start', 'end', 'word', 'notword'],
      literals: ['char()', 'string()', 'space', 'tab', 'newline'],
      stringMatching: {
        basic: 'string(text) - Match exact string',
        caseInsensitive: 'string(text, caseinsensitive) - Case insensitive match',
        caseSensitive: 'string(text, casesensitive) - Case sensitive match (default)',
        multicase: 'string(text, multicase) - Match all case variations'
      },
      ranges: 'Supports numeric and character ranges (e.g., [0-9], [a-z], [a-E])'
    };
  }
}

// Static methods for convenience
PrettyRegex.compile = function(prxPattern, flags) {
  const instance = new PrettyRegex();
  return instance.compile(prxPattern, flags);
};

PrettyRegex.test = function(prxPattern, testString, flags) {
  const instance = new PrettyRegex();
  return instance.test(prxPattern, testString, flags);
};

PrettyRegex.match = function(prxPattern, testString, flags) {
  const instance = new PrettyRegex();
  return instance.match(prxPattern, testString, flags);
};

PrettyRegex.replace = function(prxPattern, testString, replacement, flags) {
  const instance = new PrettyRegex();
  return instance.replace(prxPattern, testString, replacement, flags);
};

PrettyRegex.validate = function(pattern) {
  const instance = new PrettyRegex();
  return instance.validate(pattern);
};

PrettyRegex.debug = function(pattern) {
  const instance = new PrettyRegex();
  return instance.debug(pattern);
};

PrettyRegex.getSuggestions = function(pattern) {
  const instance = new PrettyRegex();
  return instance.getSuggestions(pattern);
};

PrettyRegex.getFeatures = function() {
  const instance = new PrettyRegex();
  return instance.getFeatures();
};

module.exports = PrettyRegex; 