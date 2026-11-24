using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace api;

/// <summary>
/// Receives website enquiries and delivers them to HubSpot as a contact upsert.
/// Success is only reported when HubSpot accepts the request, so the site never shows a fake confirmation.
/// </summary>
public class EnquiryFunction
{
    private static readonly HttpClient Http = new() { BaseAddress = new Uri("https://api.hubapi.com") };
    private static readonly Regex EmailRegex = new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);
    private static readonly Regex PhoneRegex = new(@"^[+\d][\d\s()\-]{5,}$", RegexOptions.Compiled);

    /// <summary>Allowed service values and their display labels. Must match the site's enquiry form.</summary>
    private static readonly Dictionary<string, string> Services = new()
    {
        ["career-support"] = "Job seeker: Career Support",
        ["job-search-coaching"] = "Job seeker: Job Search & Career Coaching",
        ["individual-coaching"] = "Job seeker: Individual Career Coaching",
        ["internship-coaching"] = "Job seeker: Internship Placement & Coaching",
        ["employer"] = "Employer: Workforce Needs",
        ["recruitment"] = "Employer: Recruitment & Talent Sourcing",
        ["internship-hosting"] = "Employer: Internship Hosting",
        ["labour-hire"] = "Employer: Contract & Labour Hire",
        ["other"] = "Other enquiry",
    };

    private const int MinimumFillMs = 3000;
    private readonly ILogger<EnquiryFunction> _logger;

    public EnquiryFunction(ILogger<EnquiryFunction> logger) => _logger = logger;

    /// <summary>Validates and forwards an enquiry.</summary>
    [Function("enquiry")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "enquiry")] HttpRequest req)
    {
        EnquiryRequest? body;
        try
        {
            body = await JsonSerializer.DeserializeAsync<EnquiryRequest>(req.Body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException)
        {
            return Fail(400, "Your enquiry could not be read.");
        }

        if (body is null) return Fail(400, "Your enquiry could not be read.");

        // Spam traps: a hidden field real users never fill, and forms submitted faster than a person can type.
        // Respond as success so bots learn nothing, but deliver nothing.
        if (!string.IsNullOrEmpty(body.Website) || body.ElapsedMs < MinimumFillMs)
        {
            _logger.LogWarning("Enquiry discarded by spam checks.");
            return new OkObjectResult(new { success = true });
        }

        var name = (body.Name ?? "").Trim();
        var email = (body.Email ?? "").Trim();
        var phone = (body.Phone ?? "").Trim();
        var organisation = (body.Organisation ?? "").Trim();
        var message = (body.Message ?? "").Trim();
        var service = (body.Service ?? "").Trim();

        if (name.Length is 0 or > 100) return Fail(400, "Please enter your name.");
        if (email.Length > 200 || !EmailRegex.IsMatch(email)) return Fail(400, "Please enter a valid email address.");
        if (phone.Length > 0 && (phone.Length > 30 || !PhoneRegex.IsMatch(phone))) return Fail(400, "Please enter a valid phone number.");
        if (organisation.Length > 150) return Fail(400, "Organisation name is too long.");
        if (message.Length is < 10 or > 2000) return Fail(400, "Please tell us a little about what you need.");
        if (!Services.TryGetValue(service, out var serviceLabel)) return Fail(400, "Please choose what your enquiry is about.");

        var apiKey = Environment.GetEnvironmentVariable("HUBSPOT_API_KEY");
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogError("HUBSPOT_API_KEY is not configured.");
            return Fail(500, "We could not send your enquiry right now.");
        }

        var parts = name.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var properties = new Dictionary<string, string>
        {
            ["firstname"] = parts[0],
            ["lastname"] = parts.Length > 1 ? parts[1] : "",
            ["email"] = email,
            ["message"] = $"Website enquiry – {serviceLabel}\n\n{message}",
        };
        if (phone.Length > 0) properties["phone"] = phone;
        if (organisation.Length > 0) properties["company"] = organisation;

        var payload = new { inputs = new[] { new { idProperty = "email", id = email, properties } } };
        using var request = new HttpRequestMessage(HttpMethod.Post, "/crm/v3/objects/contacts/batch/upsert")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        try
        {
            using var response = await Http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("HubSpot rejected enquiry: {Status} {Body}", (int)response.StatusCode, await response.Content.ReadAsStringAsync());
                return Fail(502, "We could not send your enquiry right now.");
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HubSpot request failed.");
            return Fail(502, "We could not send your enquiry right now.");
        }

        return new OkObjectResult(new { success = true });
    }

    private static IActionResult Fail(int status, string error) =>
        new ObjectResult(new { success = false, error }) { StatusCode = status };

    /// <summary>Enquiry payload sent by the site's contact form.</summary>
    public class EnquiryRequest
    {
        public string? Service { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Organisation { get; set; }
        public string? Message { get; set; }
        /// <summary>Honeypot. Must stay empty.</summary>
        public string? Website { get; set; }
        public long ElapsedMs { get; set; }
    }
}
