/**
 * Pretty RegEx - TypeScript Definitions
 * A simplified syntax for creating regular expressions
 */

declare module 'pretty-regex' {
  /**
   * Main Pretty RegEx class for parsing simplified regex syntax
   */
  export default class PrettyRegex {
    /**
     * Create a new PrettyRegex instance
     */
    constructor();

    /**
     * Character class mappings
     */
    readonly charClasses: Record<string, string>;

    /**
     * Quantifier mappings
     */
    readonly quantifiers: Record<string, string>;

    /**
     * Parse PRX syntax and convert to regular expression
     * @param prxPattern - The Pretty RegEx pattern
     * @param flags - RegExp flags (g, i, m, etc.)
     * @returns The compiled regular expression
     */
    compile(prxPattern: string, flags?: string): RegExp;

    /**
     * Parse PRX syntax and return regex string
     * @param prxPattern - The Pretty RegEx pattern
     * @returns The regex pattern string
     */
    parse(prxPattern: string): string;

    /**
     * Parse character class content (inside [])
     * @param content - Content inside the brackets
     * @returns Parsed character class
     */
    parseCharacterClass(content: string): string;

    /**
     * Escape literal characters for regex
     * @param char - Character to escape
     * @returns Escaped character
     */
    escapeLiteral(char: string): string;

    /**
     * Escape characters within character classes
     * @param char - Character to escape
     * @returns Escaped character for character class
     */
    escapeInCharClass(char: string): string;

    /**
     * Test if a string matches the PRX pattern
     * @param prxPattern - The Pretty RegEx pattern
     * @param testString - String to test
     * @param flags - RegExp flags
     * @returns Whether the string matches
     */
    test(prxPattern: string, testString: string, flags?: string): boolean;

    /**
     * Find matches in a string using PRX pattern
     * @param prxPattern - The Pretty RegEx pattern
     * @param testString - String to search
     * @param flags - RegExp flags
     * @returns Array of matches
     */
    match(prxPattern: string, testString: string, flags?: string): string[];

    /**
     * Replace matches in a string using PRX pattern
     * @param prxPattern - The Pretty RegEx pattern
     * @param testString - String to search and replace
     * @param replacement - Replacement string
     * @param flags - RegExp flags
     * @returns String with replacements
     */
    replace(
      prxPattern: string,
      testString: string,
      replacement: string,
      flags?: string
    ): string;

    /**
     * Static method: Parse PRX syntax and convert to regular expression
     * @param prxPattern - The Pretty RegEx pattern
     * @param flags - RegExp flags
     * @returns The compiled regular expression
     */
    static compile(prxPattern: string, flags?: string): RegExp;

    /**
     * Static method: Test if a string matches the PRX pattern
     * @param prxPattern - The Pretty RegEx pattern
     * @param testString - String to test
     * @param flags - RegExp flags
     * @returns Whether the string matches
     */
    static test(prxPattern: string, testString: string, flags?: string): boolean;

    /**
     * Static method: Find matches in a string using PRX pattern
     * @param prxPattern - The Pretty RegEx pattern
     * @param testString - String to search
     * @param flags - RegExp flags
     * @returns Array of matches
     */
    static match(prxPattern: string, testString: string, flags?: string): string[];

    /**
     * Static method: Replace matches in a string using PRX pattern
     * @param prxPattern - The Pretty RegEx pattern
     * @param testString - String to search and replace
     * @param replacement - Replacement string
     * @param flags - RegExp flags
     * @returns String with replacements
     */
    static replace(
      prxPattern: string,
      testString: string,
      replacement: string,
      flags?: string
    ): string;
  }

  /**
   * Advanced Pretty RegEx features
   */
  export class AdvancedPrettyRegex {
    /**
     * Create a new AdvancedPrettyRegex instance
     */
    constructor();

    /**
     * Advanced pattern mappings
     */
    readonly advancedPatterns: Record<string, string>;

    /**
     * Parse advanced PRX patterns
     * @param pattern - Advanced PRX pattern
     * @returns Regex pattern with advanced features
     */
    parseAdvanced(pattern: string): string;

    /**
     * Validation result interface
     */
    interface ValidationResult {
      errors: string[];
      warnings: string[];
    }

    /**
     * Validate if a pattern uses advanced features correctly
     * @param pattern - Pattern to validate
     * @returns Validation result with errors and warnings
     */
    validateAdvanced(pattern: string): ValidationResult;

    /**
     * Check if current JavaScript engine supports lookbehind
     * @returns Whether lookbehind is supported
     */
    supportsLookbehind(): boolean;

    /**
     * Check if current JavaScript engine supports Unicode property escapes
     * @returns Whether Unicode properties are supported
     */
    supportsUnicode(): boolean;

    /**
     * Get suggested flags for a pattern
     * @param pattern - Pattern to analyze
     * @returns Suggested flags
     */
    suggestFlags(pattern: string): string;
  }

