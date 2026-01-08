# HubSpot Integration Setup Guide

This guide explains how to integrate HubSpot CRM with your Skills Solutions Australia website to automatically capture appointment bookings.

## Overview

When visitors book appointments, their contact information is automatically:
1. Captured via a pre-booking form
2. Sent to HubSpot CRM as a new contact
3. User is then redirected to Microsoft Bookings to schedule their appointment

## Setup Steps

### 1. Get HubSpot API Key

1. **Log in to HubSpot**
   - Go to [HubSpot](https://app.hubspot.com)
   - Sign in to your account

2. **Create Private App**
   - Navigate to Settings (gear icon) → Integrations → Private Apps
   - Click "Create a private app"
   - Give it a name: "Skills Solutions Australia Website"
   - Description: "Website integration for automatic contact creation"

3. **Configure Scopes**
   Add the following scopes:
   - `crm.objects.contacts.write` - Create and update contacts
   - `crm.objects.contacts.read` - Read contact information
   - `crm.schemas.contacts.read` - Read contact properties

4. **Get API Key**
   - After creating the app, copy the generated access token
   - This is your HubSpot API key

### 2. Configure Environment Variables

Add your HubSpot API key to your Azure Functions environment:

#### For Local Development:
Add to `api/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "HUBSPOT_API_KEY": "your-hubspot-api-key-here"
  }
}
```

#### For Production (Azure):
1. Go to Azure Portal
2. Navigate to your Function App
3. Go to Configuration → Application Settings
4. Add new setting:
   - Name: `HUBSPOT_API_KEY`
   - Value: `your-hubspot-api-key-here`

### 3. Test the Integration

1. **Build and run your function app**:
   ```bash
   cd api
   dotnet build
   func start
   ```

2. **Visit the booking page**: `/booking.html`

3. **Fill out the contact form** and submit

4. **Check HubSpot** to verify the contact was created

## How It Works

### Frontend Workflow
1. User visits `/booking.html`
2. JavaScript replaces Microsoft Bookings widget with contact form
3. User fills out contact information
4. Form submits to `/api/hubspot-create-contact`
5. On success, user sees booking link to Microsoft Bookings

### Backend Workflow
1. Azure Function receives contact data
2. Validates required fields (email, first name)
3. Calls HubSpot Contacts API (Object Type ID: 0-1)
4. Creates contact with lifecycle stage "lead" and source "Website Booking Form"
5. Returns success/error response

### Contact Properties Set
- **Email**: Primary identifier
- **First Name**: Required field
- **Last Name**: Optional
- **Phone**: Optional
- **Company**: Optional 
- **Job Title**: Optional
- **Lifecycle Stage**: Set to "lead"
- **Lead Status**: Set to "NEW"
- **Source**: "Website Booking Form"
- **Source Detail**: "Skills Solutions Australia - Appointment Booking"

## API Endpoints Used

### HubSpot CRM API
- **Endpoint**: `https://api.hubapi.com/crm/v3/objects/contacts`
- **Method**: POST
- **Object Type ID**: 0-1 (Contacts)
- **Authentication**: Bearer token (Private App access token)

### Your Function API
- **Endpoint**: `/api/hubspot-create-contact`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+61 4XX XXX XXX",
    "company": "Example Corp",
    "jobTitle": "Developer"
  }
  ```

## Error Handling

The integration includes comprehensive error handling:

1. **Duplicate Contacts**: If contact already exists (409 error), treats as success
2. **API Failures**: Falls back gracefully, shows error message to user
3. **Validation**: Client-side and server-side validation of required fields
4. **Network Issues**: Displays user-friendly error messages

## Analytics Tracking

When Google Analytics is present, the integration tracks:
- `hubspot_contact_created` event when contact is successfully created

## Security Considerations

1. **API Key Security**: Store in environment variables, never in code
2. **CORS**: Azure Functions handle CORS automatically
3. **Validation**: Both client and server-side validation
4. **Rate Limiting**: HubSpot API has rate limits (handled by the API)

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Check the key is correctly set in environment variables
   - Verify the private app has correct scopes
   - Ensure the app is not suspended

2. **Contact Not Created**
   - Check Azure Functions logs
   - Verify HubSpot API permissions
   - Check for network connectivity issues

3. **Form Not Appearing**
   - Ensure JavaScript file is loaded
   - Check browser console for errors
   - Verify DOM element `booking-widget` exists

### Debugging

1. **Check Function Logs**:
   - Azure Portal → Function App → Monitor
   - Look for execution logs and errors

2. **Browser Developer Tools**:
   - Console tab for JavaScript errors
   - Network tab to check API calls

3. **HubSpot API Logs**:
   - HubSpot → Settings → Integrations → Private Apps
   - View your app's activity logs

## Future Enhancements

Consider these improvements:

1. **Custom Properties**: Add ICT-specific fields to HubSpot
2. **Lead Scoring**: Implement scoring based on engagement
3. **Email Workflows**: Set up automated welcome emails
4. **Appointment Sync**: Sync Microsoft Bookings data back to HubSpot
5. **Advanced Segmentation**: Create lists based on appointment types

## Support

For technical issues:
1. Check HubSpot Developer Documentation
2. Review Azure Functions documentation
3. Check this repository's issues section
