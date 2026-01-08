using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using System.Text.Json;

namespace tasdev.skillssolaus;

/// <summary>
/// AI-powered chatbot using OpenAI GPT for Skills Solutions Australia
/// Provides intelligent responses about internship programs, career services, and company information
/// </summary>
public class OpenAIChatbotFunction
{
    private readonly ILogger<OpenAIChatbotFunction> _logger;
    private readonly ChatClient _chatClient;
    
    // Company knowledge base for context
    private const string SYSTEM_PROMPT = @"You are an AI Assistant for Skills Solutions Australia, Tasmania's leading ICT career development organisation. 

ABOUT SKILLS SOLUTIONS AUSTRALIA:
- We bridge Tasmania's ICT skills gap through practical internship programs
- Based in Tasmania, serving the entire state's tech community
- Winner of TAS ICT 2022 Award for Development of ICT Employment Opportunities
- Study TAS Industry Partner of the Year 2022 & 2023

OUR SERVICES:
• Future Ready Internship Program (6-month structured placements)
• Comprehensive career services (resume writing, interview prep, career guidance)
• Professional networking opportunities
• Skills assessment and development
• Employer partnership programs

KEY PROGRAMS:
1. Future Ready Internship Program:
   - 6-month structured internship placements
   - Real-world project experience with industry partners
   - Professional mentorship and career support
   - Technology companies, government agencies, healthcare, financial services partners

2. Career Services:
   - Professional resume writing and optimisation
   - Cover letter creation and customization
   - Interview preparation and mock sessions
   - Career guidance and pathway planning
   - Professional networking facilitation

WEBSITE: skillssolutionsaustralia.com
LOCATION: Tasmania, Australia

PERSONALITY: Be helpful, professional, enthusiastic about career development, knowledgeable about ICT industry trends, and always encouraging. Keep responses conversational but informative. If asked about specific details not in your knowledge base, direct users to contact the team or visit the website for the most current information.

Always respond as an AI Assistant and maintain a friendly, professional tone that reflects the company's mission to empower ICT graduates for workforce success.";

    public OpenAIChatbotFunction(ILogger<OpenAIChatbotFunction> logger)
    {
        _logger = logger;
        
        // Initialize OpenAI client with API key from environment variables
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") 
            ?? throw new InvalidOperationException("OPENAI_API_KEY environment variable is required");
            
        _chatClient = new ChatClient("gpt-3.5-turbo", apiKey);
    }

    /// <summary>
    /// Handle AI-powered chat requests
    /// </summary>
    /// <param name="req">HTTP request containing user message and conversation history</param>
    /// <returns>AI-generated response with message and optional quick replies</returns>
    [Function("ai-chat")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "ai-chat")] HttpRequest req)
    {
        try
        {
            _logger.LogInformation("AI Chatbot request received.");

            // Read request body
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            
            if (string.IsNullOrEmpty(requestBody))
            {
                return new BadRequestObjectResult(new { error = "Request body is required" });
            }

            // Parse request
            var chatRequest = JsonSerializer.Deserialize<AIChatRequest>(requestBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (chatRequest?.Message == null)
            {
                return new BadRequestObjectResult(new { error = "Message is required" });
            }

            // Validate input
            if (chatRequest.Message.Length > 1000)
            {
                return new BadRequestObjectResult(new { error = "Message too long. Maximum 1000 characters." });
            }

            // Generate AI response
            var response = await GenerateAIResponse(chatRequest);

            _logger.LogInformation($"Generated AI response for message: {chatRequest.Message[..Math.Min(50, chatRequest.Message.Length)]}...");

            return new OkObjectResult(response);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Invalid JSON in request");
            return new BadRequestObjectResult(new { error = "Invalid JSON format" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing AI chatbot request");
            return new StatusCodeResult(500);
        }
    }

    /// <summary>
    /// Generate AI response using OpenAI GPT
    /// </summary>
    /// <param name="request">Chat request with message and history</param>
    /// <returns>AI-generated chat response</returns>
    private async Task<AIChatResponse> GenerateAIResponse(AIChatRequest request)
    {
        try
        {
            // Build conversation messages
            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(SYSTEM_PROMPT)
            };

            // Add conversation history for context (last 10 messages)
            if (request.History != null)
            {
                foreach (var historyMessage in request.History.TakeLast(10))
                {
                    if (historyMessage.Role.ToLowerInvariant() == "user")
                    {
                        messages.Add(new UserChatMessage(historyMessage.Content));
                    }
                    else if (historyMessage.Role.ToLowerInvariant() == "assistant")
                    {
                        messages.Add(new AssistantChatMessage(historyMessage.Content));
                    }
                }
            }

            // Add current user message
            messages.Add(new UserChatMessage(request.Message));

            // Call OpenAI API
            var chatCompletion = await _chatClient.CompleteChatAsync(messages, new ChatCompletionOptions
            {
                MaxOutputTokenCount = 500,
                Temperature = 0.7f,
                FrequencyPenalty = 0.1f,
                PresencePenalty = 0.1f
            });

            var aiResponse = chatCompletion.Value.Content[0].Text;

            // Generate contextual quick replies based on the response
            var quickReplies = GenerateQuickReplies(request.Message, aiResponse);

            return new AIChatResponse
            {
                Message = aiResponse,
                QuickReplies = quickReplies,
                IsAI = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling OpenAI API");
            
            // Fallback to predefined response
            return new AIChatResponse
            {
                Message = "I'm experiencing technical difficulties right now. Please try again in a moment, or contact our team directly for immediate assistance at skillssolutionsaustralia.com",
                QuickReplies = new[] { "Try again", "Contact us", "Visit website" },
                IsAI = false
            };
        }
    }

    /// <summary>
    /// Generate contextual quick reply suggestions
    /// </summary>
    /// <param name="userMessage">Original user message</param>
    /// <param name="aiResponse">AI-generated response</param>
    /// <returns>Array of quick reply suggestions</returns>
    private string[] GenerateQuickReplies(string userMessage, string aiResponse)
    {
        var message = userMessage.ToLowerInvariant();
        
        // Contextual quick replies based on conversation topics
        if (message.Contains("internship") || message.Contains("program"))
        {
            return new[] { "How to apply", "Eligibility requirements", "Program benefits", "Success stories" };
        }
        else if (message.Contains("resume") || message.Contains("cv") || message.Contains("career"))
        {
            return new[] { "Resume tips", "Interview prep", "Career guidance", "Pricing info" };
        }
        else if (message.Contains("contact") || message.Contains("apply"))
        {
            return new[] { "Contact us", "Application form", "Schedule call", "Visit website" };
        }
        else if (message.Contains("employer") || message.Contains("partnership"))
        {
            return new[] { "Partnership benefits", "How to partner", "Success stories", "Contact team" };
        }
        else
        {
            return new[] { "Tell me more", "How to get started", "Contact us", "Visit website" };
        }
    }
}

/// <summary>
/// Request model for AI chat API
/// </summary>
public class AIChatRequest
{
    public string Message { get; set; } = string.Empty;
    public List<ConversationMessage>? History { get; set; }
}

/// <summary>
/// Response model for AI chat API
/// </summary>
public class AIChatResponse
{
    public string Message { get; set; } = string.Empty;
    public string[]? QuickReplies { get; set; }
    public bool IsAI { get; set; } = true;
}
