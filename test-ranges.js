const PrettyRegex = require('./src/index');

console.log('🔢 Testing Numeric and Character Ranges');
console.log('========================================\n');

// Test numeric ranges
console.log('📊 Numeric Ranges:');
const numericTests = [
  { pattern: '[0-2]', desc: 'Single digit 0-2' },
  { pattern: '[0-2]+', desc: 'One or more digits 0-2' },
  { pattern: '[0-2]{3}', desc: 'Exactly 3 digits 0-2' },
  { pattern: '[0-9]', desc: 'Any digit 0-9' },
  { pattern: '[5-9]', desc: 'Digits 5-9' }
];

numericTests.forEach(({ pattern, desc }) => {
  const regex = PrettyRegex.compile(pattern);
  console.log(`\nPattern: ${pattern} (${desc})`);
  console.log(`Compiled: ${regex.toString()}`);
  
  const testCases = ['0', '1', '2', '3', '5', '9', '12', '123', '012', '345'];
  testCases.forEach(test => {
    const result = regex.test(test);
    console.log(`  ${test.padEnd(8)} ${result ? '✅' : '❌'}`);
  });
});

console.log('\n🔤 Character Ranges:');
const charRangeTests = [
  { pattern: '[a-E]', desc: 'a to E (case insensitive range)' },
  { pattern: '[a-e]', desc: 'a to e (lowercase only)' },
  { pattern: '[A-E]', desc: 'A to E (uppercase only)' },
  { pattern: '[!a-E]', desc: 'NOT a to E (negated range)' },
  { pattern: '[a-z]', desc: 'a to z (all lowercase)' },
  { pattern: '[A-Z]', desc: 'A to Z (all uppercase)' }
];

charRangeTests.forEach(({ pattern, desc }) => {
  const regex = PrettyRegex.compile(pattern);
  console.log(`\nPattern: ${pattern} (${desc})`);
  console.log(`Compiled: ${regex.toString()}`);
  
  const testCases = ['a', 'b', 'c', 'd', 'e', 'A', 'B', 'C', 'D', 'E', 'f', 'F', 'z', 'Z'];
  testCases.forEach(test => {
    const result = regex.test(test);
    console.log(`  ${test.padEnd(8)} ${result ? '✅' : '❌'}`);
  });
});

console.log('\n🔗 Combined with Pretty RegEx Features:');
const combinedTests = [
  { pattern: '[0-2&charU]', desc: 'MUST have digit 0-2 AND uppercase' },
  { pattern: '[0-2+charU]', desc: 'May contain digit 0-2 OR uppercase' },
  { pattern: '[a-E&0-9]', desc: 'MUST have a-E AND digit' },
  { pattern: '[a-E+0-9]', desc: 'May contain a-E OR digit' }
];

combinedTests.forEach(({ pattern, desc }) => {
  try {
    const regex = PrettyRegex.compile(pattern);
    console.log(`\nPattern: ${pattern} (${desc})`);
    console.log(`Compiled: ${regex.toString()}`);
    
    const testCases = ['A1', 'B2', 'a1', 'b2', 'C9', 'c9', 'X1', 'x1'];
    testCases.forEach(test => {
      const result = regex.test(test);
      console.log(`  ${test.padEnd(8)} ${result ? '✅' : '❌'}`);
    });
  } catch (error) {
    console.log(`\nPattern: ${pattern} (${desc})`);
    console.log(`❌ Error: ${error.message}`);
  }
});

console.log('\n🎯 Edge Cases:');
const edgeCases = [
  { pattern: '[2-0]', desc: 'Reversed range 2-0' },
  { pattern: '[E-a]', desc: 'Reversed range E-a' },
  { pattern: '[0-0]', desc: 'Single value range 0-0' },
  { pattern: '[a-a]', desc: 'Single value range a-a' }
];

edgeCases.forEach(({ pattern, desc }) => {
  try {
    const regex = PrettyRegex.compile(pattern);
    console.log(`\nPattern: ${pattern} (${desc})`);
    console.log(`Compiled: ${regex.toString()}`);
    
    const testCases = ['0', '1', '2', 'a', 'b', 'c'];
    testCases.forEach(test => {
      const result = regex.test(test);
      console.log(`  ${test.padEnd(8)} ${result ? '✅' : '❌'}`);
    });
  } catch (error) {
    console.log(`\nPattern: ${pattern} (${desc})`);
    console.log(`❌ Error: ${error.message}`);
  }
}); 