/**
 * String Matching Demo
 * Demonstrates the new string() functionality in PrettyRegex
 */

const PrettyRegex = require('../src/index');

console.log('🍌 PrettyRegex String Matching Demo\n');

// Create instance
const prx = new PrettyRegex({
  validatePatterns: true,
  throwOnError: true,
  logWarnings: false
});

// Basic string matching
console.log('=== Basic String Matching ===');
const basicPattern = 'string(banana)';
console.log(`Pattern: ${basicPattern}`);
console.log(`Matches "banana": ${prx.test(basicPattern, 'banana')}`);
console.log(`Matches "Banana": ${prx.test(basicPattern, 'Banana')}`);
console.log(`Matches "BANANA": ${prx.test(basicPattern, 'BANANA')}`);
console.log(`Matches "bananas": ${prx.test(basicPattern, 'bananas')}`);
console.log();

// Case insensitive matching
console.log('=== Case Insensitive Matching ===');
const caseInsensitivePattern = 'string(banana, caseinsensitive)';
console.log(`Pattern: ${caseInsensitivePattern}`);
console.log(`Matches "banana": ${prx.test(caseInsensitivePattern, 'banana')}`);
console.log(`Matches "Banana": ${prx.test(caseInsensitivePattern, 'Banana')}`);
console.log(`Matches "BANANA": ${prx.test(caseInsensitivePattern, 'BANANA')}`);
console.log(`Matches "bAnAnA": ${prx.test(caseInsensitivePattern, 'bAnAnA')}`);
console.log();

// Multicase matching (matches all case variations)
console.log('=== Multicase Matching ===');
const multicasePattern = 'string(banana, multicase)';
console.log(`Pattern: ${multicasePattern}`);
console.log(`Matches "banana": ${prx.test(multicasePattern, 'banana')}`);
console.log(`Matches "Banana": ${prx.test(multicasePattern, 'Banana')}`);
console.log(`Matches "BANANA": ${prx.test(multicasePattern, 'BANANA')}`);
console.log(`Matches "bAnAnA": ${prx.test(multicasePattern, 'bAnAnA')}`);
console.log(`Matches "BaNaNa": ${prx.test(multicasePattern, 'BaNaNa')}`);
console.log();

// Short flags
console.log('=== Short Flags ===');
console.log('Case insensitive flags: ci, nocase');
console.log('Case sensitive flags: cs, case');
console.log('Multicase flags: mc');
console.log();

// Complex patterns with string matching
console.log('=== Complex Patterns ===');

// Email validation with case insensitive domain
const emailPattern = '[charU+charL+0-9+char(.)+char(_)+char(-)]+string(@, caseinsensitive)[charU+charL+0-9+char(.)+char(-)]+string(.com, caseinsensitive)';
console.log(`Email Pattern: ${emailPattern}`);
console.log(`Matches "user@EXAMPLE.COM": ${prx.test(emailPattern, 'user@EXAMPLE.COM')}`);
console.log(`Matches "user@example.com": ${prx.test(emailPattern, 'user@example.com')}`);
console.log(`Matches "user@Example.Com": ${prx.test(emailPattern, 'user@Example.Com')}`);
console.log();

// URL validation with case insensitive protocol
const urlPattern = 'string(http, caseinsensitive)string(s, caseinsensitive)?string(:)string(//)[charU+charL+0-9+char(.)+char(-)]+';
console.log(`URL Pattern: ${urlPattern}`);
console.log(`Matches "HTTP://example.com": ${prx.test(urlPattern, 'HTTP://example.com')}`);
console.log(`Matches "https://example.com": ${prx.test(urlPattern, 'https://example.com')}`);
console.log(`Matches "HTTPS://EXAMPLE.COM": ${prx.test(urlPattern, 'HTTPS://EXAMPLE.COM')}`);
console.log();

