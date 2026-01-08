using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;

namespace api
{
    /// <summary>
    /// Azure Function for integrating with HubSpot CRM API
    /// Handles contact creation when users book appointments
    /// </summary>
    public class HubSpotFunction
    {
        private readonly ILogger<HubSpotFunction> _logger;
        private readonly HttpClient _httpClient;
        private const string HUBSPOT_API_BASE = "https://api.hubapi.com";

        public HubSpotFunction(ILogger<HubSpotFunction> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
        }

        /// <summary>
        /// Creates a contact in HubSpot CRM
        /// </summary>
        /// <param name="req">HTTP request containing contact information and optional resume file</param>
        /// <returns>API response with created contact details</returns>
        [Function("hubspot-create-contact")]
        public async Task<IActionResult> CreateContact([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            try
            {
                // Check if request contains multipart/form-data (file upload)
                if (req.HasFormContentType)
                {
                    return await HandleFormDataRequest(req);
                }
                else
                {
                    return await HandleJsonRequest(req);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating HubSpot contact: {ex.Message}");
                return new ObjectResult(new { 
                    success = false, 
                    error = "Internal server error" 
                }) { StatusCode = 500 };
            }
        }

        /// <summary>
        /// Handles form data request (with file upload)
        /// </summary>
        private async Task<IActionResult> HandleFormDataRequest(HttpRequest req)
        {
            var form = await req.ReadFormAsync();
            
            // Extract form fields
            string? email = form["email"];
            string? firstName = form["firstName"];
            string? lastName = form["lastName"];
            string? phone = form["phone"];
            
            _logger.LogInformation($"Received form data - Email: {email}, FirstName: {firstName}");

            // Validate required fields
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(firstName))
            {
                _logger.LogWarning($"Missing required fields - Email: {email}, FirstName: {firstName}");
                return new BadRequestObjectResult(new { 
                    error = "Email and FirstName are required",
                    success = false
                });
            }

            // Get HubSpot API key
            string? hubspotApiKey = Environment.GetEnvironmentVariable("HUBSPOT_API_KEY");
            if (string.IsNullOrEmpty(hubspotApiKey))
            {
                _logger.LogError("HubSpot API key not configured");
                return new ObjectResult(new { 
                    success = false, 
                    error = "HubSpot API key not configured" 
                }) { StatusCode = 500 };
            }

            // Prepare HubSpot contact data
            var hubspotContact = new
            {
                properties = new
                {
                    email = email,
                    firstname = firstName,
                    lastname = lastName ?? "",
                    phone = phone ?? "",
                    lifecyclestage = "lead",
                    hs_lead_status = "NEW"
                }
            };

            // Create contact in HubSpot
            var hubspotResponse = await CreateHubSpotContact(hubspotContact, hubspotApiKey);
            
            if (!hubspotResponse.Success)
            {
                _logger.LogError($"Failed to create contact in HubSpot: {hubspotResponse.Error}");
                return new ObjectResult(new { 
                    success = false, 
                    error = hubspotResponse.Error 
                }) { StatusCode = 500 };
            }

            string? contactId = hubspotResponse.ContactId;
            _logger.LogInformation($"Contact created successfully in HubSpot. ID: {contactId}");

            // Handle resume upload if present
            _logger.LogInformation($"Form files count: {form.Files.Count}");
            var resumeFile = form.Files.GetFile("resume");
            _logger.LogInformation($"Resume file object: {(resumeFile != null ? "Found" : "NULL")}");
            if (resumeFile != null)
            {
                _logger.LogInformation($"Resume file length: {resumeFile.Length}");
                _logger.LogInformation($"Resume file name: {resumeFile.FileName}");
            }
            
            if (resumeFile != null && resumeFile.Length > 0 && !string.IsNullOrEmpty(contactId))
            {
                _logger.LogInformation($"Resume file found: {resumeFile.FileName}, Size: {resumeFile.Length} bytes");
                
                // Validate file size (5MB max)
                const int MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
                if (resumeFile.Length > MAX_FILE_SIZE)
                {
                    _logger.LogWarning($"File too large: {resumeFile.Length} bytes (max: {MAX_FILE_SIZE})");
                    return new BadRequestObjectResult(new { 
                        success = false, 
                        error = "File size exceeds 5MB limit. Please upload a smaller file." 
                    });
                }
                
                // Validate file type
                var allowedContentTypes = new[] { 
                    "application/pdf", 
                    "application/msword", 
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                };
                
                if (!allowedContentTypes.Contains(resumeFile.ContentType?.ToLowerInvariant()))
                {
                    _logger.LogWarning($"Invalid file type: {resumeFile.ContentType}");
                    return new BadRequestObjectResult(new { 
                        success = false, 
                        error = "Only PDF, DOC, and DOCX files are allowed." 
                    });
                }
                
                var fileUploadResponse = await UploadResumeToHubSpot(resumeFile, contactId, email, hubspotApiKey);
                
                if (fileUploadResponse.Success)
                {
                    _logger.LogInformation($"Resume uploaded successfully to HubSpot for contact {contactId}");
                    return new OkObjectResult(new { 
                        success = true, 
                        message = "Contact created and resume uploaded successfully",
                        contactId = contactId,
                        fileId = fileUploadResponse.FileId
                    });
                }
                else
                {
                    _logger.LogWarning($"Contact created but resume upload failed: {fileUploadResponse.Error}");
                    return new OkObjectResult(new { 
                        success = true, 
                        message = "Contact created but resume upload failed",
                        contactId = contactId,
                        warning = fileUploadResponse.Error
                    });
                }
            }

            return new OkObjectResult(new { 
                success = true, 
                message = "Contact created successfully",
                contactId = contactId
            });
        }

        /// <summary>
        /// Handles JSON request (backward compatibility - no file upload)
        /// </summary>
        private async Task<IActionResult> HandleJsonRequest(HttpRequest req)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            _logger.LogInformation($"Received JSON request: {requestBody}");
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            
            var contactData = JsonSerializer.Deserialize<ContactRequest>(requestBody, options);

            // Validate required fields
            if (contactData == null || string.IsNullOrEmpty(contactData.Email) || string.IsNullOrEmpty(contactData.FirstName))
            {
                return new BadRequestObjectResult(new { 
                    error = "Email and FirstName are required",
                    success = false
                });
            }

            // Get HubSpot API key
            string? hubspotApiKey = Environment.GetEnvironmentVariable("HUBSPOT_API_KEY");
            if (string.IsNullOrEmpty(hubspotApiKey))
            {
                return new ObjectResult(new { 
                    success = false, 
                    error = "HubSpot API key not configured" 
                }) { StatusCode = 500 };
            }

            // Prepare HubSpot contact data
            var hubspotContact = new
            {
                properties = new
                {
                    email = contactData.Email,
                    firstname = contactData.FirstName,
                    lastname = contactData.LastName ?? "",
                    phone = contactData.Phone ?? "",
                    company = contactData.Company ?? "",
                    jobtitle = contactData.JobTitle ?? "",
                    lifecyclestage = "lead",
                    hs_lead_status = "NEW"
                }
            };

            // Send to HubSpot
            var hubspotResponse = await CreateHubSpotContact(hubspotContact, hubspotApiKey);
            
            if (hubspotResponse.Success)
            {
                return new OkObjectResult(new { 
                    success = true, 
                    message = "Contact created successfully",
                    contactId = hubspotResponse.ContactId
                });
            }
            else
            {
                return new ObjectResult(new { 
                    success = false, 
                    error = hubspotResponse.Error 
                }) { StatusCode = 500 };
            }
        }

