class Logistics {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.sessionId = this.generateSessionId();
        this.initEventListeners();
    }

    generateSessionId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    async sendAnalytics(data) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending analytics:', error);
        }
    }

    collectBaseData() {
        return {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer,
            page: window.location.href
        };
    }

    trackEvent(eventType, additionalData = {}) {
        const data = {
            eventType,
            ...additionalData
        };
        this.sendAnalytics(data);
    }

    initEventListeners() {
        // document.addEventListener('click', (event) => {
        //     this.trackEvent('click', {
        //         element: event.target.tagName,
        //         id: event.target.id || null,
        //         classList: event.target.className || null,
        //     });
        // });

        window.addEventListener('beforeunload', () => {
            this.trackEvent('page_exit', this.collectBaseData());
        });
    }
}

// Usage Example
// const analytics = new Logistics('https://your-server.com/analytics');