// File extension matching
const filePattern = 'string(.txt, caseinsensitive)|string(.pdf, caseinsensitive)|string(.doc, caseinsensitive)';
console.log(`File Pattern: ${filePattern}`);
console.log(`Matches ".TXT": ${prx.test(filePattern, '.TXT')}`);
console.log(`Matches ".pdf": ${prx.test(filePattern, '.pdf')}`);
console.log(`Matches ".DOC": ${prx.test(filePattern, '.DOC')}`);
console.log(`Matches ".jpg": ${prx.test(filePattern, '.jpg')}`);
console.log();

// Password validation with specific words
const passwordPattern = 'start(?!string(password, caseinsensitive))(?!string(123, caseinsensitive))[charU+charL+0-9+char(!@#$%^&*)]{8,}end';
console.log(`Password Pattern: ${passwordPattern}`);
console.log(`Matches "MyPass123!": ${prx.test(passwordPattern, 'MyPass123!')}`);
console.log(`Matches "password123": ${prx.test(passwordPattern, 'password123')}`);
console.log(`Matches "PASSWORD123": ${prx.test(passwordPattern, 'PASSWORD123')}`);
console.log(`Matches "MyPass123": ${prx.test(passwordPattern, 'MyPass123')}`);
console.log();

// Greeting detection with multicase
const greetingPattern = 'string(hello, multicase)|string(hi, multicase)|string(hey, multicase)';
console.log(`Greeting Pattern: ${greetingPattern}`);
console.log(`Matches "Hello": ${prx.test(greetingPattern, 'Hello')}`);
console.log(`Matches "HELLO": ${prx.test(greetingPattern, 'HELLO')}`);
console.log(`Matches "hElLo": ${prx.test(greetingPattern, 'hElLo')}`);
console.log(`Matches "Hi": ${prx.test(greetingPattern, 'Hi')}`);
console.log(`Matches "HEY": ${prx.test(greetingPattern, 'HEY')}`);
console.log(`Matches "Goodbye": ${prx.test(greetingPattern, 'Goodbye')}`);
console.log();

// Phone number with optional country code
const phonePattern = 'string(+1, caseinsensitive)?string(\\()?[0-9]{3}string(\\))?[char( )-]?[0-9]{3}[char( )-]?[0-9]{4}';
console.log(`Phone Pattern: ${phonePattern}`);
console.log(`Matches "+1 (555) 123-4567": ${prx.test(phonePattern, '+1 (555) 123-4567')}`);
console.log(`Matches "(555) 123-4567": ${prx.test(phonePattern, '(555) 123-4567')}`);
console.log(`Matches "555-123-4567": ${prx.test(phonePattern, '555-123-4567')}`);
console.log(`Matches "555 123 4567": ${prx.test(phonePattern, '555 123 4567')}`);
console.log();

// Date format validation
const datePattern = 'string(2023, caseinsensitive)string(-)string(12, caseinsensitive)string(-)string(25, caseinsensitive)';
console.log(`Date Pattern: ${datePattern}`);
console.log(`Matches "2023-12-25": ${prx.test(datePattern, '2023-12-25')}`);
console.log(`Matches "2023-12-26": ${prx.test(datePattern, '2023-12-26')}`);
console.log();

// Debug information
console.log('=== Debug Information ===');
const debugInfo = prx.debug('string(hello, caseinsensitive)');
console.log('Debug info for "string(hello, caseinsensitive)":');
console.log(`Original: ${debugInfo.original}`);
console.log(`Parsed: ${debugInfo.parsed}`);
console.log(`Compiled: ${debugInfo.compiled}`);
console.log(`Is Valid: ${debugInfo.isValid}`);
console.log();

// Features information
console.log('=== String Matching Features ===');
const features = prx.getFeatures();
console.log('String matching options:');
Object.entries(features.stringMatching).forEach(([key, description]) => {
  console.log(`  ${key}: ${description}`);
});
console.log();

console.log('🎉 String matching demo completed!'); 