        /// <summary>
        /// Uploads resume file to HubSpot and associates it with a contact
        /// </summary>
        private async Task<FileUploadResponse> UploadResumeToHubSpot(IFormFile file, string contactId, string email, string apiKey)
        {
            try
            {
                // Step 1: Upload file to HubSpot Files API
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                using var content = new MultipartFormDataContent();
                using var fileContent = new ByteArrayContent(fileBytes);
                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
                
                content.Add(fileContent, "file", file.FileName);
                content.Add(new StringContent("/resumes"), "folderPath");
                
                // Add options as JSON string
                var options = new
                {
                    access = "PRIVATE",
                    overwrite = false,
                    duplicateValidationStrategy = "NONE",
                    duplicateValidationScope = "EXACT_FOLDER"
                };
                var optionsJson = JsonSerializer.Serialize(options);
                content.Add(new StringContent(optionsJson), "options");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var uploadResponse = await _httpClient.PostAsync($"{HUBSPOT_API_BASE}/filemanager/api/v3/files/upload", content);
                var uploadResponseContent = await uploadResponse.Content.ReadAsStringAsync();

                _logger.LogInformation($"File upload response status: {uploadResponse.StatusCode}");
                _logger.LogInformation($"File upload response: {uploadResponseContent}");

                if (!uploadResponse.IsSuccessStatusCode)
                {
                    _logger.LogError($"File upload failed: {uploadResponseContent}");
                    return new FileUploadResponse 
                    { 
                        Success = false, 
                        Error = $"File upload failed: {uploadResponse.StatusCode}" 
                    };
                }

                var uploadResponseObj = JsonSerializer.Deserialize<HubSpotFileUploadResponse>(uploadResponseContent);
                var fileObject = uploadResponseObj?.Objects?.FirstOrDefault();
                _logger.LogInformation($"Deserialized file ID: {fileObject?.Id}");
                
                string? fileId = fileObject?.Id?.ToString();

                if (string.IsNullOrEmpty(fileId))
                {
                    return new FileUploadResponse 
                    { 
                        Success = false, 
                        Error = "Failed to get file ID from upload response" 
                    };
                }

                // Step 2: Associate file with contact using Associations API
                var associationPayload = new
                {
                    inputs = new[]
                    {
                        new
                        {
                            from = new { id = contactId },
                            to = new { id = fileId },
                            type = "contact_to_file"
                        }
                    }
                };

                var associationJson = JsonSerializer.Serialize(associationPayload);
                var associationContent = new StringContent(associationJson, Encoding.UTF8, "application/json");

                var associationResponse = await _httpClient.PostAsync(
                    $"{HUBSPOT_API_BASE}/crm/v3/associations/contacts/files/batch/create",
                    associationContent
                );

                if (associationResponse.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"Resume successfully associated with contact {contactId}");
                    return new FileUploadResponse 
                    { 
                        Success = true, 
                        FileId = fileId 
                    };
                }
                else
                {
                    var errorContent = await associationResponse.Content.ReadAsStringAsync();
                    _logger.LogWarning($"File uploaded but association failed: {errorContent}");
                    return new FileUploadResponse 
                    { 
                        Success = true, 
                        FileId = fileId,
                        Error = "File uploaded but could not be associated with contact"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Resume upload error: {ex.Message}");
                return new FileUploadResponse 
                { 
                    Success = false, 
                    Error = ex.Message 
                };
            }
        }

        /// <summary>
        /// Creates a contact in HubSpot using the Contacts API
        /// </summary>
        /// <param name="contactData">Contact data object</param>
        /// <param name="apiKey">HubSpot API key</param>
        /// <returns>Response with success status and contact ID</returns>
        private async Task<HubSpotResponse> CreateHubSpotContact(object contactData, string apiKey)
        {
            try
            {
                var json = JsonSerializer.Serialize(contactData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                // Add Authorization header
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
                
                // Call HubSpot Contacts API (Object Type ID: 0-1 for contacts)
                var response = await _httpClient.PostAsync($"{HUBSPOT_API_BASE}/crm/v3/objects/contacts", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"HubSpot create contact response: {responseContent}");
                    
                    var hubspotContact = JsonSerializer.Deserialize<HubSpotContactResponse>(responseContent);
                    _logger.LogInformation($"Deserialized contact ID: {hubspotContact?.Id}");
                    
                    return new HubSpotResponse 
                    { 
                        Success = true, 
                        ContactId = hubspotContact?.Id 
                    };
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
                {
                    // Contact already exists - search for it by email to get the ID
                    _logger.LogInformation("Contact already exists in HubSpot");
                    
                    // Extract email from contactData
                    var contactDataJson = JsonSerializer.Serialize(contactData);
                    var contactDataObj = JsonSerializer.Deserialize<Dictionary<string, object>>(contactDataJson);
                    var propertiesJson = contactDataObj?["properties"]?.ToString();
                    var properties = propertiesJson != null ? JsonSerializer.Deserialize<Dictionary<string, string>>(propertiesJson) : null;
                    var email = properties?.GetValueOrDefault("email");
                    
                    if (!string.IsNullOrEmpty(email))
                    {
                        // Search for existing contact by email
                        var searchUrl = $"{HUBSPOT_API_BASE}/crm/v3/objects/contacts/search";
                        var searchPayload = new
                        {
                            filterGroups = new[]
                            {
                                new
                                {
                                    filters = new[]
                                    {
                                        new
                                        {
                                            propertyName = "email",
                                            @operator = "EQ",
                                            value = email
                                        }
                                    }
                                }
                            }
                        };
                        
                        var searchJson = JsonSerializer.Serialize(searchPayload);
                        var searchContent = new StringContent(searchJson, Encoding.UTF8, "application/json");
                        var searchResponse = await _httpClient.PostAsync(searchUrl, searchContent);
                        
                        if (searchResponse.IsSuccessStatusCode)
                        {
                            var searchResponseContent = await searchResponse.Content.ReadAsStringAsync();
                            _logger.LogInformation($"Search API response: {searchResponseContent}");
                            
                            var searchResult = JsonSerializer.Deserialize<HubSpotSearchResponse>(searchResponseContent);
                            _logger.LogInformation($"Search results count: {searchResult?.Results?.Count ?? 0}");
                            
                            var existingContactId = searchResult?.Results?.FirstOrDefault()?.Id;
                            
                            _logger.LogInformation($"Found existing contact ID: {existingContactId}");
                            
                            return new HubSpotResponse 
                            { 
                                Success = true, 
                                ContactId = existingContactId,
                                Error = "Contact already exists"
                            };
                        }
                    }
                    
                    return new HubSpotResponse 
                    { 
                        Success = true, 
                        ContactId = null,
                        Error = "Contact already exists but could not retrieve ID"
                    };
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return new HubSpotResponse 
                    { 
                        Success = false, 
                        Error = $"HubSpot API error: {response.StatusCode} - {errorContent}" 
                    };
                }
            }
            catch (Exception ex)
            {
                return new HubSpotResponse 
                { 
                    Success = false, 
                    Error = ex.Message 
                };
            }
        }
    }

    /// <summary>
    /// Request model for contact creation
    /// </summary>
    public class ContactRequest
    {
        [JsonPropertyName("email")]
        public string? Email { get; set; }
        
        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }
        
        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }
        
