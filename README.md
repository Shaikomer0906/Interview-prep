# Interview Prep Coach - Setup Guide

## 🎯 What You Have

A fully functional AI-powered Interview Preparation Coach website with:
- ✅ Chat-based multi-turn conversation interface
- ✅ 40+ hardcoded interview questions (Data, Backend, Frontend, DevOps, General roles)
- ✅ Claude API integration for contextual coaching feedback
- ✅ Session management for conversation history
- ✅ Role detection based on job title
- ✅ Responsive design (mobile-friendly)

## 📋 Project Files

```
Interview-prep/
├── server.js                    # Express backend + Claude API
├── interview_prep_chat.html     # Chat-based frontend interface
├── interview_prep.html          # Original (archived reference)
├── package.json                 # Dependencies
├── .env                         # Configuration (add your API key here)
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This installs:
- **express** - Web server framework
- **dotenv** - Environment variable loader
- **@anthropic-ai/sdk** - Claude API client

### 2. Configure API Key
Edit `.env` file and add your Claude API key:
```
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
PORT=3000
NODE_ENV=development
```

Get your Claude API key from: https://console.anthropic.com/

### 3. Run the Server
```bash
npm start
```

You should see:
```
🚀 Interview Prep Coach running at http://localhost:3000
```

### 4. Open in Browser
Visit: **http://localhost:3000**

## 💬 How It Works

### Flow
1. **Enter Job Title** - e.g., "Senior Backend Engineer", "Data Scientist", "Frontend Developer"
2. **See 5 Questions** - Hardcoded, role-specific interview questions appear
3. **Ask Follow-ups** - Type questions, request clarification, or ask for tips
4. **Get AI Coaching** - Claude provides contextual feedback and coaching tips
5. **Continue Conversation** - Multi-turn support maintains full context

### Example Prompts
- "Can you explain what you mean by ETL?"
- "How would I answer the first question in an interview?"
- "Give me tips on answering behavioral questions"
- "Can you ask me a harder question on this topic?"
- "Help me structure my answer using STAR method"

## 🛠️ Technical Details

### Backend (server.js)
- **Endpoint `/api/generate`** - Takes job title → returns 5 hardcoded Q&As
- **Endpoint `/api/chat`** - Takes user message + context → returns Claude-generated response
- **Session Management** - Maintains conversation history in memory
- **Role Detection** - Keywords in job title map to 5 categories

### Frontend (interview_prep_chat.html)
- **Chat Interface** - Message bubbles for user and coach
- **Questions Display** - Initial Q&As shown as reference
- **Session Tracking** - Unique session ID per user
- **Real-time Feedback** - Immediate responses from Claude API

### Claude Integration
- **Model** - `claude-opus-4-6` (best quality for coaching)
- **Context** - System prompt + conversation history + questions context
- **Max Tokens** - 500 per response (concise feedback)

## 🔄 Conversation Examples

**User:** "What is ETL?"
**Coach:** "Great question! ETL stands for Extract, Transform, Load. It's the process of pulling data from various sources (Extract), cleaning and restructuring it for analysis purposes (Transform), and finally storing it in a data warehouse or analytics platform (Load). This ensures data consistency and reliability for reporting..."

**User:** "How would I answer the second question in an interview?"
**Coach:** "Excellent approach! Here's how I'd structure it: Start with context (what was the pipeline), explain the specific bottleneck you found (include metrics), describe your optimization strategy, and finish with measurable impact. Example: 'We had a 50-second pipeline delay in our transform stage. I profiled the code, identified N+1 queries, optimized with batch processing, and reduced latency to 8 seconds...' "

## 📊 Role Categories

The coach auto-detects roles:
- **Data** - Data Engineer, Data Analyst, Data Scientist, ML Engineer
- **Backend** - Backend Engineer, API Developer, Python/Java/Node Developer
- **Frontend** - Frontend Engineer, React/Vue/Angular Developer, UI Developer
- **DevOps** - DevOps Engineer, SRE, Cloud Engineer, Platform Engineer
- **General** - Any other role (default)

## 🐛 Troubleshooting

### "Cannot find module 'express'"
- Run: `npm install`

### "CLAUDE_API_KEY is not set"
- Edit `.env` and add your API key
- Get one at https://console.anthropic.com/

### "Connection refused at localhost:3000"
- Check if server is running: `npm start`
- Try different port: Edit .env → PORT=3001

### "No response from Claude"
- Check API key is valid
- Check internet connection
- Review Claude API quota/rate limits

## 📝 Features

- ✅ Multi-turn conversation with full context
- ✅ Hardcoded + AI-generated coaching
- ✅ STAR method guidance for behavioral questions
- ✅ Session-based conversation history
- ✅ Role-specific questions (5 categories)
- ✅ Mobile responsive design
- ✅ Real-time feedback
- ✅ No external database (in-memory sessions)

## 🔐 Security Notes

- API key stored in `.env` (in .gitignore, not committed)
- Sessions stored in server memory (lost on restart)
- For production: Use persistent session store (Redis, database)
- HTTPS recommended for deployment

## 📚 Advanced Usage

### Support Multiple Sessions
Each user gets a unique session ID. The server tracks conversations separately.

### Extend Question Database
Add more questions to `roleTemplates` in `server.js`:
```javascript
data: [
  { question: "...", answer: ["...", "..."] },
  // Add more here
]
```

### Customize System Prompt
Edit the `systemPrompt` in `/api/chat` endpoint to change coaching style.

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Heroku
```bash
heroku create
heroku config:set CLAUDE_API_KEY=sk-ant-...
git push heroku main
```

### Local/VPS
- Run `npm start` on your server
- Use PM2 for process management
- Set up reverse proxy with nginx

## 📄 License & Attribution

Built with:
- Express.js
- Claude API by Anthropic
- Vanilla HTML/CSS/JavaScript

---

**Ready to coach interview candidates!** 🎓
