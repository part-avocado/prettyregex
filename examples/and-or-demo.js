const PrettyRegex = require('../src/index');

console.log('🔄 Pretty RegEx MUST (&) vs Union (+) Demo');
console.log('=============================================\n');

console.log('& = MUST contain all character types (strict requirement)');
console.log('+ = Union - may only contain these character types\n');

// Email examples: MUST vs Union behavior
console.log('📧 Email Pattern Comparison:');

// MUST version: local part MUST contain all character types
const emailMustPattern = '[charU&charL&0-9]+char(@)[charUcharL0-9char(.)char(-)]+char(.)[charL]{2,}';
const emailMustRegex = PrettyRegex.compile(emailMustPattern);

console.log(`MUST Pattern: ${emailMustPattern}`);
console.log(`Compiled: ${emailMustRegex.toString()}\n`);

// Union version: may only contain these character types 
const emailUnionPattern = '[charU+charL+0-9+char(.)+char(-)]+char(@)[charU+charL+0-9+char(.)+char(-)]+char(.)[charL]{2,}';
const emailUnionRegex = PrettyRegex.compile(emailUnionPattern);

console.log(`Union Pattern: ${emailUnionPattern}`);
console.log(`Compiled: ${emailUnionRegex.toString()}\n`);

const emailTests = [
  'User123@example.com',    // MUST: ✅, Union: ✅
  'user@example.com',       // MUST: ❌ (missing uppercase), Union: ✅
  'Test1@domain.org',       // MUST: ✅, Union: ✅  
  'user@invalid!.com',      // MUST: ❌, Union: ❌ (! not allowed)
];

console.log('Email Test Results:');
emailTests.forEach(email => {
  const mustValid = emailMustRegex.test(email);
  const unionValid = emailUnionRegex.test(email);
  console.log(`${email.padEnd(25)} MUST: ${mustValid ? '✅' : '❌'}   Union: ${unionValid ? '✅' : '❌'}`);
});

console.log('\n🔐 Password Validation Examples:');
console.log('MUST: Strong password MUST contain uppercase AND lowercase AND digits AND special chars\n');

const strongPassword = '[charU&charL&0-9&char(!)]{8,}';
const passwordRegex = PrettyRegex.compile(strongPassword);

console.log(`Pattern: ${strongPassword}`);
console.log(`Compiled: ${passwordRegex.toString()}\n`);

const passwordTests = [
  { password: 'MyPass123!', desc: 'Has all required types' },
  { password: 'password123!', desc: 'Missing uppercase letters' },
  { password: 'PASSWORD123!', desc: 'Missing lowercase letters' },
  { password: 'Password!', desc: 'Missing digits' },
  { password: 'Password123', desc: 'Missing special characters' },
  { password: 'StrongP@ss1', desc: 'Has all requirements' }
];

passwordTests.forEach(({ password, desc }) => {
  const isValid = passwordRegex.test(password);
  console.log(`${password.padEnd(20)} ${isValid ? '✅' : '❌'} ${desc}`);
});

console.log('\n👤 Username Examples:');
console.log('MUST: Username MUST contain uppercase AND lowercase AND numbers\n');

const username = '[charU&charL&0-9]{3,15}';
const usernameRegex = PrettyRegex.compile(username);

console.log(`Pattern: ${username}`);
console.log(`Compiled: ${usernameRegex.toString()}\n`);

const usernameTests = [
  { username: 'User123', desc: 'Perfect - has all types' },
  { username: 'user123', desc: 'Missing uppercase' },
  { username: 'USER123', desc: 'Missing lowercase' },
  { username: 'Username', desc: 'Missing digits' },
  { username: 'TestUser99', desc: 'Has all requirements' }
];

usernameTests.forEach(({ username, desc }) => {
  const isValid = usernameRegex.test(username);
  console.log(`${username.padEnd(15)} ${isValid ? '✅' : '❌'} ${desc}`);
});

console.log('\n🆚 Comparison: MUST (&) vs Union (+)');
console.log('=====================================\n');

console.log('MUST (&): [charU&charL&0-9] = "MUST contain ALL character types"');
const mustPattern = '[charU&charL&0-9]{4,}';
const mustRegex = PrettyRegex.compile(mustPattern);

console.log('Union (+): [charU+charL+0-9] = "may only contain these character types"');
const unionPattern = '[charU+charL+0-9]{4,}';
const unionRegex = PrettyRegex.compile(unionPattern);

console.log();
const comparisonTests = ['Abc1', 'abcd', 'ABCD', '1234', 'Test'];

comparisonTests.forEach(test => {
  const must = mustRegex.test(test);
  const union = unionRegex.test(test);
  console.log(`${test.padEnd(8)} MUST: ${must ? '✅' : '❌'}   Union: ${union ? '✅' : '❌'}`);
});

console.log('\n✨ Perfect semantic distinction achieved!');
console.log('   & = MUST contain all specified character types (uses lookaheads)');
console.log('   + = Union of character types (traditional regex behavior)');
console.log('   Your email requirements now have precise control! 🎉'); 