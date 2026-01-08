/**
 * AI Chatbot Module
 * Handles chatbot functionality for Skills Solutions Australia website
 * Uses vanilla JavaScript with modern ES6+ features
 */

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        // Use relative URLs for API calls (Azure Static Web Apps proxy)
        this.apiEndpoint = '/api/ai-chat'; // Primary AI endpoint
        this.fallbackEndpoint = '/api/chat'; // Fallback to keyword-based system
        this.useAI = true; // Try AI first, fallback if needed
        
        this.init();
    }

    /**
     * Initialize the chatbot
     */
    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    /**
     * Create the chatbot HTML structure
     */
    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle" aria-label="Open chatbot" role="button">
                    <svg class="chatbot-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </button>
                
                <div class="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-avatar">AI</div>
                        <div>
                            <h3 class="chatbot-title">AI Assistant</h3>
                            <p class="chatbot-subtitle">Here to help with your questions</p>
                        </div>
                    </div>
                    
                    <div class="chatbot-messages" role="log" aria-live="polite"></div>
                    
                    <div class="chatbot-input-container">
                        <div class="chatbot-input-wrapper">
                            <textarea 
                                class="chatbot-input" 
                                placeholder="Type your message..."
                                aria-label="Chat message input"
                                rows="1"
                                maxlength="500"
                            ></textarea>
                            <button class="chatbot-send" aria-label="Send message" disabled>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Cache DOM elements
        this.toggle = document.querySelector('.chatbot-toggle');
        this.window = document.querySelector('.chatbot-window');
        this.messages = document.querySelector('.chatbot-messages');
        this.input = document.querySelector('.chatbot-input');
        this.sendButton = document.querySelector('.chatbot-send');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle chatbot
        this.toggle.addEventListener('click', () => this.toggleChatbot());

        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Send message on Enter (but allow Shift+Enter for new lines)
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea and enable/disable send button
        this.input.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.toggleSendButton();
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.chatbot-container')) {
                this.closeChatbot();
            }
        });

        // Handle quick replies
        this.messages.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                this.handleQuickReply(e.target.textContent);
            }
        });
    }

    /**
     * Toggle chatbot open/closed state
     */
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    /**
     * Open the chatbot
     */
    openChatbot() {
        this.isOpen = true;
        this.toggle.classList.add('active');
        this.window.classList.add('active');
        this.input.focus();
        
        // Track analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'chatbot_opened', {
                event_category: 'engagement'
            });
        }
    }

    /**
     * Close the chatbot
     */
    closeChatbot() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.window.classList.remove('active');
    }

    /**
     * Auto-resize textarea based on content
     */
    autoResizeTextarea() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 80) + 'px';
    }

    /**
     * Enable/disable send button based on input content
     */
    toggleSendButton() {
        const hasContent = this.input.value.trim().length > 0;
        this.sendButton.disabled = !hasContent || this.isTyping;
    }

    /**
     * Show welcome message with quick replies
     */
    showWelcomeMessage() {
        const welcomeMessage = `Hello! I'm your AI Assistant for Skills Solutions Australia. I can help you with:
        
• Information about our internship programs
• Career services and support
• Application processes
• Partnership opportunities

How can I assist you today?`;

        this.addMessage(welcomeMessage, 'bot');
        
        const quickReplies = [
            'Tell me about internships',
            'How to apply?',
            'Career services',
            'Partnership info'
        ];
        
        this.addQuickReplies(quickReplies);
    }

    /**
     * Send a message
     */
    async sendMessage() {
        const message = this.input.value.trim();
        
        if (!message || this.isTyping) {
            return;
        }

        // Add user message to chat
        this.addMessage(message, 'user');
        this.conversationHistory.push({ role: 'user', content: message });
        
        // Clear input and disable send button
        this.input.value = '';
        this.autoResizeTextarea();
        this.toggleSendButton();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call API for response
            const response = await this.callChatAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response.message, 'bot', response.isAI);
            
            if (response.quickReplies) {
                this.addQuickReplies(response.quickReplies);
            }
            
        } catch (error) {
            this.hideTypingIndicator();
            this.handleError(error);
        }
    }

    /**
     * Call the chat API with AI-first approach and fallback
     * @param {string} message - User message
     * @returns {Promise<Object>} API response
     */
    async callChatAPI(message) {
        try {
            const requestBody = {
                message: message,
                history: this.conversationHistory.slice(-10) // Last 10 messages for context
            };

            // Try AI endpoint first
            if (this.useAI) {
                try {
                    const response = await fetch(this.apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        this.conversationHistory.push({ role: 'assistant', content: data.message });
                        return {
                            message: data.message,
                            quickReplies: data.quickReplies,
                            isAI: data.isAI ?? true
                        };
                    }
                } catch (aiError) {
                    console.warn('AI endpoint failed, falling back to keyword system:', aiError);
                }
            }

            // Fallback to keyword-based system
            const fallbackResponse = await fetch(this.fallbackEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!fallbackResponse.ok) {
                throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
            }

            const data = await fallbackResponse.json();
            this.conversationHistory.push({ role: 'assistant', content: data.message });
            
            return {
                message: data.message,
                quickReplies: data.quickReplies,
                isAI: false
            };

        } catch (error) {
            console.error('Both AI and fallback endpoints failed:', error);
            
            // Final fallback - client-side response
            return this.getClientFallbackResponse(message);
        }
    }

    /**
     * Provide client-side fallback responses when all APIs are unavailable
     * @param {string} message - User message
     * @returns {Object} Fallback response
     */
    getClientFallbackResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('internship') || msg.includes('program')) {
            return {
                message: `Hi! I'm your AI Assistant, and I'd love to tell you about our Future Ready Internship Program!

**Key Features:**
• 6-month structured placements
• Real-world project experience  
• Professional mentorship
• Direct pathway to employment
• Industry-recognised skills

While my full AI capabilities are starting up, I can still help with basic information. For detailed questions, please visit our contact page or call us directly.`,
                quickReplies: ['Contact us', 'Visit website', 'Try again later']
            };
        } else if (msg.includes('apply') || msg.includes('application')) {
            return {
                message: `I'm your AI Assistant! Here's how to apply for our programs:

**Application Steps:**
• Check eligibility requirements
• Complete online application
• Skills assessment interview
• Match with employer partner
• Begin your journey!

For the full application form and detailed process, please visit our website or contact our team directly.`,
                quickReplies: ['Contact us', 'Visit website', 'Eligibility info']
            };
        } else if (msg.includes('contact') || msg.includes('help')) {
            return {
                message: `I'm your AI Assistant for Skills Solutions Australia! 

**Get in Touch:**
• Website: skillssolutionsaustralia.com
• Visit our contact page for phone and email
• Located in Tasmania, serving the state
• Quick response during business hours

I'm currently in simplified mode while my full capabilities load. Our team is always ready to help with personalised assistance!`,
                quickReplies: ['Visit contact page', 'Learn more', 'Try again']
            };
        } else {
            return {
                message: `Hello! I'm your AI Assistant for Skills Solutions Australia.

I'm currently in simplified mode while my full AI capabilities start up. I can still help you with:

**What I Can Assist With:**
• Internship program information
• Application guidance  
• Contact information
• General questions

For the best experience, please try again in a few moments or contact our team directly!`,
                quickReplies: ['Internship info', 'How to apply', 'Contact us', 'Try again']
            };
        }
    }

    /**
     * Handle quick reply selection
     * @param {string} replyText - Selected quick reply text
     */
    handleQuickReply(replyText) {
        this.input.value = replyText;
        this.sendMessage();
    }

    /**
     * Add a message to the chat
     * @param {string} message - Message content
     * @param {string} type - Message type ('user' or 'bot')
     * @param {boolean} isAI - Whether the message is from AI (optional)
     */
    addMessage(message, type, isAI = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        // Add AI indicator for bot messages
        if (type === 'bot' && isAI) {
            messageElement.classList.add('ai-powered');
            messageElement.setAttribute('title', 'Response powered by AI');
        }
        
        // Format the message with proper line breaks and HTML
        const formattedMessage = this.formatMessage(message);
        messageElement.innerHTML = formattedMessage;
        
        // Add AI badge for AI-powered responses
        if (type === 'bot' && isAI) {
            const aiBadge = document.createElement('span');
            aiBadge.className = 'ai-badge';
            aiBadge.innerHTML = 'AI';
            aiBadge.title = 'This response was generated using AI';
            messageElement.appendChild(aiBadge);
        }
        
        this.messages.appendChild(messageElement);
        this.scrollToBottom();
    }

    /**
     * Format message text with proper line breaks and bullet points
     * @param {string} message - Raw message text
     * @returns {string} Formatted HTML message
     */
    formatMessage(message) {
        // Convert bullet points to proper HTML lists
        let formatted = message
            // Convert • bullet points to HTML list items
            .replace(/^• (.+)$/gm, '<li>$1</li>')
            // Convert ** bold text ** to HTML bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert line breaks to <br> tags
            .replace(/\n/g, '<br>');

        // Wrap consecutive list items in <ul> tags
        formatted = formatted.replace(/(<li>.*<\/li>(?:\s*<br>\s*<li>.*<\/li>)*)/gs, (match) => {
            const listItems = match.replace(/<br>\s*/g, '');
            return `<ul>${listItems}</ul>`;
        });

        // Remove extra <br> tags around lists
        formatted = formatted.replace(/<br>\s*<ul>/g, '<ul>');
        formatted = formatted.replace(/<\/ul>\s*<br>/g, '</ul>');

        return formatted;
    }

    /**
     * Add quick reply buttons
     * @param {Array<string>} replies - Array of quick reply texts
     */
    addQuickReplies(replies) {
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply;
            button.setAttribute('aria-label', `Quick reply: ${reply}`);
            quickRepliesContainer.appendChild(button);
        });
        
        this.messages.appendChild(quickRepliesContainer);
        this.scrollToBottom();
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        this.isTyping = true;
        this.toggleSendButton();
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message typing';
        typingElement.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        typingElement.setAttribute('data-typing', 'true');
        this.messages.appendChild(typingElement);
        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.isTyping = false;
        this.toggleSendButton();
        
        const typingElement = this.messages.querySelector('[data-typing="true"]');
        if (typingElement) {
            typingElement.remove();
        }
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     */
    handleError(error) {
        console.error('Chatbot API error:', error);
        
        const errorMessage = 'Sorry, I\'m having trouble connecting right now. Please try again later or contact us directly.';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'message bot error-message';
        errorElement.textContent = errorMessage;
        
        this.messages.appendChild(errorElement);
        this.scrollToBottom();
        
        // Offer fallback options
        const fallbackReplies = [
            'Contact us directly',
            'Visit our contact page',
            'Try again'
        ];
        
        this.addQuickReplies(fallbackReplies);
    }

    /**
     * Scroll messages to bottom
     */
    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new Chatbot();
    } catch (error) {
        console.error('Failed to initialize chatbot:', error);
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Chatbot;
}
