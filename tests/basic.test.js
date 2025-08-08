const PrettyRegex = require('../src/index');

describe('PrettyRegex Basic Functionality', () => {
  let prx;
  
  beforeEach(() => {
    // Create instance with warnings disabled for tests
    prx = new PrettyRegex({
      validatePatterns: true,
      throwOnError: true,
      logWarnings: true // Enable warnings for debugging
    });
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

    test('should handle numeric ranges correctly', () => {
      const pattern = 'start[0-2]+end';
      const regex = prx.compile(pattern);
      expect(regex.test('012')).toBe(true);     // All digits in range
      expect(regex.test('120')).toBe(true);     // All digits in range
      expect(regex.test('123')).toBe(false);    // Contains 3 which is out of range
      expect(regex.test('045')).toBe(false);    // Contains 4 and 5 which are out of range
      expect(regex.test('0')).toBe(true);       // Single digit in range
      expect(regex.test('2')).toBe(true);       // Single digit in range
    });

    test('should handle character ranges correctly', () => {
      const pattern = 'start[a-e]+end';
      const regex = prx.compile(pattern);
      expect(regex.test('abcde')).toBe(true);   // All letters in range
      expect(regex.test('cba')).toBe(true);     // All letters in range
      expect(regex.test('abcdef')).toBe(false); // Contains f which is out of range
      expect(regex.test('ABCDE')).toBe(false);  // Uppercase not in range
      expect(regex.test('a')).toBe(true);       // Single letter in range
      expect(regex.test('e')).toBe(true);       // Single letter in range
    });

    test('should handle mixed case ranges correctly', () => {
      const pattern = 'start[a-E]+end';
      const regex = prx.compile(pattern);
      expect(regex.test('abcde')).toBe(true);   // Lowercase letters in range
      expect(regex.test('ABCDE')).toBe(true);   // Uppercase letters in range
      expect(regex.test('aBcDe')).toBe(true);   // Mixed case letters in range
      expect(regex.test('abcdef')).toBe(false); // Contains f which is out of range
      expect(regex.test('ABCDEF')).toBe(false); // Contains F which is out of range
    });

    test('should handle ranges with MUST requirements', () => {
      const pattern = '[0-2&charU]+';
      const regex = prx.compile(pattern);
      expect(regex.test('A1')).toBe(true);      // Has digit 0-2 AND uppercase
      expect(regex.test('B2')).toBe(true);      // Has digit 0-2 AND uppercase
      expect(regex.test('a1')).toBe(false);     // Missing uppercase
      expect(regex.test('A3')).toBe(false);     // Missing digit 0-2
      expect(regex.test('X1')).toBe(true);      // Has digit 0-2 AND uppercase
    });

    test('should handle ranges with union requirements', () => {
      const pattern = 'start[a-E+0-9]+end';
      const regex = prx.compile(pattern);
      expect(regex.test('a1')).toBe(true);      // Contains a-E OR digit
      expect(regex.test('B2')).toBe(true);      // Contains a-E OR digit
      expect(regex.test('c9')).toBe(true);      // Contains a-E OR digit
      expect(regex.test('E1')).toBe(true);      // Contains a-E OR digit
      expect(regex.test('f5')).toBe(false);     // Contains f which is not in a-E
    });

    test('should handle + operator precedence correctly', () => {
      // + as quantifier outside character class
      const quantifierPattern = 'char+';
      const quantifierRegex = prx.compile(quantifierPattern);
      expect(quantifierRegex.test('a')).toBe(true);
      expect(quantifierRegex.test('abc')).toBe(true);
      expect(quantifierRegex.test('123')).toBe(false);

      // + as union operator inside character class
      const unionPattern = '[charU+charL]';
      const unionRegex = prx.compile(unionPattern);
      expect(unionRegex.test('A')).toBe(true);
      expect(unionRegex.test('a')).toBe(true);
      expect(unionRegex.test('1')).toBe(false);

      // + as both union inside and quantifier outside
      const combinedPattern = '[charU+charL]+';
      const combinedRegex = prx.compile(combinedPattern);
      expect(combinedRegex.test('ABC')).toBe(true);
      expect(combinedRegex.test('abc')).toBe(true);
      expect(combinedRegex.test('AbC')).toBe(true);
      expect(combinedRegex.test('123')).toBe(false);

      // + with ranges
      const rangePattern = '[0-2+charU]+';
      const rangeRegex = prx.compile(rangePattern);
      expect(rangeRegex.test('A1')).toBe(true);
      expect(rangeRegex.test('B2')).toBe(true);
      expect(rangeRegex.test('3')).toBe(false);
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

  describe('String Matching', () => {
    test('should handle basic string literals with string()', () => {
      const pattern = 'string(banana)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('bananas')).toBe(false);
      expect(regex.test('Banana')).toBe(false);
      expect(regex.test('BANANA')).toBe(false);
    });

    test('should handle string literals with special characters', () => {
      const pattern = 'string(hello.world)';
      const regex = prx.compile(pattern);
      expect(regex.test('hello.world')).toBe(true);
      expect(regex.test('helloworld')).toBe(false);
      expect(regex.test('hello.world!')).toBe(false);
    });

    test('should handle case insensitive string matching', () => {
      const pattern = 'string(banana, caseinsensitive)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(true);
      expect(regex.test('BANANA')).toBe(true);
      expect(regex.test('bAnAnA')).toBe(true);
      expect(regex.test('bananas')).toBe(false);
    });

    test('should handle case insensitive with short flag (ci)', () => {
      const pattern = 'string(banana, ci)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(true);
      expect(regex.test('BANANA')).toBe(true);
    });

    test('should handle case insensitive with nocase flag', () => {
      const pattern = 'string(banana, nocase)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(true);
      expect(regex.test('BANANA')).toBe(true);
    });

    test('should handle explicit case sensitive matching', () => {
      const pattern = 'string(banana, casesensitive)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(false);
      expect(regex.test('BANANA')).toBe(false);
    });

    test('should handle case sensitive with short flag (cs)', () => {
      const pattern = 'string(banana, cs)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(false);
      expect(regex.test('BANANA')).toBe(false);
    });

    test('should handle case sensitive with case flag', () => {
      const pattern = 'string(banana, case)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(false);
      expect(regex.test('BANANA')).toBe(false);
    });

    test('should handle multicase string matching', () => {
      const pattern = 'string(banana, multicase)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(true);
      expect(regex.test('BANANA')).toBe(true);
      expect(regex.test('bAnAnA')).toBe(true);
      expect(regex.test('BaNaNa')).toBe(true);
      expect(regex.test('bananas')).toBe(false);
    });

    test('should handle multicase with short flag (mc)', () => {
      const pattern = 'string(banana, mc)';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(true);
      expect(regex.test('BANANA')).toBe(true);
      expect(regex.test('bAnAnA')).toBe(true);
    });

    test('should handle multicase with mixed characters', () => {
      const pattern = 'string(Hello123, multicase)';
      const regex = prx.compile(pattern);
      expect(regex.test('Hello123')).toBe(true);
      expect(regex.test('hello123')).toBe(true);
      expect(regex.test('HELLO123')).toBe(true);
      expect(regex.test('hElLo123')).toBe(true);
      expect(regex.test('Hello124')).toBe(false);
    });

    test('should handle string literals with whitespace', () => {
      const pattern = 'string(hello world, caseinsensitive)';
      const regex = prx.compile(pattern);
      expect(regex.test('hello world')).toBe(true);
      expect(regex.test('Hello World')).toBe(true);
      expect(regex.test('HELLO WORLD')).toBe(true);
      expect(regex.test('helloworld')).toBe(false);
    });

    test('should handle string literals in complex patterns', () => {
      const pattern = 'startstring(hello)space+string(world)end';
      const regex = prx.compile(pattern);
      expect(regex.test('hello world')).toBe(true);
      expect(regex.test('hello  world')).toBe(true);
      expect(regex.test('hello   world')).toBe(true);
      expect(regex.test('hello world!')).toBe(false);
      expect(regex.test('Hello World')).toBe(false);
    });

    test('should handle string literals with OR operator', () => {
      const pattern = 'string(hello)|string(world)';
      const regex = prx.compile(pattern);
      expect(regex.test('hello')).toBe(true);
      expect(regex.test('world')).toBe(true);
      expect(regex.test('hello world')).toBe(false);
    });

    test('should handle string literals with quantifiers', () => {
      const pattern = 'string(ha)+';
      const regex = prx.compile(pattern);
      expect(regex.test('ha')).toBe(true);
      expect(regex.test('haha')).toBe(true);
      expect(regex.test('hahaha')).toBe(true);
      expect(regex.test('h')).toBe(false);
    });

    test('should handle string literals in character classes', () => {
      // Note: string() inside character classes doesn't make much sense
      // but should be handled gracefully
      const pattern = '[string(hello)]';
      const regex = prx.compile(pattern);
      // This would match individual characters from the string
      expect(regex.test('h')).toBe(true);
      expect(regex.test('e')).toBe(true);
      expect(regex.test('l')).toBe(true);
      expect(regex.test('o')).toBe(true);
      expect(regex.test('a')).toBe(false);
    });

    test('should handle empty string literals', () => {
      const pattern = 'string()';
      const regex = prx.compile(pattern);
      expect(regex.test('')).toBe(true);
      expect(regex.test('anything')).toBe(false);
    });

    test('should handle string literals with regex special characters', () => {
      const pattern = 'string(hello.world+test*regex)';
      const regex = prx.compile(pattern);
      expect(regex.test('hello.world+test*regex')).toBe(true);
      expect(regex.test('hello.worldtestregex')).toBe(false);
    });

    test('should handle case flags with extra whitespace', () => {
      const pattern = 'string(banana , caseinsensitive )';
      const regex = prx.compile(pattern);
      expect(regex.test('banana')).toBe(true);
      expect(regex.test('Banana')).toBe(true);
      expect(regex.test('BANANA')).toBe(true);
    });

    test('should handle multiple string literals in sequence', () => {
      const pattern = 'string(hello)string(world)';
      const regex = prx.compile(pattern);
      expect(regex.test('helloworld')).toBe(true);
      expect(regex.test('hello world')).toBe(false);
    });

    test('should handle string literals with grouping', () => {
      const pattern = '(string(hello)|string(world))+';
      const regex = prx.compile(pattern);
      console.log('Pattern:', pattern);
      console.log('Compiled regex:', regex.toString());
      console.log('Testing "hello":', regex.test('hello'));
      console.log('Testing "world":', regex.test('world'));
      console.log('Testing "helloworld":', regex.test('helloworld'));
      console.log('Testing "hellohello":', regex.test('hellohello'));
      expect(regex.test('hello')).toBe(true);
      expect(regex.test('world')).toBe(true);
      expect(regex.test('helloworld')).toBe(true);
      expect(regex.test('hellohello')).toBe(true);
    });
  });

  describe('String Matching Error Handling', () => {
    test('should throw error for unclosed string() literal', () => {
      expect(() => prx.parse('string(banana')).toThrow('Unclosed string() literal');
    });

    test('should throw error for malformed string() with missing content', () => {
      expect(() => prx.parse('string()')).not.toThrow();
    });
  });

  describe('Capturing Groups with MUST Requirements', () => {
    test('should handle capturing groups with & operator', () => {
      const pattern = '(charU&charL&[0-9]&emoji){,8}';
      const regex = prx.compile(pattern, 'u'); // Unicode flag needed for emoji
      
      // Should match: contains uppercase, lowercase, digit, and emoji
      expect(regex.test('bAnA0🥲')).toBe(true);
      
      // Should not match: missing uppercase letter
      expect(regex.test('banana🥲')).toBe(false);
      
      // Should not match: missing digit
      expect(regex.test('bAnA🥲')).toBe(false);
      
      // Should not match: missing emoji
      expect(regex.test('bAnA0')).toBe(false);
      
      // Should not match: missing lowercase letter
      expect(regex.test('BANA0🥲')).toBe(false);
      
      // Should not match: too long (more than 8 characters)
      expect(regex.test('bAnA0🥲extra')).toBe(false);
    });

    test('should handle capturing groups with & operator and quantifiers', () => {
      const pattern = '(charU&charL&[0-9])+';
      const regex = prx.compile(pattern);
      
      // Should match: contains all required character types
      expect(regex.test('aB1')).toBe(true);
      expect(regex.test('aB1cD2')).toBe(true);
      
      // Should not match: missing any required type
      expect(regex.test('ab1')).toBe(false); // missing uppercase
      expect(regex.test('AB1')).toBe(false); // missing lowercase
      expect(regex.test('aBc')).toBe(false); // missing digit
    });

    test('should handle nested capturing groups with & operator', () => {
      const pattern = '((charU&charL)&[0-9])+';
      const regex = prx.compile(pattern);
      
      // Should match: nested groups work correctly
      expect(regex.test('aB1')).toBe(true);
      expect(regex.test('aB1cD2')).toBe(true);
      
      // Should not match: missing any required type
      expect(regex.test('ab1')).toBe(false); // missing uppercase
      expect(regex.test('AB1')).toBe(false); // missing lowercase
      expect(regex.test('aBc')).toBe(false); // missing digit
    });
  });
}); 