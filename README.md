# PRX-RegEx

![GitHub repo size](https://img.shields.io/github/repo-size/part-avocado/prettyregex)
![NPM Last Update](https://img.shields.io/npm/last-update/prx-regex)
![GitHub last commit](https://img.shields.io/github/last-commit/part-avocado/prettyregex)
![GitHub commits since latest release](https://img.shields.io/github/commits-since/part-avocado/prettyregex/latest)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)]
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]

> **Human-readable regular expressions** - Write complex regex patterns using simple, intuitive syntax

Transform complex regular expressions into readable, maintainable code. PRX-RegEx provides a simplified syntax that makes regex patterns accessible to everyone.

## Features

- **Human-readable syntax** - Write `[charU+charL+0-9]+` instead of `[A-Za-z0-9]+`
- **MUST requirements** - Use `&` to enforce all character types: `[charU&charL&0-9]`
- **Union operations** - Use `+` for traditional union: `[charU+charL+0-9]`
- **Character ranges** - Support for `[0-9]`, `[a-z]`, `[a-E]` (mixed case)
- **Production-ready** - Comprehensive error handling and validation
- **Debug tools** - Built-in debugging and performance analysis
- **TypeScript support** - Full type definitions included

## Quick Start

### Installation

```bash
npm install prx-regex
```

### Basic Usage

```javascript
const PrettyRegex = require('prx-regex');

// Email validation - simple and readable!
const emailPattern = '[charU+charL+0-9]+char(@)[charU+charL+0-9]+char(.)[charL]{2,}';
const emailRegex = PrettyRegex.compile(emailPattern);

console.log(emailRegex.test('user@example.com')); // true
console.log(emailRegex.test('invalid-email')); // false
```

### Advanced Usage with Validation

```javascript
const prx = new PrettyRegex({
  validatePatterns: true,
  throwOnError: true,
  logWarnings: true
});

try {
  // Strong password: MUST contain uppercase, lowercase, digits, and special chars
  const strongPassword = '[charU&charL&0-9&char(!)]{8,}';
  const regex = prx.compile(strongPassword);
  
  console.log(regex.test('Password123!')); // true
  console.log(regex.test('password123!')); // false (missing uppercase)
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
| `0-9` | `[0-9]` | Digits |
| `space` | ` ` | Literal space |
| `tab` | `\t` | Tab character |
| `newline` | `\n` | Newline character |
| `whitespace` | `\s` | Any whitespace |
| `wordchar` | `\w` | Word characters |
| `any` | `.` | Any character |
| `string(text)` | `text` | Exact string match |
| `string(text, caseinsensitive)` | `text` (with `i` flag) | Case insensitive match |
| `string(text, multicase)` | `[tT][eE][xX][tT]` | All case variations |

### Character Ranges

Traditional character ranges work seamlessly:

| PRX Syntax | Regex Equivalent | Description |
|------------|------------------|-------------|
| `[0-2]` | `[0-2]` | Digits 0, 1, 2 |
| `[5-9]` | `[5-9]` | Digits 5, 6, 7, 8, 9 |
| `[a-e]` | `[a-e]` | Lowercase letters a through e |
| `[A-E]` | `[A-E]` | Uppercase letters A through E |
| `[a-E]` | `[a-eA-E]` | Mixed case range (a-e and A-E) |

### Operators

#### MUST Requirements (`&`)
Enforce that **all** specified character types must be present:

```javascript
// Password MUST contain uppercase AND lowercase AND digits
const strongPassword = '[charU&charL&0-9]{8,}';
console.log(PrettyRegex.test(strongPassword, 'Password123')); // true
console.log(PrettyRegex.test(strongPassword, 'password123')); // false (missing uppercase)
```

#### Union Operations (`+`)
Traditional union behavior - may contain any of the specified types:

```javascript
// Username may contain letters OR numbers OR underscores
const username = '[charU+charL+0-9+char(_)]{3,20}';
console.log(PrettyRegex.test(username, 'user123')); // true
console.log(PrettyRegex.test(username, 'user_name')); // true
```

### Quantifiers

| PRX Syntax | Regex Equivalent | Description |
|------------|------------------|-------------|
| `+` | `+` | One or more |
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
// Phone number: (123) 456-7890
const phone = 'char(\\()0-9{3}char(\\))char( )0-9{3}char(-)0-9{4}';
console.log(PrettyRegex.test(phone, '(555) 123-4567')); // true
```

### String Matching

Use `string(text)` to match exact strings with powerful case sensitivity options:

#### Basic String Matching
```javascript
// Match exact string
const pattern = 'string(banana)';
console.log(PrettyRegex.test(pattern, 'banana')); // true
console.log(PrettyRegex.test(pattern, 'Banana')); // false
```

#### Case Insensitive Matching
```javascript
// Case insensitive matching
const pattern = 'string(banana, caseinsensitive)';
console.log(PrettyRegex.test(pattern, 'banana')); // true
console.log(PrettyRegex.test(pattern, 'Banana')); // true
console.log(PrettyRegex.test(pattern, 'BANANA')); // true

// Short flags: ci, nocase
const shortPattern = 'string(banana, ci)';
```

#### Case Sensitive Matching (Default)
```javascript
// Explicit case sensitive matching
const pattern = 'string(banana, casesensitive)';
console.log(PrettyRegex.test(pattern, 'banana')); // true
console.log(PrettyRegex.test(pattern, 'Banana')); // false

// Short flags: cs, case
const shortPattern = 'string(banana, cs)';
```

#### Multicase Matching
Match all possible case variations of a string:

```javascript
// Multicase matching
const pattern = 'string(banana, multicase)';
console.log(PrettyRegex.test(pattern, 'banana')); // true
console.log(PrettyRegex.test(pattern, 'Banana')); // true
console.log(PrettyRegex.test(pattern, 'BANANA')); // true
console.log(PrettyRegex.test(pattern, 'bAnAnA')); // true

// Short flag: mc
const shortPattern = 'string(banana, mc)';
```

#### String Matching with Special Characters
```javascript
// Strings with special regex characters are automatically escaped
const pattern = 'string(hello.world+test*regex)';
console.log(PrettyRegex.test(pattern, 'hello.world+test*regex')); // true
```

## Real-World Examples

### Email Validation

```javascript
// Flexible email pattern
const email = '[charU+charL+0-9+char(.)+char(_)+char(-)]+char(@)[charU+charL+0-9+char(.)+char(-)]+char(.)[charL]{2,}';
console.log(PrettyRegex.test(email, 'user.name@domain.com')); // true
console.log(PrettyRegex.test(email, 'user-name@sub.domain.co.uk')); // true

// Email with case insensitive domain
const emailCI = '[charU+charL+0-9+char(.)+char(_)+char(-)]+string(@, caseinsensitive)[charU+charL+0-9+char(.)+char(-)]+string(.com, caseinsensitive)';
console.log(PrettyRegex.test(emailCI, 'user@EXAMPLE.COM')); // true
console.log(PrettyRegex.test(emailCI, 'user@Example.Com')); // true
```

### URL Validation

```javascript
// HTTP/HTTPS URL
const url = 'char(h)char(t)char(t)char(p)char(s)?char(:)char(/)char(/)[charU+charL+0-9+char(.)+char(-)]+';
console.log(PrettyRegex.test(url, 'https://example.com')); // true
console.log(PrettyRegex.test(url, 'http://sub-domain.example.co.uk')); // true

// URL with case insensitive protocol
const urlCI = 'string(http, caseinsensitive)string(s, caseinsensitive)?string(:)string(//)[charU+charL+0-9+char(.)+char(-)]+';
console.log(PrettyRegex.test(urlCI, 'HTTP://example.com')); // true
console.log(PrettyRegex.test(urlCI, 'HTTPS://EXAMPLE.COM')); // true
```

### Strong Password Validation

```javascript
// MUST contain uppercase, lowercase, digits, and special characters
const strongPassword = '[charU&charL&0-9&char(!@#$%^&*)]{8,}';
console.log(PrettyRegex.test(strongPassword, 'Password123!')); // true
console.log(PrettyRegex.test(strongPassword, 'password123!')); // false (missing uppercase)
console.log(PrettyRegex.test(strongPassword, 'Password123')); // false (missing special char)

// Password validation excluding common weak passwords
const securePassword = 'start(?!string(password, caseinsensitive))(?!string(123, caseinsensitive))[charU+charL+0-9+char(!@#$%^&*)]{8,}end';
console.log(PrettyRegex.test(securePassword, 'MyPass123!')); // true
console.log(PrettyRegex.test(securePassword, 'password123')); // false (contains "password")
console.log(PrettyRegex.test(securePassword, 'PASSWORD123')); // false (contains "password")
```

### Date and Time Formats

```javascript
// Date: YYYY-MM-DD
const date = '0-9{4}char(-)0-9{2}char(-)0-9{2}';
console.log(PrettyRegex.test(date, '2023-12-25')); // true

// Time: HH:MM
const time = '0-9{2}char(:)0-9{2}';
console.log(PrettyRegex.test(time, '14:30')); // true

// Date with case insensitive month names
const dateWithMonth = 'string(2023, caseinsensitive)string(-)string(december, caseinsensitive)string(-)string(25, caseinsensitive)';
console.log(PrettyRegex.test(dateWithMonth, '2023-December-25')); // true
console.log(PrettyRegex.test(dateWithMonth, '2023-DECEMBER-25')); // true
```

### File Extension Validation

```javascript
// Case insensitive file extensions
const fileExtensions = 'string(.txt, caseinsensitive)|string(.pdf, caseinsensitive)|string(.doc, caseinsensitive)';
console.log(PrettyRegex.test(fileExtensions, '.TXT')); // true
console.log(PrettyRegex.test(fileExtensions, '.pdf')); // true
console.log(PrettyRegex.test(fileExtensions, '.DOC')); // true
console.log(PrettyRegex.test(fileExtensions, '.jpg')); // false
```

### Greeting Detection

```javascript
// Multicase greeting detection
const greetings = 'string(hello, multicase)|string(hi, multicase)|string(hey, multicase)';
console.log(PrettyRegex.test(greetings, 'Hello')); // true
console.log(PrettyRegex.test(greetings, 'HELLO')); // true
console.log(PrettyRegex.test(greetings, 'hElLo')); // true
console.log(PrettyRegex.test(greetings, 'Hi')); // true
console.log(PrettyRegex.test(greetings, 'Goodbye')); // false
```

### PrettyRegex Class

#### Constructor
```javascript
const prx = new PrettyRegex({
  validatePatterns: true,  // Enable pattern validation
  throwOnError: true,      // Throw errors instead of warnings
  logWarnings: true        // Log warnings to console
});
```

#### Core Methods

**`compile(pattern, flags?)`**
```javascript
const regex = prx.compile('[charU+charL]+', 'i');
// Returns: RegExp object
```

**`test(pattern, string, flags?)`**
```javascript
const isValid = prx.test('[charU+charL]+', 'Hello');
// Returns: boolean
```

**`match(pattern, string, flags?)`**
```javascript
const matches = prx.match('[charU+charL]+', 'Hello World');
// Returns: ['Hello', 'World']
```

**`replace(pattern, string, replacement, flags?)`**
```javascript
const result = prx.replace('[charU+charL]+', 'Hello World', '***');
// Returns: '*** ***'
```

#### Static Methods

All methods are available as static methods for convenience:

```javascript
// Static usage
const regex = PrettyRegex.compile('[charU+charL]+');
const isValid = PrettyRegex.test('[charU+charL]+', 'Hello');
const matches = PrettyRegex.match('[charU+charL]+', 'Hello World');
```

#### Utility Methods

**`validate(pattern)`**
```javascript
const validation = prx.validate('[charU+charL');
console.log(validation.isValid); // false
console.log(validation.errors); // Array of error messages
```

**`debug(pattern)`**
```javascript
const debugInfo = prx.debug('[charU+charL]+');
console.log(debugInfo.compiled); // Compiled regex string
console.log(debugInfo.features); // Detected features
```

**`getSuggestions(pattern)`**
```javascript
const suggestions = prx.getSuggestions('[charU+charL');
console.log(suggestions); // Array of improvement suggestions
```

## Error Handling

PRX-RegEx provides comprehensive error handling with detailed messages:

```javascript
try {
  const regex = prx.compile('[charU+charL'); // Missing closing bracket
} catch (error) {
  console.log(error.name); // 'CharacterClassError'
  console.log(error.message); // 'Unclosed character class'
  console.log(error.code); // Error code for programmatic handling
  console.log(error.details); // Additional error details
}
```

## Advanced Features

### AdvancedPrettyRegex Class

For complex patterns with lookaheads, lookbehinds, and advanced features:

```javascript
const { AdvancedPrettyRegex } = require('prx-regex');
const advanced = new AdvancedPrettyRegex();

// Password with lookaheads
const strongPassword = 'lookahead(.*[charL])lookahead(.*[charU])lookahead(.*0-9)any{8,}';
console.log(advanced.parseAdvanced(strongPassword));
// Result: (?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}

// Pre-built patterns
const emailRegex = advanced.parseAdvanced('email');
const urlRegex = advanced.parseAdvanced('url');
const phoneRegex = advanced.parseAdvanced('phone');
```

### Built-in Patterns

| Pattern | Description |
|---------|-------------|
| `email` | Email address validation |
| `url` | HTTP/HTTPS URL validation |
| `ipv4` | IPv4 address |
| `phone` | US phone number |
| `creditcard` | Credit card number |
| `ssn` | Social Security Number |
| `uuid` | UUID format |
| `hexcolor` | Hex color code |
| `date` | Date in YYYY-MM-DD |
| `time24` | 24-hour time format |

## Testing

Run the comprehensive test suite:

```bash
npm test
npm run test:coverage
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. The following workflows are configured:

### Automated Checks

- **Tests**: Runs on Node.js versions 16.x, 18.x, 20.x, and 22.x
- **Linting**: ESLint checks for code quality and consistency
- **Security**: npm audit for vulnerability scanning
- **Build**: Verifies the package builds correctly
- **Coverage**: Generates and uploads test coverage reports

### Pull Request Requirements

Before a pull request can be merged, it must pass:

1. ✅ All tests passing
2. ✅ Linting checks passing
3. ✅ Security audit passing
4. ✅ Build verification
5. ✅ No console.log statements in production code
6. ✅ No TODO/FIXME comments in production code

### Branch Protection

The `main` branch is protected with the following rules:
- Requires pull request reviews
- Requires status checks to pass
- Requires branches to be up to date
- Requires conversation resolution
- Requires signed commits (recommended)

See [`.github/branch-protection.md`](.github/branch-protection.md) for detailed configuration instructions.

## Installation

```bash
# Using npm
npm install prx-regex

# Using yarn
yarn add prx-regex

# Using pnpm
pnpm add prx-regex
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for developers who can't read regex ;)**
