const PrettyRegex = require('../src/index');
const AdvancedPrettyRegex = require('../src/advanced');

console.log('🎉 Pretty RegEx Demo\n');

// Basic Examples
console.log('📝 Basic Examples:');
console.log('=================');

// 1. Your email example
console.log('\n1. Email Validation (Your Example):');
const emailPattern = '[charU+charL+0-9+char(.)+char(_)+char(%)+char(+)+char(-)]+char(@)[charU+charL+0-9+char(.)+char(-)]+char(.)[charL]{2,}';
const emailRegex = PrettyRegex.compile(emailPattern);

const testEmails = [
  'user@example.com',
  'test.email+tag@domain.org',
  'invalid@',
  '@invalid.com',
  'no-domain'
];

testEmails.forEach(email => {
  const isValid = emailRegex.test(email);
  console.log(`  ${email.padEnd(25)} ${isValid ? '✅' : '❌'}`);
});

// 2. Phone number validation
console.log('\n2. Phone Number Validation:');
const phonePattern = 'char(\\()?0-9{3}char(\\))?(char( )|char(-))?0-9{3}char(-)?0-9{4}';

const testPhones = [
  '(555) 123-4567',
  '555-123-4567',
  '5551234567',
  '555.123.4567',
  '123-45-6789'
];

testPhones.forEach(phone => {
  const isValid = PrettyRegex.test(phonePattern, phone);
  console.log(`  ${phone.padEnd(15)} ${isValid ? '✅' : '❌'}`);
});

// 3. Username validation
console.log('\n3. Username Validation (3-20 chars, letters/numbers/underscore):');
const usernamePattern = '[charU+charL+0-9+char(_)]{3,20}';

const testUsernames = [
  'user123',
  'validUser_99',
  'ab',          // too short
  'user@domain', // invalid character
  'ThisIsAVeryLongUsernameThatExceedsTwentyCharacters' // too long
];

testUsernames.forEach(username => {
  const isValid = PrettyRegex.test(usernamePattern, username);
  console.log(`  ${username.padEnd(30)} ${isValid ? '✅' : '❌'}`);
});

// 4. URL validation
console.log('\n4. URL Validation:');
const urlPattern = 'char(h)char(t)char(t)char(p)char(s)?char(:)char(/)char(/)[charU+charL+0-9+char(.)+char(-)+char(_)]+';

const testUrls = [
  'http://example.com',
  'https://sub.domain.co.uk',
  'https://my-site.com',
  'ftp://example.com',    // wrong protocol
  'not-a-url'             // invalid format
];

testUrls.forEach(url => {
  const isValid = PrettyRegex.test(urlPattern, url);
  console.log(`  ${url.padEnd(25)} ${isValid ? '✅' : '❌'}`);
});

// Advanced Examples
console.log('\n\n🔬 Advanced Examples:');
console.log('=====================');

const advanced = new AdvancedPrettyRegex();

// 5. Password strength validation
console.log('\n5. Strong Password Validation:');
console.log('   Requirements: 8+ chars, lowercase, uppercase, digit');

// This would use lookaheads in real regex
const strongPasswordPattern = 'lookahead(.*[charL])lookahead(.*[charU])lookahead(.*0-9)any{8,}';
const passwordRegex = advanced.parseAdvanced(strongPasswordPattern);
console.log(`   PRX Pattern: ${strongPasswordPattern}`);
console.log(`   Regex: ${passwordRegex}`);

const testPasswords = [
  'Password123',
  'weakpass',
  'UPPERCASE123',
  'lowercase123',
  'NoDigits',
  'Str0ng!'
];

// Note: This is just showing the pattern conversion
// Actual validation would need proper regex engine support
testPasswords.forEach(password => {
  // For demo purposes, let's use a simpler check
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const isLongEnough = password.length >= 8;
  const isValid = hasLower && hasUpper && hasDigit && isLongEnough;
  
  console.log(`  ${password.padEnd(15)} ${isValid ? '✅' : '❌'}`);
});

// 6. Built-in patterns
console.log('\n6. Built-in Advanced Patterns:');

const patterns = {
  'Email': 'email',
  'IPv4': 'ipv4',
  'UUID': 'uuid',
  'Hex Color': 'hexcolor',
  'Credit Card': 'creditcard'
};

