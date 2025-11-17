# Contributing to AstroPredict

Thank you for your interest in contributing to AstroPredict! We welcome contributions from everyone.

## Code of Conduct

Please be respectful and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Go to [Issues](https://github.com/saonda63-sketch/astro1/issues)
2. Click "New Issue"
3. Provide:
   - Descriptive title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Open an Issue with label "enhancement"
2. Describe the feature
3. Explain why it's needed
4. Provide examples if possible

### Submitting Code

1. **Fork the repository**
```bash
git clone https://github.com/saonda63-sketch/astro1.git
cd astro1
git remote add upstream https://github.com/saonda63-sketch/astro1.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow PEP 8 for Python code
   - Use meaningful variable/function names
   - Add comments for complex logic
   - Keep functions small and focused

4. **Test your changes**
```bash
# Backend
cd backend
pytest tests/

# Frontend
# Test in browser, check console for errors
```

5. **Commit your changes**
```bash
git commit -am 'Add new feature: description'
```

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request**
   - Go to the main repository
   - Click "Compare & pull request"
   - Describe your changes
   - Link any related issues

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install pytest pytest-cov
python app.py
```

### Frontend
```bash
cd frontend
python -m http.server 8000
```

## Code Style

### Python
- Follow PEP 8
- Use 4 spaces for indentation
- Max line length: 100 characters
- Use type hints where possible

```python
def calculate_zodiac_sign(birth_date: datetime) -> Dict[str, str]:
    """Calculate zodiac sign from birth date."""
    # Implementation
    return zodiac_info
```

### JavaScript
- Use meaningful variable names
- Use const/let, avoid var
- Add JSDoc comments for functions

```javascript
/**
 * Calculate life path number from birth date
 * @param {Date} birthDate - The birth date
 * @returns {number} The life path number
 */
function calculateLifePathNumber(birthDate) {
    // Implementation
    return number;
}
```

### CSS
- Use semantic class names
- Use CSS variables for colors
- Mobile-first approach

## Testing

### Backend Tests
```bash
cd backend
pytest tests/test_astrology_engine.py -v
pytest --cov=.  # With coverage
```

### Frontend Testing
- Use browser DevTools
- Check console for errors
- Test on multiple browsers
- Test responsive design

## Documentation

- Update README.md for major changes
- Add docstrings to all functions
- Update API.md if changing endpoints
- Include examples in commit messages

## Pull Request Process

1. Ensure your code is tested
2. Update documentation
3. Add yourself to CONTRIBUTORS.md
4. Describe changes in PR
5. Be responsive to feedback
6. Wait for approval from maintainers

## Commit Messages

Format:
```
Type: Brief description (50 chars max)

Detailed explanation (if needed)

Fixes #123
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat: Add transit calculation to astrology engine

Implemented transit calculations using PyEphem to show
current planetary positions relative to birth chart.

Fixes #45
```

## Help Wanted

Areas where we need help:
- [ ] Database integration
- [ ] Advanced astrological calculations
- [ ] Mobile app development
- [ ] UI/UX improvements
- [ ] Documentation
- [ ] Testing
- [ ] Translation/localization

## Questions?

- Open a discussion in GitHub Discussions
- Check existing documentation
- Review closed issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md
- GitHub contributors page
- Release notes

Thank you for helping make AstroPredict better! 🌟
