const PrettyRegex = require('./src/index');

const prx = new PrettyRegex();

// Test the pattern that's failing
const pattern = '(charU&charL&[0-9]&emoji){,8}';

console.log('Original pattern:', pattern);
const parsedPattern = prx.parse(pattern);
console.log('Parsed pattern:', parsedPattern);

// Test the compiled regex
const regex = new RegExp(parsedPattern, 'u');
console.log('Compiled regex:', regex);

// Test the specific cases from the test
console.log('\nTesting specific cases:');
console.log('bAnA0🥲 (should match):', regex.test('bAnA0🥲'));
console.log('banana🥲 (should NOT match - missing uppercase):', regex.test('banana🥲'));
console.log('bAnA🥲 (should NOT match - missing digit):', regex.test('bAnA🥲'));
console.log('bAnA0 (should NOT match - missing emoji):', regex.test('bAnA0'));
console.log('BANA0🥲 (should NOT match - missing lowercase):', regex.test('BANA0🥲'));

// Test quantifier fixing
console.log('\nTesting quantifier fixing:');
console.log('{,8}:', prx.fixQuantifier('{,8}'));
console.log('{5,}:', prx.fixQuantifier('{5,}'));
console.log('{3}:', prx.fixQuantifier('{3}'));
console.log('{2,5}:', prx.fixQuantifier('{2,5}'));

// Test individual components
console.log('\nTesting individual components:');
console.log('charU:', prx.parse('charU'));
console.log('charL:', prx.parse('charL'));
console.log('[0-9]:', prx.parse('[0-9]'));
console.log('emoji:', prx.parse('emoji'));

// Test the group content parsing
console.log('\nTesting group content parsing:');
const groupContent = 'charU&charL&[0-9]&emoji';
console.log('Group content:', groupContent);
console.log('Parsed group content:', prx.parseGroupContent(groupContent)); 