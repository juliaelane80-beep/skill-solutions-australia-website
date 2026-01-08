# OpenAI Chatbot Integration Setup Guide

## 🚀 Overview
Your chatbot now supports OpenAI integration for intelligent, natural language responses with a robust fallback system.

## 📋 Setup Steps

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

### 2. Configure Local Development
1. Open `api/local.settings.json`
2. Replace `"your-openai-api-key-here"` with your actual API key:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
       "OPENAI_API_KEY": "sk-your-actual-api-key-here"
     }
   }
   ```

### 3. Configure Azure Production
For your live Azure deployment:
1. Go to Azure Portal
2. Find your Azure Functions app
3. Go to Configuration → Application Settings
4. Add new setting:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

## 🔄 How It Works

### Three-Tier System:
1. **Primary: OpenAI GPT** (`/api/ai-chat`)
   - Intelligent, natural responses
   - Understands context and complex questions
   - Provides conversational experience

2. **Fallback: Keyword System** (`/api/chat`)
   - Your existing keyword-based responses
   - Fast and reliable backup
   - No API costs

3. **Client Fallback: Hardcoded Responses**
   - Works even when APIs are down
   - Basic help and contact information

### Features:
- ✨ **AI Badge**: Shows when responses are AI-powered
- 🎯 **Context Awareness**: Remembers conversation history
- 🚀 **Smart Fallback**: Seamlessly switches if AI fails
- 💰 **Cost Efficient**: Uses GPT-3.5-turbo (cheaper than GPT-4)
- 🛡️ **Error Handling**: Graceful degradation

## 🧪 Testing

### Test the Integration:
1. Build the project: Use VS Code build task
2. Start the API: Use the Azure Functions task
3. Test questions like:
   - "How does the internship program work?"
   - "What career services do you offer?"
   - "Can you help me with my resume?"
   - "Tell me about partnership opportunities"

### Expected Behavior:
- **With OpenAI Key**: Intelligent, contextual responses with ✨ AI badge
- **Without OpenAI Key**: Falls back to keyword responses (no badge)
- **API Down**: Client-side fallback responses

## 💡 Benefits

### For Users:
- Natural conversation flow
- Better understanding of complex questions
- Contextual follow-up responses
- Professional, branded experience

### For You:
- Reduced support workload
- Better user engagement
- Professional AI-powered experience
- Maintains reliability with fallbacks

## 📊 Cost Considerations
- GPT-3.5-turbo costs approximately $0.0015 per 1K tokens
- Average response ~200 tokens = $0.0003 per interaction
- 1000 conversations ≈ $0.30
- Much cheaper than human support time

## 🔧 Customization
The AI has detailed knowledge about:
- Your internship program structure
- Career services offered
- Company background and awards
- Tasmania-specific context
- Professional tone matching your brand

You can modify the `SYSTEM_PROMPT` in `OpenAIChatbotFunction.cs` to adjust the AI's knowledge or personality.

## 🚨 Security Notes
- Never commit API keys to git
- Use environment variables for all deployments
- Monitor API usage in OpenAI dashboard
- Set usage limits if needed

## 📞 Support
If you need help setting this up:
1. Check Azure Functions logs for errors
2. Verify API key format (starts with `sk-`)
3. Test with simple questions first
4. Monitor browser developer console for any errors

Your chatbot is now ready for intelligent conversations! 🎉
