# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Pretty RegEx
- Human-readable regex syntax with simplified patterns
- Character classes: `charU`, `charL`, `char`, `0-9`, etc.
- Quantifiers: `+`, `*`, `?`, `{n}`, `{n,m}`
- Character ranges: `[0-9]`, `[a-z]`, `[A-Z]`, `[a-E]` (mixed case)
- MUST requirements with `&` operator: `[charU&charL&0-9]`
- Union operator with `+`: `[charU+charL+0-9]`
- Literal characters with `char()` syntax
- Anchors: `start`, `end`, `word`, `notword`
- Grouping and OR operators: `()`, `|`
- Comprehensive error handling with custom error classes
- Pattern validation with detailed error messages
- Debug utilities for pattern analysis
- Performance warnings and suggestions
- Static methods for convenience
- Full test coverage (95+ tests)
- Comprehensive documentation

### Features
- **Character Classes**: Simplified syntax for common character sets
- **Character Ranges**: Support for numeric and alphabetic ranges
- **Mixed Case Ranges**: Automatic handling of case-insensitive ranges
- **MUST Requirements**: Enforce all character types with `&` operator
- **Union Operations**: Traditional union behavior with `+` operator
- **Validation**: Pre-compilation pattern validation
- **Error Handling**: Graceful error handling with informative messages
- **Debugging**: Built-in debugging utilities
- **Performance**: Optimized parsing and compilation

### Technical
- Node.js >= 14.0.0 support
- MIT License
- Comprehensive test suite
- Production-ready error handling
- Modular architecture
- Extensible design

## [Unreleased]

### Planned
- TypeScript definitions
- Browser support
- Additional character classes
- Performance optimizations
- Plugin system 