# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-06-31

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

## [1.0.3] - 2025-06-31

### Added
- Changed all references of pretty-regex to prx-regex to match NPM name

## [1.0.4] (aka. 1.0.3a) - 2025-06-31 

### Added
- Revised [README](README.md) for better publish display.

## [1.1.2] - 2025-06-31

### Added
- String match functionality using `string()`.

### Removed
- Workflows (they dont work)

## [IN DEVELOPMENT]