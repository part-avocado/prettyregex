# Pretty RegEx (PRX)

A simplified syntax for creating regular expressions with human-readable patterns. Pretty RegEx makes regex accessible by providing intuitive keywords and structure while maintaining the full power of regular expressions.

## Features

- **Human-readable syntax**: Use words like `charU`, `charL`, `0-9` instead of cryptic regex symbols
- **Comprehensive character classes**: Built-in shortcuts for common patterns
- **Advanced regex features**: Lookaheads, lookbehinds, Unicode support, and more
- **TypeScript support**: Full type definitions included
- **Zero dependencies**: Lightweight and fast
- **Common patterns**: Pre-built patterns for emails, URLs, phone numbers, etc.
- **Error handling**: Clear error messages with position information

## Installation

```bash
npm install pretty-regex
```

## 🎯 Quick Start

```javascript
const PrettyRegex = require('pretty-regex');

// Basic usage
const emailPattern = '[charU+charL+0-9]+char(@)[charU+charL+0-9]+char(.)[charL]{2,}';
const emailRegex = PrettyRegex.compile(emailPattern);
console.log(emailRegex.test('user@example.com')); // true

// With validation and error handling
const prx = new PrettyRegex({
  validatePatterns: true,
  throwOnError: true,
  logWarnings: true
});

try {
  const regex = prx.compile('[charU&charL&0-9]{8,}');
  console.log('Strong password pattern compiled successfully');
} catch (error) {
  console.log('Validation error:', error.message);
  console.log('Suggestion:', error.details.suggestion);
}
```

## Syntax Guide

### Character Classes

| PRX Syntax | Regex Equivalent | Description |
|------------|------------------|-------------|
| `charU` | `[A-Z]` | Uppercase letters |
| `charL` | `[a-z]` | Lowercase letters |
| `char` | `[a-zA-Z]` | Any letter |
| `digit` | `[0-9]` | Digits (alternative) |
| `space` | ` ` | Literal space |
| `tab` | `\t` | Tab character |
| `newline` | `\n` | Newline character |
| `whitespace` | `\s` | Any whitespace |
| `wordchar` | `\w` | Word characters |
| `any` | `.` | Any character |

### Character Ranges

You can use traditional character ranges inside square brackets:

| PRX Syntax | Regex Equivalent | Description |
|------------|------------------|-------------|
| `[0-2]` | `[0-2]` | Digits 0, 1, 2 |
| `[5-9]` | `[5-9]` | Digits 5, 6, 7, 8, 9 |
| `[a-e]` | `[a-e]` | Lowercase letters a through e |
| `[A-E]` | `[A-E]` | Uppercase letters A through E |
| `[a-E]` | `[a-eA-E]` | Mixed case range (a-e and A-E) |
| `[a-z]` | `[a-z]` | All lowercase letters |
| `[A-Z]` | `[A-Z]` | All uppercase letters |