  /**
   * Character class shortcuts available in PRX
   */
  export type CharacterClass =
    | 'charU'      // Uppercase letters [A-Z]
    | 'charL'      // Lowercase letters [a-z]
    | 'char'       // Any letter [a-zA-Z]
    | '0-9'        // Digits [0-9]
    | 'digit'      // Digits [0-9]
    | 'space'      // Literal space
    | 'tab'        // Literal tab (\t)
    | 'newline'    // Literal newline (\n)
    | 'whitespace' // Whitespace characters (\s)
    | 'notwhitespace' // Non-whitespace characters (\S)
    | 'wordchar'   // Word characters (\w)
    | 'notwordchar' // Non-word characters (\W)
    | 'any'        // Any character (.)
    | 'start'      // Start of string (^)
    | 'end'        // End of string ($)
    | 'word'       // Word boundary (\b)
    | 'notword';   // Non-word boundary (\B)

  /**
   * Advanced character classes and patterns
   */
  export type AdvancedPattern =
    | 'ascii'      // ASCII characters
    | 'latin'      // Latin characters
    | 'emoji'      // Basic emoji range
    | 'hex'        // Hexadecimal digits
    | 'octal'      // Octal digits
    | 'binary'     // Binary digits
    | 'email'      // Email pattern
    | 'url'        // URL pattern
    | 'ipv4'       // IPv4 address pattern
    | 'ipv6'       // IPv6 address pattern
    | 'phone'      // Phone number pattern
    | 'creditcard' // Credit card pattern
    | 'ssn'        // Social Security Number pattern
    | 'zipcode'    // ZIP code pattern
    | 'time24'     // 24-hour time format
    | 'time12'     // 12-hour time format
    | 'date'       // Date format
    | 'hexcolor'   // Hex color pattern
    | 'uuid';      // UUID pattern

  /**
   * Quantifier types available in PRX
   */
  export type Quantifier =
    | '+'          // One or more
    | '*'          // Zero or more
    | '?'          // Zero or one
    | '{n}'        // Exactly n times
    | '{n,m}';     // Between n and m times

  /**
   * Advanced regex features
   */
  export type AdvancedFeature =
    | 'lookahead'      // Positive lookahead (?=)
    | 'neglookahead'   // Negative lookahead (?!)
    | 'lookbehind'     // Positive lookbehind (?<=)
    | 'neglookbehind'  // Negative lookbehind (?<!)
    | 'group'          // Non-capturing group (?:)
    | 'namedgroup'     // Named capturing group (?<name>)
    | 'atomic'         // Atomic group (?>)
    | 'unicode'        // Unicode property (\p{})
    | 'notunicode'     // Negated unicode property (\P{})
    | 'ignorecase'     // Case insensitive mode (?i)
    | 'multiline'      // Multiline mode (?m)
    | 'singleline'     // Dotall mode (?s)
    | 'comment';       // Comment group (?#)

  /**
   * RegExp flags that can be used with PRX patterns
   */
  export type RegExpFlags = 
    | 'g'   // Global
    | 'i'   // Case insensitive
    | 'm'   // Multiline
    | 's'   // Dotall
    | 'u'   // Unicode
    | 'y';  // Sticky

  /**
   * Utility type for PRX pattern strings
   */
  export type PRXPattern = string;

  /**
   * Utility functions for working with PRX patterns
   */
  export namespace Utils {
    /**
     * Escape special characters in a string for use in PRX patterns
     * @param input - String to escape
     * @returns Escaped string
     */
    export function escape(input: string): string;

    /**
     * Combine multiple PRX patterns with OR operator
     * @param patterns - Array of PRX patterns
     * @returns Combined pattern
     */
    export function or(...patterns: string[]): string;

    /**
     * Create a character class from multiple character types
     * @param charTypes - Array of character class names
     * @returns Character class pattern
     */
    export function charClass(...charTypes: CharacterClass[]): string;

    /**
     * Wrap a pattern in a capturing group
     * @param pattern - PRX pattern to group
     * @returns Grouped pattern
     */
    export function group(pattern: string): string;

    /**
     * Apply a quantifier to a pattern
     * @param pattern - PRX pattern
     * @param quantifier - Quantifier to apply
     * @returns Pattern with quantifier
     */
    export function quantify(pattern: string, quantifier: Quantifier): string;
  }

  /**
   * Pre-built common patterns
   */
  export namespace Patterns {
    export const EMAIL: PRXPattern;
    export const URL: PRXPattern;
    export const PHONE: PRXPattern;
    export const IPV4: PRXPattern;
    export const IPV6: PRXPattern;
    export const UUID: PRXPattern;
    export const CREDIT_CARD: PRXPattern;
    export const SSN: PRXPattern;
    export const ZIP_CODE: PRXPattern;
    export const HEX_COLOR: PRXPattern;
    export const DATE: PRXPattern;
    export const TIME_24H: PRXPattern;
    export const TIME_12H: PRXPattern;
    export const PASSWORD_STRONG: PRXPattern;
    export const USERNAME: PRXPattern;
    export const SLUG: PRXPattern;
  }
} 