Object.entries(patterns).forEach(([name, pattern]) => {
  const regex = advanced.parseAdvanced(pattern);
  console.log(`  ${name.padEnd(12)}: ${regex.substring(0, 50)}${regex.length > 50 ? '...' : ''}`);
});

// 7. Text processing examples
console.log('\n\n📄 Text Processing Examples:');
console.log('============================');

const sampleText = "Contact us at support@company.com or call (555) 123-4567. Visit https://company.com for more info.";

// Extract emails
console.log('\n7. Extract all emails:');
const emailMatches = PrettyRegex.match(emailPattern, sampleText);
console.log(`  Found: ${emailMatches.join(', ')}`);

// Extract phone numbers
console.log('\n8. Extract phone numbers:');
const phoneMatches = PrettyRegex.match(phonePattern, sampleText);
console.log(`  Found: ${phoneMatches.join(', ')}`);

// Replace emails with [EMAIL]
console.log('\n9. Replace emails with [EMAIL]:');
const maskedText = PrettyRegex.replace(emailPattern, sampleText, '[EMAIL]');
console.log(`  Result: ${maskedText}`);

// 10. Character class combinations
console.log('\n\n🔤 Character Class Examples:');
console.log('============================');

const examples = [
  {
    name: 'Alphanumeric only',
    pattern: '[charU+charL+0-9]+',
    tests: ['Hello123', 'test-case', 'ValidText', '123ABC', 'with spaces']
  },
  {
    name: 'Alphanumeric + common symbols',
    pattern: '[charU+charL+0-9+char(.)+char(-)+char(_)]+',
    tests: ['file-name.txt', 'user_123', 'test@case', 'valid.file_name', 'special!char']
  },
  {
    name: 'Exact length (5 chars)',
    pattern: '[charU+charL]{5}',
    tests: ['Hello', 'Test', 'LongWord', 'Hi', 'EXACT']
  }
];

examples.forEach(({ name, pattern, tests }) => {
  console.log(`\n${name}:`);
  console.log(`Pattern: ${pattern}`);
  tests.forEach(test => {
    const isValid = PrettyRegex.test(pattern, test);
    console.log(`  ${test.padEnd(20)} ${isValid ? '✅' : '❌'}`);
  });
});

// 11. Anchoring examples
console.log('\n\n⚓ Anchoring Examples:');
console.log('=====================');

const anchorExamples = [
  {
    name: 'Starts with "test"',
    pattern: 'startchar(t)char(e)char(s)char(t)',
    tests: ['test123', 'testing', 'not test', 'pretest']
  },
  {
    name: 'Ends with ".com"',
    pattern: 'char(.)char(c)char(o)char(m)end',
    tests: ['example.com', 'test.com.au', 'site.com', 'nocom']
  },
  {
    name: 'Exact match "hello"',
    pattern: 'startchar(h)char(e)char(l)char(l)char(o)end',
    tests: ['hello', 'hello world', 'say hello', 'HELLO']
  }
];

anchorExamples.forEach(({ name, pattern, tests }) => {
  console.log(`\n${name}:`);
  tests.forEach(test => {
    const isValid = PrettyRegex.test(pattern, test);
    console.log(`  ${test.padEnd(15)} ${isValid ? '✅' : '❌'}`);
  });
});

// Performance comparison (basic demo)
console.log('\n\n⚡ Performance Demo:');
console.log('===================');

const iterations = 10000;
const testString = 'user@example.com';

// PRX compilation time
console.time('PRX Compilation');
for (let i = 0; i < iterations; i++) {
  PrettyRegex.compile(emailPattern);
}
console.timeEnd('PRX Compilation');

// Native regex compilation time
const nativeRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/;
console.time('Native Regex Creation');
for (let i = 0; i < iterations; i++) {
  new RegExp('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,}');
}
console.timeEnd('Native Regex Creation');

// Test execution time
const prxRegex = PrettyRegex.compile(emailPattern);
console.time('PRX Test Execution');
for (let i = 0; i < iterations; i++) {
  prxRegex.test(testString);
}
console.timeEnd('PRX Test Execution');

console.time('Native Test Execution');
for (let i = 0; i < iterations; i++) {
  nativeRegex.test(testString);
}
console.timeEnd('Native Test Execution');

console.log('\n✨ Demo completed! Check out the README.md for more examples.');
console.log('📚 Run "npm test" to see the full test suite in action.'); 