**Note**: Ranges must be in ascending order (e.g., `[0-9]` works, `[9-0]` doesn't).

### Operator Precedence

The `+` character has different meanings based on context:
- **Outside character classes**: `+` is a **quantifier** (one or more)
- **Inside character classes**: `+` is a **union operator** (OR)

Examples:
```javascript
'char+'           // Quantifier: one or more letters
'[charU+charL]'   // Union: uppercase OR lowercase
'[charU+charL]+'  // Union inside + quantifier outside = one or more letters
'[0-2+charU]+'    // Range + union + quantifier = one or more digits 0-2 OR uppercase
```

### Quantifiers

| PRX Syntax | Regex Equivalent | Description |
|------------|------------------|-------------|
| `+` | `+` | One or more (quantifier) |
| `*` | `*` | Zero or more |
| `?` | `?` | Zero or one |
| `{3}` | `{3}` | Exactly 3 times |
| `{2,5}` | `{2,5}` | Between 2 and 5 times |

### Anchors and Boundaries

| PRX Syntax | Regex Equivalent | Description |
|------------|------------------|-------------|
| `start` | `^` | Start of string |
| `end` | `$` | End of string |
| `word` | `\b` | Word boundary |
| `notword` | `\B` | Non-word boundary |

### Literal Characters

Use `char(x)` to match literal characters that might have special meaning:

```javascript
// Match literal parentheses, dots, and plus signs
const pattern = 'char(()0-9{3}char()) 0-9{3}char(-)0-9{4}';
// Matches: (123) 456-7890
```

### Character Class Combinations

#### MUST Requirements (`&` operator)

The `&` operator inside square brackets creates **MUST requirements** - the string must contain ALL specified character types:

```javascript
const pattern = '[charU&charL&0-9]';
// String MUST contain: uppercase letters AND lowercase letters AND digits
// Examples: "User123" ✅, "user123" ❌ (missing uppercase), "USER123" ❌ (missing lowercase)

const strongPassword = '[charU&charL&0-9&char(!)]{8,}';
// Password MUST contain uppercase, lowercase, digits, and exclamation mark

// Using ranges with MUST requirements
const digitRange = '[0-2&charU]+';
// MUST contain digits 0-2 AND uppercase letters
// Examples: "A1" ✅, "B2" ✅, "a1" ❌ (missing uppercase), "A3" ❌ (3 not in range)
```

#### AND/OR Union (`+` operator)

The `+` operator creates a **union** - may only contain these character types:

```javascript
const pattern = '[charU+charL+0-9]';
// May only contain: uppercase OR lowercase OR digits (traditional union)
// Examples: "User123" ✅, "user123" ✅, "Test@123" ❌ (@ not allowed)

const emailPart = '[charU+charL+0-9+char(.)+char(-)]';
// May only contain letters, numbers, dots, and dashes

// Using ranges with Union requirements
const mixedRange = '[a-E+0-9]+';
// May only contain letters a-E (both cases) OR digits
// Examples: "a1" ✅, "B2" ✅, "c9" ✅, "f5" ❌ (f not in a-E range)
```

#### Simple Character Classes

For basic character classes without special operators:

```javascript
const pattern = '[charUcharL0-9]';  // Same as [charU+charL+0-9] - union behavior
// This is the traditional way without explicit + operator
```

## 🛠️ Production Features

### Error Handling & Validation

Pretty RegEx provides comprehensive error handling and validation:

```javascript
const prx = new PrettyRegex({
  validatePatterns: true,  // Enable pattern validation
  throwOnError: true,      // Throw errors on validation failures
  logWarnings: true        // Log performance warnings
});

// Validate patterns before compilation
const validation = prx.validate('[charU+charL]');
if (!validation.isValid) {
  console.log('Errors:', validation.errors.map(e => e.message));
  console.log('Warnings:', validation.warnings.map(w => w.message));
}
```

### Debug Utilities

Debug patterns to understand compilation:

```javascript
const debugInfo = PrettyRegex.debug('[charU&charL&0-9]{8,}');
console.log(debugInfo);
// {
//   original: '[charU&charL&0-9]{8,}',
//   parsed: '(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,}',
//   compiled: '/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,}/',
//   validation: { isValid: true, errors: [], warnings: [] },
//   suggestions: [],
//   isValid: true
// }
```

### Performance Suggestions

Get suggestions for optimizing patterns:

```javascript
const suggestions = PrettyRegex.getSuggestions('[ABCDEFGHIJKLMNOPQRSTUVWXYZ]+');
console.log(suggestions);
// ['Consider using charU instead of [ABCDEFGHIJKLMNOPQRSTUVWXYZ]']
```

### Static Methods

Use static methods for quick operations:

```javascript
// Quick test
const isValid = PrettyRegex.test('[charU+charL]+', 'Hello'); // true

// Quick match
const matches = PrettyRegex.match('[charU]+', 'Hello World'); // ['H', 'W']

// Quick replace
const replaced = PrettyRegex.replace('[charU]', 'Hello World', 'X'); // 'Xello Xorld'

// Quick validation
const validation = PrettyRegex.validate('[charU+charL]');

// Quick debug
const debug = PrettyRegex.debug('[0-9]+');
```

## Examples

```javascript
const PrettyRegex = require('pretty-regex');

// Username: letters, numbers, underscore, 3-20 characters
const username = '[charU+charL+0-9+char(_)]{3,20}';
console.log(PrettyRegex.test(username, 'user123')); // true

// Phone number: (123) 456-7890 or 123-456-7890
const phone = 'char(\\()?0-9{3}char(\\))?char( |-)?0-9{3}char(-)?0-9{4}';
console.log(PrettyRegex.test(phone, '(555) 123-4567')); // true

// URL starting with http or https
const url = 'char(h)char(t)char(t)char(p)char(s)?char(:)char(/)char(/)[charU+charL+0-9+char(.)+char(-)]+';
console.log(PrettyRegex.test(url, 'https://example.com')); // true
```

### MUST Requirements Examples

```javascript
// Strong password: MUST contain uppercase, lowercase, digits, and special chars
const strongPassword = '[charU&charL&0-9&char(!)]{8,}';
console.log(PrettyRegex.test(strongPassword, 'Password123!')); // true
console.log(PrettyRegex.test(strongPassword, 'password123!')); // false (missing uppercase)
console.log(PrettyRegex.test(strongPassword, 'Password123'));  // false (missing special chars)

// Username: MUST contain uppercase, lowercase, and numbers
const username = '[charU&charL&0-9]{3,15}';
console.log(PrettyRegex.test(username, 'User123'));  // true
console.log(PrettyRegex.test(username, 'user123'));  // false (missing uppercase)
console.log(PrettyRegex.test(username, 'USERNAME123')); // false (missing lowercase)

// Product code: MUST have letters and numbers and dashes
const productCode = '[charU&char&0-9&char(-)]{6,10}';
console.log(PrettyRegex.test(productCode, 'ABC-123')); // true
console.log(PrettyRegex.test(productCode, 'ABC123'));  // false (missing dash)
```

### AND/OR Union Examples

```javascript
// Flexible input: may only contain letters, numbers, and basic punctuation
const flexibleInput = '[charU+charL+0-9+char(.)+char(-)+char(_)]+';
console.log(PrettyRegex.test(flexibleInput, 'User123')); // true
console.log(PrettyRegex.test(flexibleInput, 'file-name.txt')); // true
console.log(PrettyRegex.test(flexibleInput, 'test@domain.com')); // false (@ not allowed)

// Safe filename: only letters, numbers, dashes, underscores
const safeFilename = '[charU+charL+0-9+char(-)+char(_)]+';
console.log(PrettyRegex.test(safeFilename, 'my-file_123')); // true
console.log(PrettyRegex.test(safeFilename, 'file name.txt')); // false (space and . not allowed)
```

### Advanced Patterns with Grouping

```javascript
// IP Address (simplified)
const ip = '0-9{1,3}char(.)0-9{1,3}char(.)0-9{1,3}char(.)0-9{1,3}';

// Date in YYYY-MM-DD format
const date = '0-9{4}char(-)0-9{2}char(-)0-9{2}';

// Time in HH:MM format
const time = '0-9{2}char(:)0-9{2}';

// Combining patterns with OR
const dateOrTime = `(${date}|${time})`;
console.log(PrettyRegex.test(dateOrTime, '2023-12-25')); // true
console.log(PrettyRegex.test(dateOrTime, '14:30')); // true
```

### Your Email Example Explained

```javascript
// Two approaches for email validation:

// 1. MUST Requirements (&) - Local part MUST contain all character types
const strictEmailPattern = [
  '[charU&charL&0-9]',        // Local MUST have uppercase AND lowercase AND digits
  '+',                        // One or more
  'char(@)',                  // @ symbol
  '[charU+charL+0-9+char(.)+char(-)]', // Domain may contain letters, numbers, dots, dashes
  '+',                        // One or more  
  'char(.)',                  // Dot
  '[charL]',                  // TLD (lowercase only)
  '{2,}'                      // At least 2 chars
].join('');

// 2. Union Requirements (+) - May only contain these character types (flexible)
const flexibleEmailPattern = [
  '[charU+charL+0-9+char(.)+char(_)+char(%)+char(+)+char(-)]', // Local part (union)
  '+',                                                          // One or more
  'char(@)',                                                    // @ symbol
  '[charU+charL+0-9+char(.)+char(-)]',                         // Domain (union)
  '+',                                                          // One or more
  'char(.)',                                                    // Dot
  '[charL]',                                                    // TLD (lowercase only)
  '{2,}'                                                        // At least 2 chars
].join('');

const emails = [
  'User123@example.com',    // Strict: ✓ (local has all types), Flexible: ✓
  'user@example.com',       // Strict: ✗ (missing uppercase), Flexible: ✓
  'test.email@domain.org',  // Strict: ✗ (missing digits), Flexible: ✓  
  'user@invalid!.com',      // Strict: ✗, Flexible: ✗ (! not allowed)
];

console.log('Strict email validation (MUST requirements):');
emails.forEach(email => {
  console.log(`${email}: ${PrettyRegex.test(strictEmailPattern, email)}`);
});

console.log('\nFlexible email validation (Union requirements):');  
emails.forEach(email => {
  console.log(`${email}: ${PrettyRegex.test(flexibleEmailPattern, email)}`);
});
```

## 🔬 Advanced Features

For complex patterns, use the `AdvancedPrettyRegex` class:

```javascript
const { AdvancedPrettyRegex } = require('pretty-regex');
const advanced = new AdvancedPrettyRegex();

// Lookaheads for password validation
const strongPassword = 'lookahead(.*[charL])lookahead(.*[charU])lookahead(.*0-9)any{8,}';
console.log(advanced.parseAdvanced(strongPassword));
// Result: (?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}

// Pre-built common patterns
const emailRegex = advanced.parseAdvanced('email');
const urlRegex = advanced.parseAdvanced('url');
const phoneRegex = advanced.parseAdvanced('phone');
```

### Built-in Advanced Patterns

| Pattern | Description |
|---------|-------------|
| `email` | Email address validation |
| `url` | HTTP/HTTPS URL validation |
| `ipv4` | IPv4 address |
| `ipv6` | IPv6 address |
| `phone` | US phone number |
| `creditcard` | Credit card number |
| `ssn` | Social Security Number |
| `uuid` | UUID format |
| `hexcolor` | Hex color code |
| `date` | Date in YYYY-MM-DD |
| `time24` | 24-hour time format |
| `time12` | 12-hour time format |

## 🛠️ API Reference

### PrettyRegex Class

#### Constructor
```javascript
const prx = new PrettyRegex();
```

#### Methods

**`compile(pattern, flags?)`**
- Compiles a PRX pattern to a RegExp object
- Returns: `RegExp`

**`parse(pattern)`**
- Converts PRX syntax to regex string
- Returns: `string`

**`test(pattern, string, flags?)`**
- Tests if string matches pattern
- Returns: `boolean`

**`match(pattern, string, flags?)`**
- Finds all matches in string
- Returns: `string[]`

**`replace(pattern, string, replacement, flags?)`**
- Replaces matches with replacement
- Returns: `string`

#### Static Methods

All instance methods are available as static methods:

```javascript
PrettyRegex.compile(pattern, flags);
PrettyRegex.test(pattern, string, flags);
PrettyRegex.match(pattern, string, flags);
PrettyRegex.replace(pattern, string, replacement, flags);
```

### AdvancedPrettyRegex Class

Additional methods for advanced regex features:

**`parseAdvanced(pattern)`**
- Parses advanced PRX patterns
- Returns: `string`

**`validateAdvanced(pattern)`**
- Validates pattern and returns errors/warnings
- Returns: `{errors: string[], warnings: string[]}`

**`suggestFlags(pattern)`**
- Suggests appropriate RegExp flags
- Returns: `string`

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import PrettyRegex, { AdvancedPrettyRegex, PRXPattern } from 'pretty-regex';

const pattern: PRXPattern = '[charU+charL+0-9]+';
const regex: RegExp = PrettyRegex.compile(pattern, 'gi');
const isValid: boolean = regex.test('Hello123');
```

## Testing

Run the test suite:

```bash
npm test
```

The package includes comprehensive tests for:
- Basic character classes and quantifiers
- Complex pattern combinations
- Advanced regex features
- Error handling
- TypeScript definitions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## Roadmap

- [ ] Interactive pattern builder web tool
- [ ] More built-in patterns (credit cards, addresses, etc.)
- [ ] Performance optimizations
- [ ] Browser compatibility testing
- [ ] Plugin system for custom patterns
- [ ] Visual regex debugger

## License

MIT License - see the [LICENSE](LICENSE) file for details

Inspired by the need for human-readable regex patterns and built with ❤️ for developers who find regex intimidating.
Special thanks to the regex community for pattern inspirations