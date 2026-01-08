using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.IO;

namespace tasdev.skillssolaus;

/// <summary>
/// Chatbot API endpoint for handling AI chat requests
/// Implements Skills Solutions Australia business logic and responses
/// </summary>
public class ChatbotFunction
{
    private readonly ILogger<ChatbotFunction> _logger;

    public ChatbotFunction(ILogger<ChatbotFunction> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Handle chatbot conversation requests
    /// </summary>
    /// <param name="req">HTTP request containing user message and conversation history</param>
    /// <returns>AI response with message and optional quick replies</returns>
    [Function("chat")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "chat")] HttpRequest req)
    {
        try
        {
            _logger.LogInformation("Chatbot request received.");

            // Read request body
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            
            if (string.IsNullOrEmpty(requestBody))
            {
                return new BadRequestObjectResult(new { error = "Request body is required" });
            }

            // Parse request
            var chatRequest = JsonSerializer.Deserialize<ChatRequest>(requestBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (chatRequest?.Message == null)
            {
                return new BadRequestObjectResult(new { error = "Message is required" });
            }

            // Validate input
            if (chatRequest.Message.Length > 500)
            {
                return new BadRequestObjectResult(new { error = "Message too long. Maximum 500 characters." });
            }

            // Generate response based on user message
            var response = await GenerateResponse(chatRequest);

            _logger.LogInformation($"Generated response for message: {chatRequest.Message}");

            return new OkObjectResult(response);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Invalid JSON in request");
            return new BadRequestObjectResult(new { error = "Invalid JSON format" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing chatbot request");
            return new StatusCodeResult(500);
        }
    }

    /// <summary>
    /// Generate appropriate response based on user message
    /// </summary>
    /// <param name="request">Chat request containing message and history</param>
    /// <returns>Chat response with message and quick replies</returns>
    private async Task<ChatResponse> GenerateResponse(ChatRequest request)
    {
        var message = request.Message.ToLowerInvariant().Trim();
        
        // Skills Solutions Australia specific responses
        var response = new ChatResponse();

        // Internship-related queries
        if (ContainsKeywords(message, ["internship", "intern", "program", "future ready"]))
        {
            response.Message = @"Our Future Ready Internship Program is designed to bridge Tasmania's ICT skills gap!

Key features:
• 6-month structured internship placements
• Real-world project experience
• Professional mentorship and support
• Direct pathway to employment
• Industry-recognised skill development

We work with local businesses to provide meaningful opportunities that benefit both graduates and employers.";

            response.QuickReplies = ["How to apply?", "Eligibility requirements", "Partner companies", "Success stories"];
        }
        // Application process
        else if (ContainsKeywords(message, ["apply", "application", "how to", "join", "enroll"]))
        {
            response.Message = @"Ready to start your journey? Here's how to apply:

1. **Check Eligibility**: Recent ICT graduate or final-year student
2. **Submit Application**: Complete our online application form
3. **Skills Assessment**: We'll evaluate your technical background
4. **Interview Process**: Meet with our team and potential employers
5. **Placement Matching**: We'll match you with the perfect opportunity

The process typically takes 2-3 weeks from application to placement confirmation.";

            response.QuickReplies = ["View application form", "Eligibility details", "What documents needed?", "Timeline questions"];
        }
        // Career services
        else if (ContainsKeywords(message, ["career", "services", "support", "help", "guidance"]))
        {
            response.Message = @"We provide comprehensive career support throughout your journey:

**Our Services Include:**
• Resume and portfolio development
• Interview preparation and practice
• Professional networking opportunities
• Skill gap analysis and training recommendations
• Industry insights and market trends
• Ongoing mentorship during placements

Our goal is to ensure you're not just job-ready, but career-ready for long-term success in the ICT industry.";

            response.QuickReplies = ["Resume help", "Interview prep", "Networking events", "Skill development"];
        }
        // Partnership information
        else if (ContainsKeywords(message, ["partner", "partnership", "business", "company", "employer"]))
        {
            response.Message = @"We collaborate with leading Tasmanian businesses to create win-win partnerships:

**For Employers:**
• Access to skilled, motivated graduates
• Reduced recruitment costs and time
• Fresh perspectives and innovative thinking
• Government incentives and support
• Flexible engagement models

**Current Partners Include:**
• Technology companies
• Government agencies
• Healthcare organisations
• Financial services
• Manufacturing and logistics

Interested in partnering with us?";

            response.QuickReplies = ["Partnership benefits", "How to partner", "Current partners", "Success stories"];
        }
        // Contact and location
        else if (ContainsKeywords(message, ["contact", "phone", "email", "address", "location", "office"]))
        {
            response.Message = @"Get in touch with us! We're here to help:

**Contact Information:**
• Website: skillssolutionsaustralia.com
• General Enquiries: Hello@skillssolitionsaustralia.com.au
• Director: Julia Lane - Julia.lane@skillssolutionsaustralia.com.au
• Phone: 0414 670 863

**Location:**
Based in Tasmania, serving the entire state's ICT community with a focus on regional development and opportunities.

We typically respond to inquiries within 24 hours during business days.";

            response.QuickReplies = ["Visit contact page", "Schedule a call", "Email us", "Find office location"];
        }
        // Try again or contact directly
        else if (ContainsKeywords(message, ["try again", "contact", "help", "support"]))
        {
            response.Message = @"I'm your AI Assistant, and I understand you'd like to speak with someone directly. Here are your options:

• Visit our contact page for direct communication
• Schedule a consultation call
• Email us your specific questions
• Browse our website for detailed information

Our team is ready to provide personalised assistance for your needs.";

            response.QuickReplies = ["Contact page", "Schedule call", "Email us", "Browse website"];
        }
        // Default/general response
        else
        {
            response.Message = @"Hello! I'm your AI Assistant for Skills Solutions Australia.

I specialise in helping you learn about our programs and services. We focus on empowering ICT graduates through our Future Ready Internship Program, providing the bridge between education and meaningful employment in Tasmania's growing tech sector.

What would you like to know more about?";

            response.QuickReplies = ["Internship programs", "How to apply", "Career services", "Partnership opportunities"];
        }

        // Simulate realistic response time
        await Task.Delay(1000);

        return response;
    }

    /// <summary>
    /// Check if message contains any of the specified keywords
    /// </summary>
    /// <param name="message">User message to check</param>
    /// <param name="keywords">Keywords to search for</param>
    /// <returns>True if any keyword is found</returns>
    private static bool ContainsKeywords(string message, string[] keywords)
    {
        return keywords.Any(keyword => message.Contains(keyword, StringComparison.OrdinalIgnoreCase));
    }
}

/// <summary>
/// Request model for chat API
/// </summary>
public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
    public List<ConversationMessage>? History { get; set; }
}

/// <summary>
/// Response model for chat API
/// </summary>
public class ChatResponse
{
    public string Message { get; set; } = string.Empty;
    public string[]? QuickReplies { get; set; }
}

/// <summary>
/// Conversation message for context
/// </summary>
public class ConversationMessage
{
    public string Role { get; set; } = string.Empty; // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
}
