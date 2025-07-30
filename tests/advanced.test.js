const AdvancedPrettyRegex = require('../src/advanced');

describe('AdvancedPrettyRegex', () => {
  let advancedPrx;

  beforeEach(() => {
    advancedPrx = new AdvancedPrettyRegex();
  });

  describe('Lookaheads and Lookbehinds', () => {
    test('should handle positive lookahead', () => {
      const pattern = 'lookahead(\\d)\\w';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?=\\d)\\w');
    });

    test('should handle negative lookahead', () => {
      const pattern = 'neglookahead(\\d)\\w';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?!\\d)\\w');
    });

    test('should handle positive lookbehind', () => {
      const pattern = 'lookbehind(\\w)\\d';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?<=\\w)\\d');
    });

    test('should handle negative lookbehind', () => {
      const pattern = 'neglookbehind(\\w)\\d';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?<!\\w)\\d');
    });
  });

  describe('Named Groups and Non-capturing Groups', () => {
    test('should handle named groups', () => {
      const pattern = 'namedgroup(word)\\w+';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?<word>\\w+');
    });

    test('should handle non-capturing groups', () => {
      const pattern = 'group\\w+';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?:\\w+');
    });
  });

  describe('Unicode Properties', () => {
    test('should handle unicode properties', () => {
      const pattern = 'unicode(L)';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('\\p{L}');
    });

    test('should handle negated unicode properties', () => {
      const pattern = 'notunicode(L)';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('\\P{L}');
    });

    test('should handle predefined unicode categories', () => {
      const pattern = 'letter mark number';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('\\p{L} \\p{M} \\p{N}');
    });
  });

  describe('Possessive Quantifiers', () => {
    test('should handle possessive plus', () => {
      const pattern = 'possessive+';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('++');
    });

    test('should handle possessive star', () => {
      const pattern = 'possessive*';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('*+');
    });

    test('should handle possessive question', () => {
      const pattern = 'possessive?';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('?+');
    });
  });

  describe('Comments and Modifiers', () => {
    test('should handle comments', () => {
      const pattern = 'comment(this is a comment)';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?#this is a comment)');
    });

    test('should handle case insensitive mode', () => {
      const pattern = 'ignorecase';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?i)');
    });

    test('should handle multiline mode', () => {
      const pattern = 'multiline';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?m)');
    });
  });

  describe('Conditional Patterns', () => {
    test('should handle if-then-else patterns', () => {
      const pattern = 'if(\\d)then(\\w)else(\\D)';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?(\\d)\\w|\\D)');
    });

    test('should handle if-then patterns without else', () => {
      const pattern = 'if(\\d)then(\\w)';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?(\\d)\\w)');
    });
  });

  describe('Character Class Shortcuts', () => {
    test('should handle hexadecimal digits', () => {
      const pattern = 'hex';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('[0-9A-Fa-f]');
    });

    test('should handle binary digits', () => {
      const pattern = 'binary';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('[01]');
    });

    test('should handle ASCII characters', () => {
      const pattern = 'ascii';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('[\\x00-\\x7F]');
    });

    test('should handle emoji range', () => {
      const pattern = 'emoji';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('[\\u{1F600}-\\u{1F64F}]');
    });
  });

  describe('Common Patterns', () => {
    test('should handle email pattern', () => {
      const pattern = 'email';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
    });

    test('should handle URL pattern', () => {
      const pattern = 'url';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('https?:');
    });

    test('should handle IPv4 pattern', () => {
      const pattern = 'ipv4';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('25[0-5]');
    });

    test('should handle phone pattern', () => {
      const pattern = 'phone';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('[0-9]{3}');
    });
  });

  describe('Validation', () => {
    test('should detect unmatched parentheses', () => {
      const validation = advancedPrx.validateAdvanced('(abc');
      expect(validation.errors).toContain('Unmatched parentheses in pattern');
    });

    test('should warn about lookbehind support', () => {
      // Only warn if lookbehind is not supported
      if (!advancedPrx.supportsLookbehind()) {
        const validation = advancedPrx.validateAdvanced('lookbehind(test)');
        expect(validation.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should warn about unicode support', () => {
      // Only warn if unicode is not supported
      if (!advancedPrx.supportsUnicode()) {
        const validation = advancedPrx.validateAdvanced('unicode(L)');
        expect(validation.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should warn about recursive patterns', () => {
      const validation = advancedPrx.validateAdvanced('recurse');
      expect(validation.warnings).toContain('Recursive patterns can be slow and may cause stack overflow');
    });

    test('should warn about nested quantifiers', () => {
      const validation = advancedPrx.validateAdvanced('a*b*');
      expect(validation.warnings).toContain('Nested quantifiers detected - this may cause catastrophic backtracking');
    });
  });

  describe('Feature Support Detection', () => {
    test('should detect lookbehind support', () => {
      const supported = advancedPrx.supportsLookbehind();
      expect(typeof supported).toBe('boolean');
    });

    test('should detect unicode support', () => {
      const supported = advancedPrx.supportsUnicode();
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('Flag Suggestions', () => {
    test('should suggest unicode flag for unicode patterns', () => {
      const flags = advancedPrx.suggestFlags('unicode(L)');
      expect(flags).toContain('u');
    });

    test('should suggest multiline flag for anchors', () => {
      const flags = advancedPrx.suggestFlags('^test$');
      expect(flags).toContain('m');
    });

    test('should suggest case insensitive flag', () => {
      const flags = advancedPrx.suggestFlags('ignorecase');
      expect(flags).toContain('i');
    });

    test('should suggest dotall flag', () => {
      const flags = advancedPrx.suggestFlags('singleline');
      expect(flags).toContain('s');
    });

    test('should combine multiple flag suggestions', () => {
      const flags = advancedPrx.suggestFlags('unicode(L) multiline ignorecase');
      expect(flags).toContain('u');
      expect(flags).toContain('m');
      expect(flags).toContain('i');
    });
  });

  describe('Complex Advanced Patterns', () => {
    test('should handle complex email validation with lookbehind', () => {
      const pattern = 'lookbehind(\\w)@\\w+\\.\\w+';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?<=\\w)@\\w+\\.\\w+');
    });

    test('should handle password validation with lookaheads', () => {
      const pattern = 'lookahead(.*\\d)lookahead(.*[A-Z])lookahead(.*[a-z]).{8,}';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{8,}');
    });

    test('should handle credit card validation with grouping', () => {
      const pattern = 'creditcard';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('(?:4[0-9]{12}');
    });
  });

  describe('Atomic Groups and Backtracking Control', () => {
    test('should handle atomic groups', () => {
      const pattern = 'atomic\\d+';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?>\\d+');
    });

    test('should handle cut (commit)', () => {
      const pattern = 'cut';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(*COMMIT)');
    });

    test('should handle fail', () => {
      const pattern = 'fail';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(*FAIL)');
    });

    test('should handle accept', () => {
      const pattern = 'accept';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(*ACCEPT)');
    });
  });

  describe('Word Boundary Variations', () => {
    test('should handle word start boundary', () => {
      const pattern = 'wordstart';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('\\b(?=\\w)');
    });

    test('should handle word end boundary', () => {
      const pattern = 'wordend';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('(?<=\\w)\\b');
    });
  });

  describe('Date and Time Patterns', () => {
    test('should handle 24-hour time format', () => {
      const pattern = 'time24';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('[01]?[0-9]|2[0-3]');
    });

    test('should handle 12-hour time format', () => {
      const pattern = 'time12';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('[AaPp][Mm]');
    });

    test('should handle date format', () => {
      const pattern = 'date';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('19|20');
    });
  });

  describe('Technical Patterns', () => {
    test('should handle UUID pattern', () => {
      const pattern = 'uuid';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('[0-9a-f]{8}-[0-9a-f]{4}');
    });

    test('should handle hex color pattern', () => {
      const pattern = 'hexcolor';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toBe('#(?:[0-9a-fA-F]{3}){1,2}\\b');
    });

    test('should handle SSN pattern', () => {
      const pattern = 'ssn';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('[0-9]{3}-?[0-9]{2}-?[0-9]{4}');
    });

    test('should handle zip code pattern', () => {
      const pattern = 'zipcode';
      const result = advancedPrx.parseAdvanced(pattern);
      expect(result).toContain('[0-9]{5}(?:-[0-9]{4})?');
    });
  });
}); 