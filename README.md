# ARC EvalLab

An open-source AI evaluation platform for datasets, model providers, evaluators, batch evaluation runs, metrics, and regression detection.

## Overview

ARC EvalLab provides a comprehensive toolkit for evaluating AI models across datasets, with support for:

- **Datasets**: Schema validation, loading (JSON/JSONL), normalization, and versioning
- **Model Providers**: Abstraction layer for various AI model providers with deterministic local testing
- **Evaluators**: Flexible evaluation strategies including exact match, contains, regex, and structured JSON checks
- **Batch Execution**: Concurrent evaluation runs with retries, cancellation, and progress reporting
- **Metrics**: Accuracy, pass rate, latency, token/cost tracking, and aggregation
- **Regression Detection**: Baseline comparison, threshold detection, and regression reports
- **Persistence**: Repository abstraction for runs, results, and datasets
- **API**: RESTful endpoints for all core functionality
- **CLI**: Command-line interface for dataset management, evaluation, and inspection
- **Dashboard**: Web interface for visualization and monitoring

## Architecture

ARC EvalLab is built with a modular architecture organized into phases:

### Phase 1 — Foundation
Project metadata, documentation, development configuration, formatting, linting, testing foundation, and CI setup.

### Phase 2 — Core Domain
Domain models for Dataset, DatasetItem, EvaluationCase, ModelProvider, Evaluator, EvaluationRun, EvaluationResult, Metric, and Regression.

### Phase 3 — Datasets
Dataset schemas, validation, loaders, JSON/JSONL support, normalization, and versioning concepts.

### Phase 4 — Providers
Provider abstraction, mock provider, deterministic local provider, configuration, timeout/error handling, and response normalization.

### Phase 5 — Evaluators
Evaluator interface, exact match, contains, regex, structured JSON checks, custom evaluator support, and composition.

### Phase 6 — Execution
Single evaluation, batch execution, concurrency, retries, cancellation, progress reporting, and run lifecycle.

### Phase 7 — Metrics
Accuracy, pass rate, latency, token/cost metadata, aggregation, and serialization.

### Phase 8 — Regression
Baseline runs, comparison, threshold detection, regression reports, and improvement detection.

### Phase 9 — Storage
Repository abstraction, local persistence, run storage, result storage, dataset storage, and migrations.

### Phase 10 — API
Health, datasets, providers, evaluators, runs, results, metrics, and regression endpoints.

### Phase 11 — CLI
Dataset commands, evaluation commands, run inspection, result inspection, and regression comparison.

### Phase 12 — Dashboard
Overview, datasets, evaluation runs, results, metrics, and regression visualization.

### Phase 13 — Quality
Unit tests, integration tests, end-to-end tests, fixtures, CI, documentation, examples, error handling, security review, and performance testing.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/amaanforshopify-prog/arc-eval-lab.git
cd arc-eval-lab

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

## Development

ARC EvalLab follows a disciplined development process:

1. **Inspect**: Understand current repository state
2. **Plan**: Choose one small but meaningful engineering unit
3. **Implement**: Implement only that unit
4. **Test**: Add/update appropriate tests
5. **Verify**: Run relevant checks
6. **Review**: Inspect the resulting diff for quality
7. **Document**: Update documentation/task tracking
8. **Commit**: Create one meaningful conventional commit
9. **Update**: Update TASKS.md with completed work and next work

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Status

This project is currently in Phase 1 (Foundation). See [TASKS.md](TASKS.md) for detailed progress tracking.
