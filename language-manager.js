// Global Language Manager for Shreeji Enterprise Services
// This file manages language selection across all pages

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = {
            'en': 'English',
            'hi': 'हिंदी',
            'gu': 'ગુજરાતી',
            'mr': 'मराठी',
            'ta': 'தமிழ்',
            'te': 'తెలుగు',
            'kn': 'ಕನ್ನಡ',
            'ml': 'മലയാളം',
            'bn': 'বাংলা',
            'pa': 'ਪੰਜਾਬੀ'
        };
        this.init();
    }

    init() {
        // Load saved language from localStorage or detect from browser
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else {
            this.currentLanguage = this.detectLanguage();
        }
        
        // Apply language on page load
        this.applyLanguage(this.currentLanguage);
        
        // Create language selector in header
        this.createLanguageSelector();
    }

    detectLanguage() {
        // Try to detect from browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Check if detected language is supported
        if (this.supportedLanguages[langCode]) {
            return langCode;
        }
        
        // Try to detect from location/timezone (basic detection)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Map common Indian timezones/regions to languages
        const regionLanguageMap = {
            'Asia/Kolkata': 'hi',
            'Asia/Calcutta': 'bn'
        };
        
        if (regionLanguageMap[timezone]) {
            return regionLanguageMap[timezone];
        }
        
        // Default to English
        return 'en';
    }

    createLanguageSelector() {
        // Check if we're on a contract page (has .header-top)
        const contractHeader = document.querySelector('.header-top');
        
        if (contractHeader) {
            // Contract page - insert into header-top
            const langContainer = document.querySelector('#header-lang-selector');
            if (langContainer) {
                this.insertLanguageDropdown(langContainer);
                this.attachEventListeners();
            }
            return;
        }
        
        // Regular page - find navigation bar
        const navbar = document.querySelector('.navbar .nav-wrapper');
        if (!navbar) return;

        // Create language selector container
        const langContainer = document.createElement('div');
        langContainer.className = 'language-selector';
        
        // Insert before hamburger menu
        const hamburger = navbar.querySelector('.hamburger');
        if (hamburger) {
            navbar.insertBefore(langContainer, hamburger);
        } else {
            navbar.appendChild(langContainer);
        }
        
        this.insertLanguageDropdown(langContainer);
        this.attachEventListeners();
    }

    insertLanguageDropdown(container) {
        container.innerHTML = `
            <div class="language-dropdown">
                <button class="language-button" id="languageButton">
                    <span class="globe-icon">🌐</span>
                    <span class="language-text">${this.supportedLanguages[this.currentLanguage]}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="language-options" id="languageOptions">
                    ${Object.entries(this.supportedLanguages).map(([code, name]) => `
                        <button class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                                data-lang="${code}">
                            ${name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const languageButton = document.getElementById('languageButton');
        const languageOptions = document.getElementById('languageOptions');
        const optionButtons = document.querySelectorAll('.language-option');

        if (!languageButton) return;

        // Toggle dropdown
        languageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            languageOptions.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            languageOptions.classList.remove('show');
        });

        // Language option selection
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = button.getAttribute('data-lang');
                this.changeLanguage(selectedLang);
                languageOptions.classList.remove('show');
            });
        });
    }

    changeLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) return;

        this.currentLanguage = langCode;
        localStorage.setItem('preferredLanguage', langCode);
        
        // Update button text
        const languageText = document.querySelector('.language-text');
        if (languageText) {
            languageText.textContent = this.supportedLanguages[langCode];
        }

        // Update active state
        document.querySelectorAll('.language-option').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === langCode);
        });

        // Apply language changes
        this.applyLanguage(langCode);
        
        // Trigger custom event for page-specific translations
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: langCode } 
        }));
    }

    applyLanguage(langCode) {
        // Set HTML lang attribute
        document.documentElement.setAttribute('lang', langCode);

        // Apply font families based on language
        this.applyLanguageFont(langCode);

        // Translate static elements with data-translate attribute
        this.translateStaticElements(langCode);
    }

    applyLanguageFont(langCode) {
        const body = document.body;
        
        // Remove existing language font classes
        body.classList.remove('font-hindi', 'font-gujarati', 'font-tamil', 'font-telugu', 
                            'font-kannada', 'font-malayalam', 'font-bengali', 'font-punjabi', 'font-marathi');

        // Add language-specific font class
        const fontMap = {
            'hi': 'font-hindi',
            'gu': 'font-gujarati',
            'mr': 'font-marathi',
            'ta': 'font-tamil',
            'te': 'font-telugu',
            'kn': 'font-kannada',
            'ml': 'font-malayalam',
            'bn': 'font-bengali',
            'pa': 'font-punjabi'
        };

        if (fontMap[langCode]) {
            body.classList.add(fontMap[langCode]);
        }
    }

    translateStaticElements(langCode) {
        // This will be populated with translations for static content
        // For now, just trigger the event for dynamic pages
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key, langCode);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    getTranslation(key, langCode) {
        // Basic translations for common elements
        const translations = {
            'nav.home': {
                'en': 'Home',
                'hi': 'होम',
                'gu': 'હોમ',
                'mr': 'मुख्यपृष्ठ',
                'ta': 'முகப்பு',
                'te': 'హోమ్',
                'kn': 'ಮುಖಪುಟ',
                'ml': 'ഹോം',
                'bn': 'হোম',
                'pa': 'ਹੋਮ'
            },
            'nav.about': {
                'en': 'About',
                'hi': 'हमारे बारे में',
                'gu': 'અમારા વિશે',
                'mr': 'आमच्याबद्दल',
                'ta': 'எங்களை பற்றி',
                'te': 'మా గురించి',
                'kn': 'ನಮ್ಮ ಬಗ್ಗೆ',
                'ml': 'ഞങ്ങളെക്കുറിച്ച്',
                'bn': 'আমাদের সম্পর্কে',
                'pa': 'ਸਾਡੇ ਬਾਰੇ'
            },
            'nav.services': {
                'en': 'Services',
                'hi': 'सेवाएं',
                'gu': 'સેવાઓ',
                'mr': 'सेवा',
                'ta': 'சேவைகள்',
                'te': 'సేవలు',
                'kn': 'ಸೇವೆಗಳು',
                'ml': 'സേവനങ്ങൾ',
                'bn': 'সেবা',
                'pa': 'ਸੇਵਾਵਾਂ'
            },
            'nav.contact': {
                'en': 'Contact',
                'hi': 'संपर्क करें',
                'gu': 'સંપર્ક કરો',
                'mr': 'संपर्क',
                'ta': 'தொடர்பு',
                'te': 'సంప్రదించండి',
                'kn': 'ಸಂಪರ್ಕಿಸಿ',
                'ml': 'ബന്ധപ്പെടുക',
                'bn': 'যোগাযোগ',
                'pa': 'ਸੰਪਰਕ ਕਰੋ'
            },
            'nav.rider_agreement': {
                'en': 'Rider Agreement',
                'hi': 'राइडर समझौता',
                'gu': 'રાઇડર કરાર',
                'mr': 'रायडर करार',
                'ta': 'ரைடர் ஒப்பந்தம்',
                'te': 'రైడర్ ఒప్పందం',
                'kn': 'ರೈಡರ್ ಒಪ್ಪಂದ',
                'ml': 'റൈഡർ കരാർ',
                'bn': 'রাইডার চুক্তি',
                'pa': 'ਰਾਈਡਰ ਸਮਝੌਤਾ'
            }
        };

        return translations[key] ? translations[key][langCode] : null;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Initialize language manager when DOM is ready
let languageManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        languageManager = new LanguageManager();
    });
} else {
    languageManager = new LanguageManager();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
