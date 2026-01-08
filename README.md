# Skills Solutions Australia - Official Website

**Tasmania's Leading ICT Career Development Organisation**

[![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static%20Web%20Apps-blue)](https://azure.microsoft.com/services/app-service/static/)
[![.NET 8.0](https://img.shields.io/badge/.NET-8.0-purple)](https://dotnet.microsoft.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Project Cleanup](#project-cleanup)

---

## 🎯 Overview

Skills Solutions Australia's official website showcases our ICT career development programs, professional services, and industry partnerships. The site features:

- Modern, responsive design with cyberpunk-inspired neon aesthetics
- AI-powered chatbot for visitor assistance
- HubSpot CRM integration for lead capture
- Microsoft Bookings integration for appointment scheduling
- SEO-optimized content and structure

**Live Site**: https://zealous-river-069169b10.1.azurestaticapps.net

---

## 📁 Project Structure

```
www-skillssolutionsaustralia/
│
├── 📂 public/                          # Production files & static assets
│   ├── index.html                      # Homepage
│   ├── about.html                      # About Us
│   ├── program.html                    # Future Ready Program
│   ├── pricing.html                    # Pricing information
│   ├── partnerships.html               # Partner information
│   ├── recruitment.html                # Recruitment services
│   ├── solutions.html                  # Solutions overview
│   ├── booking.html                    # Appointment booking (HubSpot integrated)
│   ├── contact.html                    # Contact page
│   ├── sitemap.html                    # HTML sitemap
│   ├── 404.html                        # Custom 404 error page
│   ├── favicon.svg                     # Site favicon
│   ├── staticwebapp.config.json        # Azure SWA routing & config
│   ├── robots.txt                      # SEO robots file
│   ├── sitemap.xml                     # XML sitemap
│   │
│   └── 📂 assets/                      # Static assets (CSS, JS, Images)
│       ├── css/
│       │   ├── styles.css              # Main stylesheet
│       │   ├── components.css          # Component styles
│       │   ├── animations.css          # Animation effects
│       │   ├── chatbot.css             # Chatbot UI styles
│       │   ├── hubspot-form.css        # HubSpot form styles
│       │   └── accessibility.css       # Accessibility enhancements
│       ├── js/
│       │   ├── main.js                 # Main JavaScript
│       │   ├── nav.js                  # Navigation functionality
│       │   ├── chatbot.js              # Chatbot interface
│       │   ├── hubspot-integration.js  # HubSpot form & API integration
│       │   ├── animations.js           # Animation controllers
│       │   ├── effects.js              # Visual effects
│       │   └── forms.js                # Form validation & handling
│       └── images/
│           ├── logo.png                # Company logo
│           ├── julia-lane.jpeg         # Team member photo
│           └── acs-logo.png            # Partner logo
│
├── 📂 api/                             # Azure Functions (Backend)
│   ├── Program.cs                      # Main program configuration
│   ├── ChatbotFunction.cs              # Basic chatbot endpoint
│   ├── OpenAIChatbotFunction.cs        # AI-powered chatbot with GPT
│   ├── HubSpotFunction.cs              # HubSpot CRM integration
│   ├── host.json                       # Functions configuration + CORS
│   ├── api.csproj                      # .NET project file
│   ├── local.settings.json             # Local environment variables
│   ├── Models/                         # Data models
│   │   ├── AppointmentEntity.cs
│   │   └── AppointmentModels.cs
│   └── Services/                       # Business logic services
│       ├── GraphCalendarService.cs
│       └── MockCalendarService.cs
│
├── 📂 docs/                            # Documentation
│   ├── AZURE_AD_SETUP.md               # Azure AD configuration
│   ├── DEPLOYMENT_REQUIREMENTS.md      # Deployment checklist
│   ├── HUBSPOT_SETUP.md                # HubSpot integration guide
│   ├── MICROSOFT_BOOKINGS_SETUP.md     # Bookings configuration
│   ├── OPENAI_SETUP.md                 # OpenAI API setup
│   ├── SEO_ANALYSIS_RECOMMENDATIONS.md # SEO guidelines
│   ├── CODE_REVIEW.md                  # Senior developer code review
│   └── CONFIGURATION_UPDATES.md        # Recent config updates
│
├── 📂 .github/workflows/
│   └── azure-staticwebapp.yml          # CI/CD pipeline
│
├── 📂 .vscode/                         # VS Code settings
│
├── 📄 Root Configuration Files
│   ├── .env.example                    # Environment variables template
│   ├── swa-cli.config.json             # SWA CLI configuration
│   ├── .gitignore                      # Git ignore rules
│   └── www-skillssolutionsaustralia.sln # Visual Studio solution
│
└── 📂 trash/                           # Unused files (not in git)
    └── [old test files, binaries, etc.]
```

---

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript (ES6+)** - No frameworks, modern features
- **Responsive Design** - Mobile-first approach

### Backend
- **.NET 8.0** - Latest LTS version
- **Azure Functions** - Serverless architecture
- **C#** - Isolated worker model

### Integrations
- **HubSpot API** - CRM contact management
- **OpenAI GPT-3.5-turbo** - AI chatbot
- **Microsoft Bookings** - Appointment scheduling
- **Azure Static Web Apps** - Hosting & deployment

### Development Tools
- **Visual Studio Code** - Primary IDE
- **SWA CLI** - Local development & testing
- **Git & GitHub** - Version control
- **GitHub Actions** - CI/CD automation

---

## ✨ Features

### 🤖 AI-Powered Chatbot
- **GPT-3.5-turbo integration** for intelligent responses
- Company knowledge base built-in
- Contextual conversations about programs and services
- Fallback to basic chatbot if OpenAI unavailable

### 📊 HubSpot CRM Integration
- **Automatic contact capture** on booking page
- Lead information sent to HubSpot before appointment booking
- Environment-aware API endpoints (local vs. production)
- Proper error handling and user feedback

### 📅 Appointment Booking
- **Pre-booking contact capture** form
- Integration with Microsoft Bookings
- 30-minute career consultation slots
- Email confirmation and reminders

### 🎨 Modern Design
- **Cyberpunk neon aesthetic** with purple/teal color scheme
- Smooth animations and transitions
- Particle effects on hero sections
- Fully responsive across all devices

### ♿ Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

### 🔍 SEO Optimized
- Semantic HTML structure
- Meta tags and Open Graph data
- XML and HTML sitemaps
- robots.txt configuration
- Fast page load times

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
- Node.js 18+ (for SWA CLI)
- .NET 8.0 SDK
- Azure Functions Core Tools 4.x
- Git

# Optional but recommended
- Visual Studio Code
- Azure Static Web Apps CLI
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/danmcpherson/www-skillssolutionsaustralia.git
   cd www-skillssolutionsaustralia
   ```

2. **Install SWA CLI** (if not already installed)
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

3. **Configure environment variables**
   
   **Important**: Never commit `local.settings.json` with real API keys!
   
   Copy the example file and add your keys:
   ```bash
   cp api/local.settings.json.example api/local.settings.json
   ```
   
   Then edit `api/local.settings.json` with your actual keys:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
       "OPENAI_API_KEY": "sk-your-actual-openai-key",
       "HUBSPOT_API_KEY": "pat-na1-your-actual-hubspot-key"
     }
   }
   ```
   
   **Note**: This file is already in `.gitignore` and won't be committed.

4. **Start the development server**
   ```bash
   swa start
   ```

5. **Access the site**
   - Main site: http://localhost:4280
   - API: http://localhost:7071/api

---

## 💻 Development

### Running Locally

```bash
# Start the full stack (frontend + API)
swa start

# Or start components separately:

# Frontend only (via Live Server extension)
# Right-click public/index.html → "Open with Live Server"

# API only
cd api
func start
```

### Project Structure Guidelines

**Frontend Code Style:**
- Use vanilla JavaScript (ES6+)
- Follow fail-fast principle
- Minimal comments, self-documenting code
- JSDoc for all functions
- Relative URLs for API calls

**Backend Code Style:**
- Use async/await patterns
- XML documentation for all public methods
- Proper error handling
- Input validation on all endpoints

### Key Configuration Files

#### `staticwebapp.config.json`
- Routes configuration
- MIME types
- Navigation fallback

#### `swa-cli.config.json`
- App location: `public/`
- API location: `api/`
- Output location: `public/`

#### `api/host.json`
- CORS configuration (allows all origins for development)
- Logging settings
- Application Insights configuration

---

## 🚢 Deployment

### Automatic Deployment (GitHub Actions)

Every push to `main` branch triggers automatic deployment:

1. GitHub Actions workflow runs
2. Builds .NET Azure Functions
3. Deploys to Azure Static Web Apps
4. Takes ~5-10 minutes

### Manual Deployment

```bash
# Build the API
cd api
dotnet publish -c Release

# Deploy using SWA CLI (if configured)
swa deploy
```

### Environment Variables in Azure

Your Azure administrator needs to add these in **Azure Portal → Static Web App → Configuration**:

| Variable Name | Description | Required |
|---------------|-------------|----------|
| `HUBSPOT_API_KEY` | HubSpot private app API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes |

**After adding environment variables:**
- Re-run GitHub Actions workflow, OR
- Push any change to trigger automatic deployment

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **[Azure AD Setup](docs/AZURE_AD_SETUP.md)** - Azure Active Directory configuration
- **[Deployment Requirements](docs/DEPLOYMENT_REQUIREMENTS.md)** - Production deployment checklist
- **[HubSpot Setup](docs/HUBSPOT_SETUP.md)** - HubSpot API integration guide
- **[Microsoft Bookings Setup](docs/MICROSOFT_BOOKINGS_SETUP.md)** - Appointment booking configuration
- **[OpenAI Setup](docs/OPENAI_SETUP.md)** - AI chatbot configuration
- **[SEO Recommendations](docs/SEO_ANALYSIS_RECOMMENDATIONS.md)** - SEO best practices

---

## 🧹 Project Cleanup (December 2025)

The project underwent a major reorganization to improve maintainability and professionalism.

### What Changed

**Before:**
- 23 files scattered in root directory
- Test files mixed with production
- No clear organization
- Binaries committed to git

**After:**
- Clean folder structure (`public/`, `docs/`, `api/`, `assets/`)
- Only 6 essential files in root
- All unused files moved to `trash/` (gitignored)
- Professional, maintainable structure

### Files Moved to Trash

These files were identified as unused and moved to `trash/` folder (not committed to git):

**Test/Development Files:**
- `hubspot-test.html` - HubSpot integration testing
- `neon-test.html` - Design testing
- `contact-clean.html` - Old duplicate page

**Empty/Unused Code:**
- `AppointmentsFunction.cs` - Empty file
- `HttpTrigger1.cs` - Test function

**Unused Assets:**
- `appointments.css` - Not referenced
- `appointments.js` - Not referenced

**Binaries:**
- `ngrok` - Binary (shouldn't be in git)
- `ngrok-v3-stable-darwin-amd64.tgz` - Archive

**Scripts:**
- `update_navigation.py` - Old navigation script

### Benefits of Cleanup

✅ Professional structure  
✅ Easy navigation  
✅ Clean root directory  
✅ Better git hygiene  
✅ Deployment-ready  
✅ Maintainable codebase  

---

## 🤝 Contributing

This is a private repository for Skills Solutions Australia. If you're working on this project:

1. Create a feature branch
2. Make your changes
3. Test locally with `swa start`
4. Commit with clear messages
5. Push and create a Pull Request
6. Wait for review and approval

### Commit Message Format

```
<type>: <description>

Examples:
feat: Add new pricing page
fix: Resolve chatbot API connection issue
docs: Update HubSpot integration guide
style: Improve mobile navigation layout
refactor: Reorganize project structure
```

---

## 📞 Support

For questions or issues:

- **Website**: https://skillssolutionsaustralia.com
- **Email**: Julia.lane@skillssolutionsaustralia.com.au
- **Phone**: 0414 670 863

---

## 📄 License

Proprietary - All rights reserved by Skills Solutions Australia.

---

## 🎉 Acknowledgments

- **Winner**: TAS ICT 2022 Award for Development of ICT Employment Opportunities
- **Winner**: Study TAS Industry Partner of the Year 2022 & 2023
- Built with ❤️ in Tasmania, Australia

---

**Last Updated**: December 21, 2025  
**Version**: 2.0 (Post-cleanup)
