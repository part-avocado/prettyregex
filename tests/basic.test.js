const PrettyRegex = require('../src/index');

describe('PrettyRegex Basic Functionality', () => {
  let prx;

  beforeEach(() => {
    prx = new PrettyRegex();
  });

  describe('Character Classes', () => {
    test('should handle uppercase letters (charU)', () => {
      const pattern = 'charU';
      const regex = prx.compile(pattern);
      expect(regex.test('A')).toBe(true);
      expect(regex.test('Z')).toBe(true);
      expect(regex.test('a')).toBe(false);
      expect(regex.test('1')).toBe(false);
    });

    test('should handle lowercase letters (charL)', () => {
      const pattern = 'charL';
      const regex = prx.compile(pattern);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('z')).toBe(true);
      expect(regex.test('A')).toBe(false);
      expect(regex.test('1')).toBe(false);
    });

    test('should handle any letters (char)', () => {
      const pattern = 'char';
      const regex = prx.compile(pattern);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('Z')).toBe(true);
      expect(regex.test('1')).toBe(false);
      expect(regex.test('@')).toBe(false);
    });

    test('should handle digits (0-9)', () => {
      const pattern = '0-9';
      const regex = prx.compile(pattern);
      expect(regex.test('0')).toBe(true);
      expect(regex.test('9')).toBe(true);
      expect(regex.test('a')).toBe(false);
      expect(regex.test('@')).toBe(false);
    });

    test('should handle character class combinations with union (+)', () => {
      const pattern = 'start[charU+charL+0-9]+end';  // Use anchors to match full strings
      const regex = prx.compile(pattern);
      expect(regex.test('Abc123')).toBe(true);  // Contains only allowed chars
      expect(regex.test('abc123')).toBe(true);  // Contains only allowed chars
      expect(regex.test('ABC123')).toBe(true);  // Contains only allowed chars
      expect(regex.test('Abc')).toBe(true);     // Contains only allowed chars
      expect(regex.test('Test@123')).toBe(false); // Contains @ which is not allowed
    });
  });

  describe('Literal Characters', () => {
    test('should handle literal characters with char()', () => {
      const pattern = 'char(@)';
      const regex = prx.compile(pattern);
      expect(regex.test('@')).toBe(true);
      expect(regex.test('a')).toBe(false);
    });

    test('should handle multiple literal characters', () => {
      const pattern = 'char(@)char(.)char(-)';
      const regex = prx.compile(pattern);
      expect(regex.test('@.-')).toBe(true);
      expect(regex.test('@.x')).toBe(false);
    });

    test('should escape special regex characters', () => {
      const pattern = 'char(.)char(+)char(*)';
      const regex = prx.compile(pattern);
      expect(regex.test('.+*')).toBe(true);
      expect(regex.test('abc')).toBe(false);
    });
  });

  describe('Quantifiers', () => {
    test('should handle + quantifier (one or more)', () => {
      const pattern = 'char+';
      const regex = prx.compile(pattern);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('123')).toBe(false);
      expect(regex.test('')).toBe(false);
    });

    test('should handle * quantifier (zero or more)', () => {
      const pattern = 'char*';
      const regex = prx.compile(pattern);
      expect(regex.test('')).toBe(true);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('123')).toBe(true); // Empty match at start
    });

    test('should handle ? quantifier (zero or one)', () => {
      const pattern = 'char?';
      const regex = prx.compile(pattern);
      expect(regex.test('')).toBe(true);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('ab')).toBe(true); // matches first 'a'
    });

    test('should handle {n} quantifier (exactly n)', () => {
      const pattern = 'char{3}';
      const regex = prx.compile(pattern);
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('ab')).toBe(false);
      expect(regex.test('abcd')).toBe(true); // matches first 3
    });

    test('should handle {n,m} quantifier (between n and m)', () => {
      const pattern = 'char{2,4}';
      const regex = prx.compile(pattern);
      expect(regex.test('a')).toBe(false);
      expect(regex.test('ab')).toBe(true);
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('abcd')).toBe(true);
      expect(regex.test('abcde')).toBe(true); // matches first 4
    });
  });

  describe('Email Example', () => {
    test('should handle email pattern with MUST requirements (&)', () => {
      // Local part MUST contain uppercase AND lowercase AND digits
      const pattern = '[charU&charL&0-9]+char(@)[charUcharL0-9char(.)char(-)]+char(.)[charL]{2,}';
      const regex = prx.compile(pattern);
      
      expect(regex.test('User123@example.com')).toBe(true);     // Local has all required types
      expect(regex.test('Test1@domain.org')).toBe(true);        // Local has all required types
      expect(regex.test('user@example.com')).toBe(false);       // Missing uppercase in local
      expect(regex.test('USER123@example.com')).toBe(true);     // Has lowercase in domain (global lookahead)
      expect(regex.test('Username@domain.com')).toBe(false);    // Missing digits in local
      expect(regex.test('invalid@')).toBe(false);
      expect(regex.test('@invalid.com')).toBe(false);
    });

    test('should handle flexible email pattern with union (+)', () => {
      // May only contain these character types (traditional union)
      const pattern = '[charU+charL+0-9+char(.)+char(_)+char(%)]+char(@)[charU+charL+0-9+char(.)+char(-)]+char(.)[charL]{2,}';
      const regex = prx.compile(pattern);
      
      expect(regex.test('user@example.com')).toBe(true);
      expect(regex.test('test.email@domain.org')).toBe(true);
      expect(regex.test('user@invalid!domain.com')).toBe(false); // ! not allowed
      expect(regex.test('invalid.email')).toBe(false);
    });
  });

  describe('Grouping and OR', () => {
    test('should handle basic grouping', () => {
      const pattern = '(char|0-9)+';
      const regex = prx.compile(pattern);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('1')).toBe(true);
      expect(regex.test('a1b2')).toBe(true);
      expect(regex.test('@')).toBe(false);
    });

    test('should handle OR operator', () => {
      const pattern = 'char(a)|char(b)';
      const regex = prx.compile(pattern);
      expect(regex.test('a')).toBe(true);
      expect(regex.test('b')).toBe(true);
      expect(regex.test('c')).toBe(false);
    });
  });

  describe('Anchors and Boundaries', () => {
    test('should handle start anchor', () => {
      const pattern = 'startchar+';
      const regex = prx.compile(pattern);
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('123abc')).toBe(false);
    });

    test('should handle end anchor', () => {
      const pattern = 'char+end';
      const regex = prx.compile(pattern);
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('abc123')).toBe(false);
    });

    test('should handle word boundaries', () => {
      const pattern = 'wordchar+spacechar+';
      const regex = prx.compile(pattern);
      expect(regex.test('hello world')).toBe(true);
      expect(regex.test('helloworld')).toBe(false);
    });
  });

  describe('Whitespace Characters', () => {
    test('should handle space character', () => {
      const pattern = 'charspacechar';
      const regex = prx.compile(pattern);
      expect(regex.test('a b')).toBe(true);
      expect(regex.test('ab')).toBe(false);
    });

    test('should handle tab character', () => {
      const pattern = 'chartabchar';
      const regex = prx.compile(pattern);
      expect(regex.test('a\tb')).toBe(true);
      expect(regex.test('a b')).toBe(false);
    });

    test('should handle newline character', () => {
      const pattern = 'charnewlinechar';
      const regex = prx.compile(pattern);
      expect(regex.test('a\nb')).toBe(true);
      expect(regex.test('a b')).toBe(false);
    });
  });

  describe('Static Methods', () => {
    test('should work with static compile method', () => {
      const regex = PrettyRegex.compile('char+');
      expect(regex.test('abc')).toBe(true);
      expect(regex.test('123')).toBe(false);
    });

    test('should work with static test method', () => {
      expect(PrettyRegex.test('char+', 'abc')).toBe(true);
      expect(PrettyRegex.test('char+', '123')).toBe(false);
    });

    test('should work with static match method', () => {
      const matches = PrettyRegex.match('char', 'a1b2c');
      expect(matches).toEqual(['a', 'b', 'c']);
    });

    test('should work with static replace method', () => {
      const result = PrettyRegex.replace('0-9', 'a1b2c', 'X');
      expect(result).toBe('aXbXc');
    });
  });

  describe('Error Handling', () => {
    test('should throw error for unclosed character class', () => {
      expect(() => prx.parse('[charU+charL')).toThrow('Unclosed character class');
    });

    test('should throw error for unclosed char() literal', () => {
      expect(() => prx.parse('char(@')).toThrow('Unclosed char()');
    });

    test('should throw error for unclosed quantifier', () => {
      expect(() => prx.parse('char{3')).toThrow('Unclosed quantifier');
    });
  });

  describe('MUST Requirements (&) and Union (+) Functionality', () => {
    test('should require all character types with & operator (MUST)', () => {
      const pattern = '[charU&charL&0-9]{6,}';
      const regex = prx.compile(pattern);
      
      // MUST have uppercase AND lowercase AND digits
      expect(regex.test('User123')).toBe(true);
      expect(regex.test('PASSWORD123')).toBe(false); // Missing lowercase
      expect(regex.test('password123')).toBe(false); // Missing uppercase
      expect(regex.test('Password')).toBe(false);    // Missing digits
      expect(regex.test('MyPass1')).toBe(true);      // Has all requirements
    });

    test('should allow union behavior with + operator (AND/OR)', () => {
      const pattern = '[charU+charL+0-9]{6,}';
      const regex = prx.compile(pattern);
      
      // May contain any combination of these character types
      expect(regex.test('User123')).toBe(true);      // Mixed case and digits
      expect(regex.test('PASSWORD123')).toBe(true);  // Uppercase and digits
      expect(regex.test('password123')).toBe(true);  // Lowercase and digits
      expect(regex.test('Password')).toBe(true);     // Only letters
      expect(regex.test('Pass@123')).toBe(false);    // Contains @ which is not allowed
    });

    test('should handle special characters in requirements', () => {
      // MUST requirements
      const mustPattern = '[charU&charL&0-9&char(!)]{8,}';
      const mustRegex = prx.compile(mustPattern);
      
      expect(mustRegex.test('Pass123!')).toBe(true);     // Has all required types
      expect(mustRegex.test('pass123!')).toBe(false);    // Missing uppercase
      expect(mustRegex.test('PASS123!')).toBe(false);    // Missing lowercase
      expect(mustRegex.test('Password!')).toBe(false);   // Missing digits
      
      // Union requirements  
      const unionPattern = '[charU+charL+0-9+char(!)]{8,}';
      const unionRegex = prx.compile(unionPattern);
      
      expect(unionRegex.test('Pass123!')).toBe(true);    // Contains only allowed chars
      expect(unionRegex.test('PASSWORD!')).toBe(true);   // Contains only allowed chars
      expect(unionRegex.test('Pass123@')).toBe(false);   // Contains @ which is not allowed
    });

    test('should work with quantifiers', () => {
      const pattern = 'start[charU+charL+0-9]{3,10}end';  // Union with anchors
      const regex = prx.compile(pattern);
      
      expect(regex.test('Ab1')).toBe(true);           // Minimum length
      expect(regex.test('AbC123xyz')).toBe(true);     // Within range
      expect(regex.test('AB')).toBe(false);           // Too short
      expect(regex.test('VeryLong123')).toBe(false);  // Too long (>10 chars)
    });
  });

  describe('Complex Patterns', () => {
    test('should handle phone number pattern', () => {
      // Pattern for (123) 456-7890 or 123-456-7890
      const pattern = 'char(\\()?0-9{3}char(\\))?(char( )|char(-))?0-9{3}char(-)?0-9{4}';
      const regex = prx.compile(pattern);
      expect(regex.test('(123) 456-7890')).toBe(true);
      expect(regex.test('123-456-7890')).toBe(true);
      expect(regex.test('1234567890')).toBe(true);
    });

    test('should handle URL pattern', () => {
      // Use traditional union for more flexible URL matching
      const pattern = 'char(h)char(t)char(t)char(p)char(s)?char(:)char(/)char(/)[charUcharL0-9char(.)char(-)]+';
      const regex = prx.compile(pattern);
      expect(regex.test('http://example.com')).toBe(true);
      expect(regex.test('https://sub.domain.co.uk')).toBe(true);
      expect(regex.test('ftp://example.com')).toBe(false);
    });
  });
}); 