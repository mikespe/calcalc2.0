# Testing Guide

This project uses Jest and React Testing Library for unit and integration tests.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located in `__tests__` directories next to the files they test:

- `src/lib/__tests__/` - Utility function tests
- `src/app/api/**/__tests__/` - API route tests
- `src/components/__tests__/` - Component tests
- `src/middleware/__tests__/` - Middleware tests

## Coverage Goals

The project aims for at least 75% code coverage across:
- Branches
- Functions
- Lines
- Statements

## Test Types

### API Route Tests
- Authentication checks
- Request validation
- Success and error responses
- Database interactions (mocked)

### Component Tests
- Rendering
- User interactions
- State management
- Props handling

### Utility Tests
- Function logic
- Edge cases
- Error handling

## Writing New Tests

When adding new functionality:

1. Create test file in appropriate `__tests__` directory
2. Mock external dependencies (Prisma, fetch, etc.)
3. Test happy paths and error cases
4. Ensure tests are isolated and independent
5. Update coverage thresholds if needed

## Mocking

Common mocks are set up in `jest.setup.js`:
- Next.js router
- Window.location
- Testing Library jest-dom matchers

Additional mocks should be created in test files as needed.

