#!/bin/bash

# Repository cleanup and validation script for Cap'n Web + Auth0 Demo

echo "🧹 Cleaning up Cap'n Web + Auth0 Demo repository..."

# Remove any log files that might have been created
find . -name "*.log" -type f -delete 2>/dev/null || true

# Remove any temporary files
find . -name "*.tmp" -name "*.temp" -type f -delete 2>/dev/null || true

# Ensure .env is not tracked
if git ls-files --error-unmatch .env > /dev/null 2>&1; then
    echo "⚠️  WARNING: .env file is being tracked by git!"
    echo "   Run: git rm --cached .env"
fi

# Check if required files exist
echo "✅ Checking required files..."
required_files=(".env.example" "README.md" "package.json" "server/index.js" "client/index.html" "client/client.js")

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✓ $file"
    else
        echo "   ❌ Missing: $file"
    fi
done

# Validate package.json
echo "✅ Validating package.json..."
if npm run --silent lint > /dev/null 2>&1; then
    echo "   ✓ package.json is valid"
else
    echo "   ⚠️  package.json might have issues"
fi

# Check environment template
echo "✅ Checking environment template..."
if grep -q "your-domain.us.auth0.com" .env.example; then
    echo "   ✓ .env.example contains placeholder values"
else
    echo "   ⚠️  .env.example might be missing placeholders"
fi

echo "🎉 Repository cleanup complete!"
echo ""
echo "📝 Next steps for publishing:"
echo "   1. Update repository URLs in package.json"
echo "   2. Test the application with fresh .env configuration"
echo "   3. Update README.md with any final changes"
echo "   4. Create a release tag"
echo ""
echo "🚀 Ready for: npm publish or git push"