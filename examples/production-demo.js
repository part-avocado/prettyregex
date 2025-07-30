#!/usr/bin/env node

/**
 * Pretty RegEx Production Demo
 * 
 * This demo showcases the production-ready features including:
 * - Error handling and validation
 * - Debug utilities
 * - Performance warnings
 * - Suggestions for improvement
 */

const PrettyRegex = require('../src/index');

console.log('🚀 Pretty RegEx Production Demo');
console.log('================================\n');

// Create instances with different configurations
const strictPrx = new PrettyRegex({
  validatePatterns: true,
  throwOnError: true,
  logWarnings: true
});

const lenientPrx = new PrettyRegex({
  validatePatterns: true,
  throwOnError: false,
  logWarnings: false
});

console.log('📋 Available Features:');
console.log(PrettyRegex.getFeatures());
console.log('\n' + '='.repeat(50) + '\n');

// Demo 1: Basic Usage with Validation
console.log('1️⃣ Basic Usage with Validation:');
console.log('--------------------------------');

try {
  const emailPattern = '[charU+charL+0-9]+char(@)[charU+charL+0-9]+char(.)[charL]{2,}';
  const emailRegex = strictPrx.compile(emailPattern);
  
  console.log('✅ Valid pattern compiled successfully');
  console.log(`Pattern: ${emailPattern}`);
  console.log(`Compiled: ${emailRegex.toString()}`);
  console.log(`Test "user@example.com": ${emailRegex.test('user@example.com')}`);
  console.log(`Test "invalid": ${emailRegex.test('invalid')}`);
} catch (error) {
  console.log('❌ Error:', error.message);
  if (error.details?.suggestion) {
    console.log('💡 Suggestion:', error.details.suggestion);
  }
}

console.log('\n' + '='.repeat(50) + '\n');

// Demo 2: Error Handling
console.log('2️⃣ Error Handling:');
console.log('------------------');

const invalidPatterns = [
  '[charU+charL', // Unclosed character class
  '[9-0]', // Invalid range
  'char(', // Unclosed char()
  '[charU+charL+]', // Ambiguous + usage
];

invalidPatterns.forEach((pattern, index) => {
  console.log(`\nPattern ${index + 1}: "${pattern}"`);
  
  try {
    const regex = strictPrx.compile(pattern);
    console.log('✅ Compiled successfully');
  } catch (error) {
    console.log(`❌ ${error.name}: ${error.message}`);
    if (error.details?.suggestion) {
      console.log(`💡 Suggestion: ${error.details.suggestion}`);
    }
  }
});

console.log('\n' + '='.repeat(50) + '\n');

// Demo 3: Validation and Warnings
console.log('3️⃣ Validation and Warnings:');
console.log('----------------------------');

const patternsWithWarnings = [
  '[0123456789]+', // Long character list
  '[charU+charL]+[charU+charL]+', // Adjacent quantifiers
  '[]', // Empty character class
];

patternsWithWarnings.forEach((pattern, index) => {
  console.log(`\nPattern ${index + 1}: "${pattern}"`);
  
  const validation = lenientPrx.validate(pattern);
  console.log(`Valid: ${validation.isValid}`);
  
  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    validation.warnings.forEach(warning => {
      console.log(`   - ${warning.message}`);
    });
  }
  
  if (validation.errors.length > 0) {
    console.log('❌ Errors:');
    validation.errors.forEach(error => {
      console.log(`   - ${error.message}`);
    });
  }
});

console.log('\n' + '='.repeat(50) + '\n');

// Demo 4: Debug Utilities
console.log('4️⃣ Debug Utilities:');
console.log('-------------------');

const debugPattern = '[charU&charL&0-9]{8,}';
console.log(`Debugging pattern: "${debugPattern}"`);

const debugInfo = PrettyRegex.debug(debugPattern);
console.log('\nDebug Information:');
console.log(`Original: ${debugInfo.original}`);
console.log(`Parsed: ${debugInfo.parsed}`);
console.log(`Compiled: ${debugInfo.compiled}`);
console.log(`Valid: ${debugInfo.isValid}`);

if (debugInfo.suggestions.length > 0) {
  console.log('\n💡 Suggestions:');
  debugInfo.suggestions.forEach(suggestion => {
    console.log(`   - ${suggestion}`);
  });
}

console.log('\n' + '='.repeat(50) + '\n');

// Demo 5: Performance and Suggestions
console.log('5️⃣ Performance and Suggestions:');
console.log('--------------------------------');

const complexPattern = '[ABCDEFGHIJKLMNOPQRSTUVWXYZ]+[0123456789]{3}';
console.log(`Complex pattern: "${complexPattern}"`);

const suggestions = PrettyRegex.getSuggestions(complexPattern);
if (suggestions.length > 0) {
  console.log('\n💡 Optimization Suggestions:');
  suggestions.forEach(suggestion => {
    console.log(`   - ${suggestion}`);
  });
}

// Show optimized version
const optimizedPattern = '[charU]+[0-9]{3}';
console.log(`\nOptimized pattern: "${optimizedPattern}"`);
console.log(`Compiled: ${PrettyRegex.compile(optimizedPattern).toString()}`);

console.log('\n' + '='.repeat(50) + '\n');

// Demo 6: Advanced Features
console.log('6️⃣ Advanced Features:');
console.log('---------------------');

// MUST requirements with ranges
const passwordPattern = '[charU&charL&0-9&char(!)]{8,}';
console.log(`Password pattern: "${passwordPattern}"`);

try {
  const passwordRegex = strictPrx.compile(passwordPattern);
  console.log(`Compiled: ${passwordRegex.toString()}`);
  
  const testPasswords = ['User123!', 'user123!', 'USER123!', 'User123'];
  testPasswords.forEach(password => {
    const isValid = passwordRegex.test(password);
    console.log(`"${password}": ${isValid ? '✅' : '❌'}`);
  });
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Demo 7: Static Methods
console.log('7️⃣ Static Methods:');
console.log('------------------');

// Quick validation
const quickTest = PrettyRegex.test('[charU+charL]+', 'Hello');
console.log(`Quick test: ${quickTest}`);

// Quick match
const matches = PrettyRegex.match('[charU]+', 'Hello World');
console.log(`Matches: ${matches}`);

// Quick replace
const replaced = PrettyRegex.replace('[charU]', 'Hello World', 'X');
console.log(`Replaced: ${replaced}`);

console.log('\n' + '='.repeat(50) + '\n');

console.log('🎉 Production Demo Complete!');
console.log('\nKey Features Demonstrated:');
console.log('✅ Comprehensive error handling');
console.log('✅ Pattern validation with warnings');
console.log('✅ Debug utilities for troubleshooting');
console.log('✅ Performance suggestions');
console.log('✅ Static methods for convenience');
console.log('✅ Graceful error recovery');
console.log('✅ Informative error messages');

console.log('\n📦 Ready for NPM publication!'); 