        [JsonPropertyName("phone")]
        public string? Phone { get; set; }
        
        [JsonPropertyName("company")]
        public string? Company { get; set; }
        
        [JsonPropertyName("jobTitle")]
        public string? JobTitle { get; set; }
    }

    /// <summary>
    /// HubSpot API response model
    /// </summary>
    public class HubSpotResponse
    {
        public bool Success { get; set; }
        public string? ContactId { get; set; }
        public string? Error { get; set; }
    }

    /// <summary>
    /// HubSpot contact response model
    /// </summary>
    public class HubSpotContactResponse
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        
        [JsonPropertyName("properties")]
        public Dictionary<string, object>? Properties { get; set; }
        
        [JsonPropertyName("createdAt")]
        public string? CreatedAt { get; set; }
        
        [JsonPropertyName("updatedAt")]
        public string? UpdatedAt { get; set; }
    }

    /// <summary>
    /// Response model for file upload operations
    /// </summary>
    public class FileUploadResponse
    {
        public bool Success { get; set; }
        public string? FileId { get; set; }
        public string? Error { get; set; }
    }

    /// <summary>
    /// HubSpot file upload response model
    /// </summary>
    public class HubSpotFileUploadResponse
    {
        [JsonPropertyName("objects")]
        public List<HubSpotFileResponse>? Objects { get; set; }
    }
    
    /// <summary>
    /// HubSpot file object model
    /// </summary>
    public class HubSpotFileResponse
    {
        [JsonPropertyName("id")]
        public long? Id { get; set; }
        
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        
        [JsonPropertyName("path")]
        public string? Path { get; set; }
        
        [JsonPropertyName("url")]
        public string? Url { get; set; }
    }

    /// <summary>
    /// HubSpot search response model
    /// </summary>
    public class HubSpotSearchResponse
    {
        [JsonPropertyName("results")]
        public List<HubSpotContactResponse>? Results { get; set; }
        
        [JsonPropertyName("total")]
        public int Total { get; set; }
    }
}
