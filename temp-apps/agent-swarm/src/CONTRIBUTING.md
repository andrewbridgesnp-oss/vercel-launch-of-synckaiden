# Contributing to Agentic AI Business Swarm

First off, thank you for considering contributing to Agentic AI Business Swarm! It's people like you that make this the App of the Year 2026. 🎉

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@agenticaiswarm.com.

## 🎯 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari, Firefox]
 - Version: [e.g. 2026.1.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** describing the enhancement
- **Detailed description** of the proposed functionality
- **Use cases** explaining why this would be useful
- **Mockups** or examples if applicable

### Pull Requests 🔄

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

## 📋 Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/agentic-ai-swarm.git

# Add upstream remote
git remote add upstream https://github.com/original/agentic-ai-swarm.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(agents): add new agent deployment wizard
fix(workflow): resolve drag-and-drop issue in builder
docs(api): update authentication endpoint documentation
perf(dashboard): optimize swarm visualization rendering
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// ✅ Good
interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
}

// ❌ Bad
const a: any = {};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Follow the DRY principle

```typescript
// ✅ Good
export function AgentCard({ agent }: { agent: Agent }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="agent-card">
      {/* Component content */}
    </div>
  );
}

// ❌ Bad - Component too large, multiple responsibilities
```

### Styling

- Use Tailwind CSS utility classes
- Follow the synckaiden.com design aesthetic
- Maintain dark theme optimization
- Use semantic color names from the design system

```tsx
// ✅ Good
<div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">

// ❌ Bad - Inline styles
<div style={{ backgroundColor: '#1e293b' }}>
```

### File Organization

```
components/
  ├── ComponentName/
  │   ├── ComponentName.tsx
  │   ├── ComponentName.test.tsx
  │   └── index.ts
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Writing Tests

- Write unit tests for utilities and hooks
- Write integration tests for components
- Aim for >80% code coverage
- Test edge cases and error scenarios

```typescript
import { render, screen } from '@testing-library/react';
import { AgentCard } from './AgentCard';

describe('AgentCard', () => {
  it('renders agent name', () => {
    const agent = { id: '1', name: 'Agent Alpha', status: 'active' };
    render(<AgentCard agent={agent} />);
    expect(screen.getByText('Agent Alpha')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Document complex logic
- Include examples in documentation

```typescript
/**
 * Deploys a new agent to the swarm
 * @param config - Agent configuration
 * @returns Promise resolving to the created agent
 * @example
 * const agent = await deployAgent({
 *   name: 'Agent Omega',
 *   type: 'Market Intelligence'
 * });
 */
export async function deployAgent(config: AgentConfig): Promise<Agent> {
  // Implementation
}
```

### README Updates

When adding new features:
- Update the features list in README.md
- Add usage examples if applicable
- Update screenshots if UI changed

## 🚀 Release Process

### Version Numbering

We use the format: `YEAR.MAJOR.MINOR`

- **YEAR**: Calendar year (2026)
- **MAJOR**: Major features or breaking changes
- **MINOR**: Minor features, improvements, bug fixes

### Creating a Release

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Create a git tag: `git tag v2026.1.0`
4. Push tag: `git push origin v2026.1.0`
5. GitHub Actions will automatically deploy

## 🏆 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Featured on our website (for significant contributions)
- Eligible for swag and rewards

## 💬 Communication

### Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and ideas
- **Discord**: Real-time chat (coming soon)
- **Email**: team@agenticaiswarm.com

### Response Times

- Bug reports: Within 48 hours
- Feature requests: Within 1 week
- Pull requests: Within 3 days
- Security issues: Within 24 hours

## 🔒 Security

### Reporting Security Issues

**DO NOT** create a public issue for security vulnerabilities. Instead:

1. Email security@agenticaiswarm.com
2. Include detailed description
3. Provide steps to reproduce
4. Suggest a fix if possible

We will:
- Acknowledge within 24 hours
- Provide a fix timeline
- Keep you updated on progress
- Credit you in the security advisory

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Don't hesitate to ask questions! We're here to help:

- Open a GitHub Discussion
- Email team@agenticaiswarm.com
- Join our Discord community

## 🎉 Thank You!

Your contributions make Agentic AI Business Swarm the best platform for autonomous business operations. We appreciate your time and effort!

---

**Happy Contributing! 🚀**

*Building the future of business automation, together.*
