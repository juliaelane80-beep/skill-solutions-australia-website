# Resume Upload Feature - Implementation Documentation

## Overview
This document describes the resume upload functionality added to the booking form on the Skills Solutions Australia website. When users book an appointment, they can now optionally upload their resume (CV), which is automatically stored in HubSpot CRM alongside their contact information.

## Feature Specifications

### Supported File Formats
- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)

### File Size Limit
- Maximum: **5MB** per file
- Validation occurs on both client-side and server-side

### User Experience
1. User fills out booking form (firstName, lastName, email, phone)
2. User optionally clicks "Upload Resume" button to select a file
3. Selected filename is displayed next to the upload button
4. Upon form submission, both contact details and resume are sent to HubSpot
5. Success message confirms contact creation (with or without resume)

## Technical Implementation

### Frontend (`public/assets/js/hubspot-integration.js`)

#### File Upload UI
- Custom styled upload button integrated into the form
- Hidden file input element for browser file picker
- Real-time display of selected filename
- Visual feedback for file selection

#### Client-Side Validation
```javascript
// File type validation
const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// File size validation (5MB max)
const maxSize = 5 * 1024 * 1024; // 5MB in bytes
```

#### Form Submission
- Uses `FormData` API for multipart/form-data encoding
- Automatically handles file upload alongside text fields
- Sends to `/api/hubspot-create-contact` endpoint

### Backend (`api/HubSpotFunction.cs`)

#### Request Handling
The Azure Function now supports two request formats:

1. **Multipart/form-data** (with file upload)
   - Triggered when `req.HasFormContentType` is true
   - Extracts form fields: email, firstName, lastName, phone, resume (file)
   - Uploads resume to HubSpot Files API
   - Associates file with contact record

2. **JSON** (backward compatibility - no file upload)
   - Maintains existing functionality for API clients that don't need file upload
   - Accepts standard JSON contact data

#### HubSpot Integration Flow

##### 1. Create Contact
```csharp
// HubSpot Contacts API v3
POST https://api.hubapi.com/crm/v3/objects/contacts

{
    "properties": {
        "email": "user@example.com",
        "firstname": "John",
        "lastname": "Doe",
        "phone": "+1234567890",
        "lifecyclestage": "lead",
        "hs_lead_status": "NEW"
    }
}
```

##### 2. Upload Resume (if provided)
```csharp
// HubSpot Files API v3
POST https://api.hubapi.com/filemanager/api/v3/files/upload

Multipart form data:
- file: [binary file content]
- folderPath: "/resumes"
- access: "HIDDEN_PRIVATE"
- overwrite: "Resume for user@example.com"
```

##### 3. Associate File with Contact
```csharp
// HubSpot Associations API v3
POST https://api.hubapi.com/crm/v3/associations/contacts/files/batch/create

{
    "inputs": [{
        "from": { "id": "[contactId]" },
        "to": { "id": "[fileId]" },
        "type": "contact_to_file"
    }]
}
```

## Error Handling

### Client-Side Errors
- **Invalid file type**: Alert shown, file input cleared
- **File too large**: Alert shown, file input cleared
- **Missing required fields**: Error message displayed below form
- **Network errors**: Error message displayed below form

### Server-Side Errors
The backend handles errors gracefully:

1. **Contact creation success + File upload failure**
   - Contact is still created in HubSpot
   - Response includes warning about file upload failure
   - User receives success message with warning

2. **Contact creation failure**
   - No file upload attempted
   - Error response returned to frontend
   - User sees error message

3. **File upload success + Association failure**
   - Contact and file both exist in HubSpot but aren't linked
   - Warning logged for manual association later
   - User receives success message with note

## Security Considerations

### File Storage
- Files are stored in HubSpot as `HIDDEN_PRIVATE`
- Not publicly accessible
- Only accessible to HubSpot portal users with appropriate permissions

### Authentication
- Backend uses HubSpot API key from environment variables
- Key stored securely in Azure App Settings (not in code)
- Azure Function has `AuthorizationLevel.Anonymous` (protected by Azure Static Web Apps)

