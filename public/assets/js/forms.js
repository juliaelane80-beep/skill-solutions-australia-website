/**
 * Skills Solutions Australia - Form Handler
 * Handles form submissions, validation, and user interactions
 */

/**
 * Form handler class
 */
class FormHandler {
    constructor() {
        this.forms = new Map();
        this.validators = new Map();
        this.init();
    }

    /**
     * Initialize form handler
     */
    init() {
        this.setupFormValidation();
        this.setupFormSubmissions();
        this.setupFormEnhancements();
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        // Register default validators
        this.registerValidator('required', this.validateRequired);
        this.registerValidator('email', this.validateEmail);
        this.registerValidator('phone', this.validatePhone);
        this.registerValidator('minLength', this.validateMinLength);
        this.registerValidator('maxLength', this.validateMaxLength);

        // Setup real-time validation
        document.querySelectorAll('form').forEach(form => {
            this.initializeForm(form);
        });
    }

    /**
     * Setup form submissions
     */
    setupFormSubmissions() {
        // Find all forms and set up submission handlers
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add submit event listener (form should already be initialized)
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formId = form.id || `form_${Date.now()}`;
                form.id = formId;
                this.handleFormSubmission(formId);
            });
        });
    }

    /**
     * Initialize individual form
     * @param {HTMLFormElement} form - Form element
     */
    initializeForm(form) {
        const formId = form.id || `form_${Date.now()}`;
        form.id = formId;

        this.forms.set(formId, {
            element: form,
            isValid: false,
            fields: new Map()
        });

        // Setup field validation
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.initializeField(formId, field));

        // Prevent default submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(formId);
        });
    }

    /**
     * Initialize individual field
     * @param {string} formId - Form identifier
     * @param {HTMLInputElement} field - Field element
     */
    initializeField(formId, field) {
        const fieldName = field.name || field.id;
        if (!fieldName) return;

        const formData = this.forms.get(formId);
        formData.fields.set(fieldName, {
            element: field,
            isValid: false,
            rules: this.parseValidationRules(field)
        });

        // Setup event listeners
        field.addEventListener('blur', () => this.validateField(formId, fieldName));
        field.addEventListener('input', window.SkillsSolutions.debounce(() => {
            this.validateField(formId, fieldName);
        }, 300));

        // Add focus/blur effects
        field.addEventListener('focus', () => this.handleFieldFocus(field));
        field.addEventListener('blur', () => this.handleFieldBlur(field));
    }

    /**
     * Parse validation rules from field attributes
     * @param {HTMLInputElement} field - Field element
     * @returns {Array} Validation rules
     */
    parseValidationRules(field) {
        const rules = [];

        if (field.hasAttribute('required')) {
            rules.push({ type: 'required' });
        }

        if (field.type === 'email') {
            rules.push({ type: 'email' });
        }

        if (field.type === 'tel') {
            rules.push({ type: 'phone' });
        }

        if (field.hasAttribute('minlength')) {
            rules.push({ 
                type: 'minLength', 
                value: parseInt(field.getAttribute('minlength')) 
            });
        }

        if (field.hasAttribute('maxlength')) {
            rules.push({ 
                type: 'maxLength', 
                value: parseInt(field.getAttribute('maxlength')) 
            });
        }

        return rules;
    }

    /**
     * Validate individual field
     * @param {string} formId - Form identifier
     * @param {string} fieldName - Field name
     * @returns {boolean} Validation result
     */
    validateField(formId, fieldName) {
        const formData = this.forms.get(formId);
        const fieldData = formData.fields.get(fieldName);
        
        if (!fieldData) return false;

        const field = fieldData.element;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Run validation rules
        for (const rule of fieldData.rules) {
            const validator = this.validators.get(rule.type);
            if (validator) {
                const result = validator(value, rule.value, field);
                if (!result.isValid) {
                    isValid = false;
                    errorMessage = result.message;
                    break;
                }
            }
        }

        // Update field state
        fieldData.isValid = isValid;
        this.updateFieldUI(field, isValid, errorMessage);

        // Update form validity
        this.updateFormValidity(formId);

        return isValid;
    }

    /**
     * Update field UI based on validation state
     * @param {HTMLInputElement} field - Field element
     * @param {boolean} isValid - Validation state
     * @param {string} errorMessage - Error message
     */
    updateFieldUI(field, isValid, errorMessage) {
        const fieldGroup = field.closest('.form-group');
        if (!fieldGroup) return;

        // Remove existing error
        const existingError = fieldGroup.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Update field classes
        field.classList.remove('error', 'valid');
        field.classList.add(isValid ? 'valid' : 'error');

        // Add error message if invalid
        if (!isValid && errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = errorMessage;
            errorElement.setAttribute('role', 'alert');
            fieldGroup.appendChild(errorElement);
        }
    }

    /**
     * Update form validity
     * @param {string} formId - Form identifier
     */
    updateFormValidity(formId) {
        const formData = this.forms.get(formId);
        let isValid = true;

        formData.fields.forEach(fieldData => {
            if (!fieldData.isValid) {
                isValid = false;
            }
        });

        formData.isValid = isValid;

        // Update submit button state
        const submitButton = formData.element.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = !isValid;
            submitButton.classList.toggle('disabled', !isValid);
        }
    }

    /**
     * Handle form submission
     * @param {string} formId - Form identifier
     */
    async handleFormSubmission(formId) {
        const formData = this.forms.get(formId);
        const form = formData.element;

        // Validate all fields before submission
        let allValid = true;
        formData.fields.forEach((fieldData, fieldName) => {
            if (!this.validateField(formId, fieldName)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showFormMessage(form, 'Please correct the errors below.', 'error');
            return;
        }

        // Show loading state
        this.setFormLoading(form, true);

        try {
            // Get form data
            const submitData = new FormData(form);
            const formType = form.dataset.formType || 'contact';

            // Submit form (simulate API call for now)
            const result = await this.submitForm(formType, submitData);

            if (result.success) {
                this.showFormMessage(form, result.message || 'Thank you! Your message has been sent.', 'success');
                form.reset();
                this.resetFormValidation(formId);
            } else {
                this.showFormMessage(form, result.message || 'An error occurred. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage(form, 'An error occurred. Please try again.', 'error');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    /**
     * Submit form data
     * @param {string} formType - Type of form
     * @param {FormData} formData - Form data
     * @returns {Promise} Submission result
     */
    async submitForm(formType, formData) {
        // For Azure Static Web Apps, this would typically send to an API endpoint
        // For now, we'll simulate the submission
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful submission
                resolve({
                    success: true,
                    message: this.getSuccessMessage(formType)
                });
            }, 1000);
        });

        // Actual implementation would look like:
        /*
        const response = await fetch(`/api/forms/${formType}`, {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
        */
    }

    /**
     * Get success message based on form type
     * @param {string} formType - Form type
     * @returns {string} Success message
     */
    getSuccessMessage(formType) {
        const messages = {
            contact: 'Thank you for your message! We\'ll get back to you within 24 hours.',
            graduate: 'Your application has been submitted! We\'ll review it and contact you soon.',
            employer: 'Thank you for your interest in partnering with us! We\'ll be in touch shortly.',
            booking: 'Your appointment request has been received! We\'ll confirm your booking soon.'
        };

        return messages[formType] || 'Thank you! Your submission has been received.';
    }

    /**
     * Show form message
     * @param {HTMLFormElement} form - Form element
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, info)
     */
    showFormMessage(form, message, type) {
        // Remove existing message
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert');

        // Style the message
        messageElement.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            font-weight: 600;
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
            ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
            ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
        `;

        // Insert message
        form.insertBefore(messageElement, form.firstChild);

        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }

    /**
     * Set form loading state
     * @param {HTMLFormElement} form - Form element
     * @param {boolean} isLoading - Loading state
     */
    setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.dataset.originalText || submitButton.textContent;

        if (isLoading) {
            submitButton.dataset.originalText = originalText;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
        } else {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    /**
     * Reset form validation
     * @param {string} formId - Form identifier
     */
    resetFormValidation(formId) {
        const formData = this.forms.get(formId);
        
        formData.fields.forEach(fieldData => {
            fieldData.isValid = false;
            const field = fieldData.element;
            field.classList.remove('error', 'valid');
            
            const fieldGroup = field.closest('.form-group');
            const errorElement = fieldGroup?.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        });

        this.updateFormValidity(formId);
    }

    /**
     * Handle field focus
     * @param {HTMLInputElement} field - Field element
     */
    handleFieldFocus(field) {
        field.classList.add('focused');
        
        if (field.classList.contains('neon-focus')) {
            field.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.3)';
        }
    }

    /**
     * Handle field blur
     * @param {HTMLInputElement} field - Field element
     */
    handleFieldBlur(field) {
        field.classList.remove('focused');
        
        if (field.classList.contains('neon-focus')) {
            field.style.boxShadow = '';
        }
    }

    /**
     * Setup form enhancements
     */
    setupFormEnhancements() {
        // Auto-resize textareas
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });

        // Format phone numbers
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
                e.target.value = value;
            });
        });
    }

    /**
     * Register custom validator
     * @param {string} name - Validator name
     * @param {Function} validator - Validator function
     */
    registerValidator(name, validator) {
        this.validators.set(name, validator);
    }

    // Default validators
    validateRequired(value) {
        return {
            isValid: value.length > 0,
            message: 'This field is required.'
        };
    }

    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: !value || emailRegex.test(value),
            message: 'Please enter a valid email address.'
        };
    }

    validatePhone(value) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        return {
            isValid: !value || phoneRegex.test(value),
            message: 'Please enter a valid phone number.'
        };
    }

    validateMinLength(value, minLength) {
        return {
            isValid: !value || value.length >= minLength,
            message: `Must be at least ${minLength} characters.`
        };
    }

    validateMaxLength(value, maxLength) {
        return {
            isValid: !value || value.length <= maxLength,
            message: `Must be no more than ${maxLength} characters.`
        };
    }
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.SkillsSolutions.FormHandler = new FormHandler();
});

// Export for global access
window.SkillsSolutions = window.SkillsSolutions || {};
window.SkillsSolutions.FormHandler = FormHandler;
