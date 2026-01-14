/**
 * HubSpot Integration Module
 * Handles contact creation and appointment booking workflow
 * Uses vanilla JavaScript with modern ES6+ features
 */

class HubSpotIntegration {
    constructor() {
        // Always use relative URL - works for both local SWA emulator and production
        this.apiEndpoint = '/api/hubspot-create-contact';
        
        this.init();
    }

    /**
     * Initialize the HubSpot integration
     */
    init() {
        this.createPreBookingForm();
        this.bindEvents();
    }

    /**
     * Create the pre-booking contact capture form
     */
    createPreBookingForm() {
        // Find the existing booking widget
        const bookingWidget = document.getElementById('booking-widget');
        if (!bookingWidget) return;

        // Create the form HTML
        const formHTML = `
            <div id="hubspot-form-container" class="hubspot-form">
                <div style="background: var(--color-bg); padding: var(--space-xl); border-radius: var(--radius-lg); border: 2px solid var(--primary-purple);">
                    <div style="text-align: center; margin-bottom: var(--space-lg);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-purple)" stroke-width="1.5">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    
                    <h3 style="color: var(--primary-purple); margin-bottom: var(--space-sm); text-align: center; font-size: var(--font-size-lg);">
                        Let's Get Started
                    </h3>
                    
                    <p style="color: var(--color-text-muted); margin-bottom: var(--space-lg); text-align: center; font-size: var(--font-size-md); line-height: 1.6;">
                        Please share your details so we can provide you with the most relevant career guidance.
                    </p>

                    <form id="hubspot-contact-form" class="contact-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName" class="form-label">First Name *</label>
                                <input type="text" id="firstName" name="firstName" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName" class="form-label">Last Name</label>
                                <input type="text" id="lastName" name="lastName" class="form-input">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="email" class="form-label">Email Address *</label>
                            <input type="email" id="email" name="email" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="tel" id="phone" name="phone" class="form-input" placeholder="+61 4XX XXX XXX">
                        </div>
                        
                        <div class="form-group">
                            <label for="resume" class="form-label">Resume/CV (Optional)</label>
                            <div class="file-upload-wrapper">
                                <input type="file" id="resume" name="resume" class="form-input-file" accept=".pdf,.doc,.docx" style="display: none;">
                                <button type="button" class="btn btn-secondary" id="resume-upload-btn" style="width: 100%; text-align: left; display: flex; align-items: center; justify-content: space-between;">
                                    <span id="resume-file-name">Choose file (PDF, DOC, DOCX)</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                </button>
                                <p style="color: var(--color-text-muted); font-size: var(--font-size-xs); margin-top: var(--space-xs);">
                                    Max file size: 5MB. Accepted formats: PDF, DOC, DOCX
                                </p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="australia-resident" class="form-label">Are you currently in Australia? *</label>
                            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm);">
                                <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 16px; background: var(--color-bg); border: 2px solid var(--border-color); border-radius: var(--radius-sm); transition: all 0.3s ease;">
                                    <input type="radio" name="australia-resident" value="yes" id="australia-yes" required style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer; accent-color: var(--primary-purple);">
                                    <span style="color: var(--color-text); font-size: 0.95rem; font-weight: 500;">Yes</span>
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 16px; background: var(--color-bg); border: 2px solid var(--border-color); border-radius: var(--radius-sm); transition: all 0.3s ease;">
                                    <input type="radio" name="australia-resident" value="no" id="australia-no" required style="width: 16px; height: 16px; margin-right: 8px; cursor: pointer; accent-color: var(--primary-purple);">
                                    <span style="color: var(--color-text); font-size: 0.95rem; font-weight: 500;">No</span>
                                </label>
                            </div>
                            <div id="australia-warning" style="display: none; margin-top: var(--space-sm); padding: var(--space-md); background: rgba(239, 68, 68, 0.1); border-left: 3px solid var(--accent-red); border-radius: var(--radius-sm);">
                                <p style="color: var(--accent-red); font-size: var(--font-size-sm); margin: 0; display: flex; align-items: center; gap: var(--space-xs);">
                                    <span style="font-size: 1.2em;">⚠️</span>
                                    <span>You must be in Australia to book an appointment with us.</span>
                                </p>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-neon btn-lg" style="width: 100%;" id="submit-btn">
                            <span class="btn-text">Continue to Booking</span>
                            <span class="btn-loading" style="display: none;">
                                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                </svg>
                                Processing...
                            </span>
                        </button>
                    </form>
                    
                    <p style="color: var(--color-text-muted); font-size: var(--font-size-xs); margin-top: var(--space-md); text-align: center; font-style: italic;">
                        Your information is secure and will only be used to provide you with career services.
                    </p>
                </div>
            </div>
            
            <div id="booking-success" class="booking-success" style="display: none;">
                <div style="background: var(--color-bg); padding: var(--space-xl); border-radius: var(--radius-lg); border: 2px solid var(--primary-teal); text-align: center;">
                    <div style="margin-bottom: var(--space-lg);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-teal)" stroke-width="1.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22,4 12,14.01 9,11.01"></polyline>
                        </svg>
                    </div>
                    <h3 style="color: var(--primary-teal); margin-bottom: var(--space-sm);">Thank You!</h3>
                    <p style="color: var(--color-text-muted); margin-bottom: var(--space-lg);">
                        Your details have been saved. Now let's book your consultation time.
                    </p>
                    <a href="https://calendly.com/julia-lane-skillssolutionsaustralia/30min" 
                       target="_blank" 
                       class="btn btn-primary btn-neon btn-lg">
                        Schedule Your Appointment
                    </a>
                </div>
            </div>
        `;

        // Replace the existing content
        bookingWidget.innerHTML = formHTML;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Handle form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'hubspot-contact-form') {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        // Handle input validation
        document.addEventListener('input', (e) => {
            if (e.target.closest('#hubspot-contact-form')) {
                this.validateField(e.target);
            }
        });
        
        // Handle file upload button click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'resume-upload-btn' || e.target.closest('#resume-upload-btn')) {
                e.preventDefault();
                const fileInput = document.getElementById('resume');
                if (fileInput) fileInput.click();
            }
        });
        
        // Handle file selection
        document.addEventListener('change', (e) => {
            if (e.target.id === 'resume') {
                this.handleFileSelection(e.target);
            }
            
            // Handle Australia residency selection
            if (e.target.name === 'australia-resident') {
                this.handleAustraliaResidency(e.target);
            }
        });
    }
    
    /**
     * Handle Australia residency validation
     * @param {HTMLInputElement} radioInput - The radio input element
     */
    handleAustraliaResidency(radioInput) {
        const yesRadio = document.getElementById('australia-yes');
        const noRadio = document.getElementById('australia-no');
        const warning = document.getElementById('australia-warning');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!yesRadio || !noRadio || !warning || !submitBtn) return;
        
        const yesLabel = yesRadio.closest('label');
        const noLabel = noRadio.closest('label');
        
        if (yesRadio.checked) {
            // Enable submission
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            warning.style.display = 'none';
            
            // Update visual feedback
            if (yesLabel) {
                yesLabel.style.borderColor = 'var(--primary-purple)';
                yesLabel.style.background = 'rgba(168, 85, 247, 0.1)';
            }
            if (noLabel) {
                noLabel.style.borderColor = 'var(--border-color)';
                noLabel.style.background = 'var(--color-bg)';
            }
        } else if (noRadio.checked) {
            // Disable submission and show warning
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            warning.style.display = 'block';
            
            // Add shake animation
            warning.style.animation = 'shake 0.5s';
            setTimeout(() => {
                warning.style.animation = '';
            }, 500);
            
            // Update visual feedback
            if (noLabel) {
                noLabel.style.borderColor = 'var(--accent-red)';
                noLabel.style.background = 'rgba(239, 68, 68, 0.1)';
            }
            if (yesLabel) {
                yesLabel.style.borderColor = 'var(--border-color)';
                yesLabel.style.background = 'var(--color-bg)';
            }
        }
    }
    
    /**
     * Handle file selection
     * @param {HTMLInputElement} fileInput - The file input element
     */
    handleFileSelection(fileInput) {
        const file = fileInput.files[0];
        const fileNameDisplay = document.getElementById('resume-file-name');
        
        console.log('[FILE SELECTION] File input triggered');
        console.log('[FILE SELECTION] Files count:', fileInput.files.length);
        console.log('[FILE SELECTION] File object:', file);
        
        if (!file) {
            console.log('[FILE SELECTION] No file selected');
            fileNameDisplay.textContent = 'Choose file (PDF, DOC, DOCX)';
            return;
        }
        
        console.log('[FILE SELECTION] File details:', {
            name: file.name,
            size: file.size,
            type: file.type
        });
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            console.log('[FILE SELECTION] Invalid file type:', file.type);
            alert('Please upload a PDF, DOC, or DOCX file.');
            fileInput.value = '';
            fileNameDisplay.textContent = 'Choose file (PDF, DOC, DOCX)';
            return;
        }
        
        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            console.log('[FILE SELECTION] File too large:', file.size);
            alert('File size must be less than 5MB. Please choose a smaller file.');
            fileInput.value = '';
            fileNameDisplay.textContent = 'Choose file (PDF, DOC, DOCX)';
            return;
        }
        
        // Update display with file name
        console.log('[FILE SELECTION] File validated successfully:', file.name);
        fileNameDisplay.textContent = file.name;
    }

    /**
     * Handle form submission
     * @param {HTMLFormElement} form - The form element
     */
    async handleFormSubmit(form) {
        const submitBtn = form.querySelector('#submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        try {
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';

            // Collect form data (use FormData to handle file upload)
            const formData = new FormData(form);
            
            // Debug: Log FormData contents
            console.log('[FORM SUBMIT] FormData created');
            console.log('[FORM SUBMIT] Form fields:');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
                } else {
                    console.log(`  ${key}: ${value}`);
                }
            }
            
            // Validate required fields
            const firstName = formData.get('firstName');
            const email = formData.get('email');
            
            if (!firstName || !email) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            console.log('[FORM SUBMIT] Sending request to:', this.apiEndpoint);
            
            // Send to API (FormData will be sent as multipart/form-data)
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                body: formData  // Don't set Content-Type header, browser will set it automatically with boundary
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessState();
                
                // Track analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'hubspot_contact_created', {
                        event_category: 'engagement',
                        event_label: 'booking_form'
                    });
                }
            } else {
                throw new Error(result.error || 'Failed to save contact information');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showError(error.message);
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    /**
     * Create contact in HubSpot
     * @param {Object} contactData - Contact information
     * @returns {Promise<Object>} API response
     */
    async createHubSpotContact(contactData) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: contactData.email,
                    firstName: contactData.firstName,
                    lastName: contactData.lastName,
                    phone: contactData.phone
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                console.error('Status:', response.status);
                throw new Error(`API Error (${response.status}): ${errorText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('HubSpot API error:', error);
            throw error;
        }
    }

    /**
     * Show success state and booking link
     */
    showSuccessState() {
        const formContainer = document.getElementById('hubspot-form-container');
        const successContainer = document.getElementById('booking-success');
        
        if (formContainer) formContainer.style.display = 'none';
        if (successContainer) successContainer.style.display = 'block';
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.form-error-message');
        if (existingError) existingError.remove();

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid #dc3545;
            color: #dc3545;
            padding: var(--space-sm);
            border-radius: var(--border-radius);
            margin-top: var(--space-sm);
            font-size: var(--font-size-sm);
            text-align: center;
        `;
        errorDiv.textContent = message;

        // Insert after form
        const form = document.getElementById('hubspot-contact-form');
        if (form) {
            form.insertAdjacentElement('afterend', errorDiv);
        }
    }

    /**
     * Validate individual form field
     * @param {HTMLInputElement} field - Form field to validate
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Show/hide error state
        this.setFieldErrorState(field, isValid, errorMessage);
    }

    /**
     * Set field error state
     * @param {HTMLInputElement} field - Form field
     * @param {boolean} isValid - Whether field is valid
     * @param {string} errorMessage - Error message to show
     */
    setFieldErrorState(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();

        if (!isValid && errorMessage) {
            // Add error class
            field.style.borderColor = '#dc3545';
            
            // Add error message
            const errorSpan = document.createElement('span');
            errorSpan.className = 'field-error';
            errorSpan.style.cssText = 'color: #dc3545; font-size: var(--font-size-xs); margin-top: 4px; display: block;';
            errorSpan.textContent = errorMessage;
            formGroup.appendChild(errorSpan);
        } else {
            // Remove error state
            field.style.borderColor = '';
        }
    }
}

// Initialize HubSpot integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on booking page
    if (document.getElementById('booking-widget')) {
        try {
            new HubSpotIntegration();
        } catch (error) {
            console.error('Failed to initialize HubSpot integration:', error);
        }
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HubSpotIntegration;
}