### Validation
- File type whitelist (PDF, DOC, DOCX only)
- File size limit enforced (5MB)
- Email format validation
- Required field validation

## Configuration

### Environment Variables
Set in Azure Function App Settings:

```bash
HUBSPOT_API_KEY=your-hubspot-private-app-token
```

### HubSpot Requirements
1. HubSpot account with access to:
   - Contacts API
   - Files API
   - Associations API

2. Private App token with scopes:
   - `crm.objects.contacts.write`
   - `files`
   - `crm.schemas.contacts.read`

## Testing

### Manual Testing Checklist
- [ ] Upload PDF file < 5MB
- [ ] Upload DOC file < 5MB
- [ ] Upload DOCX file < 5MB
- [ ] Try uploading unsupported file type (e.g., .jpg)
- [ ] Try uploading file > 5MB
- [ ] Submit form without resume (should work)
- [ ] Submit form with resume
- [ ] Verify contact created in HubSpot
- [ ] Verify resume appears in HubSpot contact record
- [ ] Test with invalid email format
- [ ] Test with missing required fields

### Verify in HubSpot
1. Go to HubSpot Contacts
2. Search for the test contact by email
3. Open contact record
4. Check "Attachments" or "Files" section for uploaded resume
5. Verify resume can be downloaded

## API Endpoints

### POST `/api/hubspot-create-contact`

**Request Format: Multipart/form-data**
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="email"

john.doe@example.com
------WebKitFormBoundary...
Content-Disposition: form-data; name="firstName"

John
------WebKitFormBoundary...
Content-Disposition: form-data; name="lastName"

Doe
------WebKitFormBoundary...
Content-Disposition: form-data; name="phone"

+1234567890
------WebKitFormBoundary...
Content-Disposition: form-data; name="resume"; filename="john-doe-resume.pdf"
Content-Type: application/pdf

[binary file content]
------WebKitFormBoundary...--
```

**Success Response (with resume)**
```json
{
    "success": true,
    "message": "Contact created and resume uploaded successfully",
    "contactId": "12345678",
    "fileId": "87654321"
}
```

**Success Response (without resume)**
```json
{
    "success": true,
    "message": "Contact created successfully",
    "contactId": "12345678"
}
```

**Partial Success Response (contact created, file upload failed)**
```json
{
    "success": true,
    "message": "Contact created but resume upload failed",
    "contactId": "12345678",
    "warning": "File upload error message"
}
```

**Error Response**
```json
{
    "success": false,
    "error": "Error description"
}
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- File API and FormData API support required
- Tested on desktop and mobile browsers

## Future Enhancements
Potential improvements for future iterations:

1. **Multiple file upload**: Allow uploading multiple documents
2. **File preview**: Show preview of PDF files before upload
3. **Drag-and-drop**: Enable drag-and-drop file upload
4. **Progress indicator**: Show upload progress for large files
5. **Resume parsing**: Extract key information from resume automatically
6. **Additional formats**: Support more file types (RTF, TXT, etc.)
7. **Cloud storage integration**: Store files in Azure Blob Storage as backup
8. **Admin notifications**: Email admins when new resume is uploaded

## Troubleshooting

### File Upload Fails
1. Check HubSpot API key is configured correctly
2. Verify HubSpot private app has `files` scope enabled
3. Check Azure Function logs for detailed error messages
4. Ensure file size is under 5MB
5. Verify file format is PDF, DOC, or DOCX

### File Not Visible in HubSpot
1. Check contact record "Attachments" section
2. Verify association API call succeeded in logs
3. May need to manually associate file with contact in HubSpot

### Contact Created But No File
- This is expected behavior if file upload fails
- Contact information is prioritized over file upload
- Check logs for file upload error details

## Support
For issues or questions about this feature, check:
- Azure Function logs in Azure Portal
- Browser console for client-side errors
- HubSpot API documentation: https://developers.hubspot.com/docs/api/overview

---

**Implementation Date**: December 2024  
**Version**: 1.0  
**Status**: Production Ready
