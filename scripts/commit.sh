#!/bin/bash

echo "🚀 Initiating magic pre-commit sequence..."

echo "🎨 Formatting Python code with Black..."
python3 -m black . --check
if [ $? -ne 0 ]; then
  echo "⚠️ Black demands attention! Formatting issues detected."
else
  echo "✨ All Python files are in harmony thanks to Black."
fi

diff_content=$(git diff HEAD | python3 -c "
import sys
import json
content = sys.stdin.read()[:1000]
escaped = json.dumps(content)
print(escaped)
")

payload=$(echo "$diff_content" | python3 -c "
import sys
import json
diff_content = sys.stdin.read()
payload = {
    'model': 'llama3.2',
    'prompt': f'Analyze this git diff and suggest a concise commit message (max 50 chars): {diff_content}',
    'stream': False
}
print(json.dumps(payload))
")

echo "🤖 Analyzing changes with AI..."
ai_response=$(curl -s https://ollama.ranktip.com/api/generate \
  -H "Content-Type: application/json" \
  -d "$payload")

suggested_message=$(echo "$ai_response" | python3 -c "
import sys
import json
try:
    response = json.loads(sys.stdin.read())
    print(response.get('response', 'No suggestion available'))
except:
    print('Error parsing AI response')
")

echo "🤔 What kind of change are you committing?"
select opt in "✨ Feature" "🐛 Bugfix" "🚑 Hotfix" "🚀 Improvement" "📝 Documentation" "♻️ Refactor" "💄 Style" "✅ Test" "🔨 Chore"; do
  case $REPLY in
    1) commitType="✨ feat"; break;;
    2) commitType="🐛 fix"; break;;
    3) commitType="🚑 hotfix"; break;;
    4) commitType="🚀 improvement"; break;;
    5) commitType="📝 docs"; break;;
    6) commitType="♻️ refactor"; break;;
    7) commitType="💄 style"; break;;
    8) commitType="✅ test"; break;;
    9) commitType="🔨 chore"; break;;
    *) echo "🤯 That's not a valid option. Try again?";;
  esac
done

echo -e "\n📜 Please type your commit message:\n(Suggested: $suggested_message)\n\n"
read commitMessage

if [ -z "$commitMessage" ]; then
  commitMessage=$suggested_message
fi

magicCommitMessage="$commitType: $commitMessage"

echo "🧙‍♂️ Gathering all your changes..."
git add .

echo "🔮 Sealing your changes with a spell: '$magicCommitMessage'"
git commit -m "$magicCommitMessage"
echo "🎉 Ta-da"

