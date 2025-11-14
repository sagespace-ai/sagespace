# SageSpace Testing Guide

## Overview

SageSpace uses Vitest for unit and integration testing with React Testing Library for component tests.

## Running Tests

\`\`\`bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
\`\`\`

## Test Structure

\`\`\`
__tests__/
├── components/       # Component tests
├── lib/
│   ├── ai/          # AI system tests (Dreamer, scoring, semantic analysis)
│   └── governance/  # Governance policy tests
└── integration/     # Integration tests
\`\`\`

## Writing Tests

### Component Tests

\`\`\`typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
\`\`\`

### API Tests

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest'
import { myApiFunction } from '@/lib/api'

describe('myApiFunction', () => {
  it('should return expected data', async () => {
    const result = await myApiFunction()
    expect(result).toBeDefined()
  })
})
\`\`\`

## Test Coverage Goals

- **Critical paths**: 90%+ coverage
  - Authentication flows
  - Payment processing
  - Dreamer v2 proposal generation
  - Governance policy checks
- **UI components**: 70%+ coverage
- **Utilities**: 80%+ coverage

## Mocking

### Supabase Client

\`\`\`typescript
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    })),
  }),
}))
\`\`\`

### Next.js Router

\`\`\`typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/test-path',
}))
\`\`\`

## Best Practices

1. **Test behavior, not implementation** - Focus on what users see and do
2. **Use descriptive test names** - "should display error message when login fails"
3. **Arrange-Act-Assert pattern** - Set up, execute, verify
4. **Mock external dependencies** - Database, APIs, third-party services
5. **Test edge cases** - Empty states, errors, loading states
6. **Keep tests isolated** - Each test should be independent

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before deployments

Deployment is blocked if:
- Any test fails
- Coverage drops below thresholds
- Critical path tests fail

## Debugging Tests

\`\`\`bash
# Run specific test file
npm test scoring.test.ts

# Run tests matching pattern
npm test -- --grep "Dreamer"

# Run with detailed output
npm test -- --reporter=verbose
\`\`\`

## Future Improvements

- [ ] Add E2E tests with Playwright
- [ ] Increase coverage to 85%+ overall
- [ ] Add visual regression testing
- [ ] Add performance benchmarks
- [ ] Add accessibility tests
