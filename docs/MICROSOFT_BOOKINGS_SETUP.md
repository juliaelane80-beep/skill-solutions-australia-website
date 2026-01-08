# Microsoft Bookings Integration Guide

## Overview
This guide explains how to integrate Microsoft Bookings with your Skills Solutions Australia website to enable automatic calendar booking functionality.

## Prerequisites
- Microsoft 365 Business subscription (includes Microsoft Bookings)
- Admin access to Microsoft 365
- Access to your website files

## Step 1: Set Up Microsoft Bookings

### 1.1 Access Microsoft Bookings
1. Go to [Microsoft 365 admin center](https://admin.microsoft.com)
2. Sign in with your admin account
3. Navigate to "Show all" → "All admin centers" → "Bookings"
4. If Bookings isn't available, you may need to enable it:
   - Go to "Settings" → "Org settings" → "Services"
   - Find "Bookings" and enable it

### 1.2 Create Your Booking Calendar
1. Click "Create a booking calendar"
2. Enter business information:
   - **Business name**: Skills Solutions Australia
   - **Business type**: Professional services
   - **Description**: ICT Career Coaching and Consultation Services

### 1.3 Configure Business Information
1. Go to "Business information"
2. Set up:
   - **Address**: Your business address
   - **Phone**: 0414 670 863
   - **Website**: https://skillssolutionsaustralia.com
   - **Business hours**: Monday-Friday, 9:00 AM - 5:00 PM AEST

## Step 2: Set Up Services

### 2.1 Create Consultation Service
1. Go to "Services" tab
2. Click "Add a service"
3. Configure the consultation service:

```
Service Name: Free Career Consultation
Duration: 30 minutes
Buffer time: 15 minutes (before/after)
Location: Online (Teams/Zoom)
Price: Free
Description: "30-minute career strategy session with our ICT specialists. Discover how we can accelerate your career growth in Tasmania's tech industry."
```

### 2.2 Additional Services (Optional)
You can add more services like:
- Extended Consultation (60 minutes)
- Resume Review Session (45 minutes)
- Interview Coaching Session (90 minutes)

## Step 3: Configure Staff

### 3.1 Add Staff Members
1. Go to "Staff" tab
2. Add Julia Lane (Director):
   - **Email**: Julia.lane@skillssolutionsaustralia.com.au
   - **Role**: Can manage bookings
   - **Services**: Assign to consultation services
   - **Working hours**: Monday-Friday, 9:00 AM - 5:00 PM

### 3.2 Set Availability
1. For each staff member, set their availability
2. Configure:
   - Working days and hours
   - Break times
   - Time off/holidays

## Step 4: Customize Booking Page

### 4.1 Booking Page Settings
1. Go to "Booking page"
2. Customize:
   - **Page title**: "Book Your Free Consultation - Skills Solutions Australia"
   - **Description**: Professional description of your services
   - **Logo**: Upload your company logo
   - **Color scheme**: Match your website colors

### 4.2 Customer Information
Configure required customer fields:
- First name (required)
- Last name (required)
- Email (required)
- Phone number (optional)
- Additional notes field

## Step 5: Get Embed Code

### 5.1 Generate Embed Code
1. In the "Booking page" section
2. Click "Publish"
3. Choose "Embed on website"
4. Copy the iframe embed code

The code will look something like this:
```html
<iframe src="https://outlook.live.com/bookwithme/user/[unique-id]?anonymous&ep=pcard" 
        width="100%" 
        height="600" 
        frameborder="0">
</iframe>
```

## Step 6: Update Website

### 6.1 Replace Placeholder in booking.html
1. Open `/booking.html`
2. Find the `<!-- Microsoft Bookings Embed -->` section
3. Replace the placeholder div with your actual iframe code:

```html
<!-- Microsoft Bookings Embed -->
<div id="booking-widget" style="min-height: 600px; border-radius: var(--border-radius);">
    <iframe src="YOUR_BOOKINGS_URL_HERE" 
            width="100%" 
            height="600" 
            frameborder="0"
            style="border-radius: var(--border-radius);">
    </iframe>
</div>
```

### 6.2 Style the Iframe (Optional)
Add custom CSS to better integrate the booking widget:

```css
/* Add to your CSS file */
#booking-widget iframe {
    border: none;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Step 7: Test the Integration

### 7.1 Test Booking Process
1. Visit your website's booking page
2. Test the booking process end-to-end
3. Verify calendar integration works
4. Check email confirmations

### 7.2 Mobile Responsiveness
1. Test on mobile devices
2. Ensure the booking widget displays properly
3. Adjust iframe dimensions if needed

## Step 8: Additional Features

### 8.1 Email Notifications
Configure automatic emails:
- Booking confirmations
- Reminder emails (24 hours before)
- Follow-up emails

### 8.2 Teams Integration
If using Microsoft Teams:
1. Enable Teams meeting integration
2. Automatic meeting links will be included in bookings

### 8.3 Analytics
Monitor booking performance:
- Track booking rates
- Most popular time slots
- Customer feedback

## Troubleshooting

### Common Issues:
1. **Iframe not loading**: Check if the URL is correct and accessible
2. **Mobile display issues**: Adjust iframe height and responsive settings
3. **Calendar sync problems**: Verify staff member permissions
4. **Time zone issues**: Ensure correct time zone in Bookings settings

### Support Resources:
- [Microsoft Bookings Documentation](https://docs.microsoft.com/en-us/microsoft-365/bookings/)
- [Microsoft 365 Support](https://support.microsoft.com/en-us/office/microsoft-bookings)

## Security Considerations

1. **Privacy**: Configure appropriate data collection settings
2. **Access control**: Limit who can manage bookings
3. **Data retention**: Set up appropriate data retention policies
4. **GDPR compliance**: Ensure compliance with privacy regulations

## Next Steps After Implementation

1. Train staff on using the Bookings interface
2. Set up reporting and analytics
3. Create booking confirmation email templates
4. Integrate with existing CRM if needed
5. Monitor and optimize booking conversion rates

## Benefits of This Integration

✅ **Automatic calendar sync** - Bookings appear directly in Microsoft Calendar
✅ **Reduced admin work** - No manual calendar management needed
✅ **Professional appearance** - Branded booking experience
✅ **Email automation** - Automatic confirmations and reminders
✅ **Mobile-friendly** - Works on all devices
✅ **Time zone handling** - Automatic time zone conversion
✅ **Conflict prevention** - Prevents double bookings
✅ **Analytics** - Track booking performance and trends

This integration will significantly streamline your appointment booking process while providing a professional experience for your clients.
