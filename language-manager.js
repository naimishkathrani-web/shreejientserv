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
        // Check if user has manually selected a language before (flag system)
        const manualSelection = localStorage.getItem('languageManuallySelected');
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        if (manualSelection === 'true' && savedLanguage && this.supportedLanguages[savedLanguage]) {
            // User has manually selected language before - use their choice
            this.currentLanguage = savedLanguage;
            console.log(`Using manually selected language: ${savedLanguage}`);
        } else if (savedLanguage && this.supportedLanguages[savedLanguage] && manualSelection === 'false') {
            // Language was auto-detected before and user hasn't changed it
            this.currentLanguage = savedLanguage;
            console.log(`Using previously auto-detected language: ${savedLanguage}`);
        } else {
            // First time visit or no saved preference - auto-detect based on location
            this.currentLanguage = this.detectLanguage();
            localStorage.setItem('preferredLanguage', this.currentLanguage);
            localStorage.setItem('languageManuallySelected', 'false'); // Set flag to false for auto-detection
            console.log(`Auto-detected language from location: ${this.currentLanguage}`);
        }
        
        // Apply language on page load
        this.applyLanguage(this.currentLanguage);
        
        // Create language selector in header
        this.createLanguageSelector();
        
        // Trigger initial language change event after a short delay
        // This ensures page-specific scripts have loaded
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: this.currentLanguage } 
            }));
            console.log(`Initial language event triggered: ${this.currentLanguage}`);
        }, 100);
    }

    detectLanguage() {
        // First, try to detect from browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Check if detected language is supported
        if (this.supportedLanguages[langCode]) {
            console.log(`Language detected from browser: ${langCode}`);
            return langCode;
        }
        
        // Try to detect from location/timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log(`Detected timezone: ${timezone}`);
        
        // For Gujarat/India, all timezones are Asia/Kolkata
        // We'll use browser hints and fallback to regional detection
        if (timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta') {
            // Try to detect regional language from browser locale
            const fullLocale = navigator.language || navigator.userLanguage;
            console.log(`Full locale: ${fullLocale}`);
            
            // Check for regional variants like en-IN, gu-IN, hi-IN, etc.
            const localeMap = {
                'gu-IN': 'gu',  // Gujarati - India
                'gu': 'gu',      // Gujarati
                'hi-IN': 'hi',   // Hindi - India
                'hi': 'hi',      // Hindi
                'mr-IN': 'mr',   // Marathi - India
                'mr': 'mr',      // Marathi
                'ta-IN': 'ta',   // Tamil - India
                'ta': 'ta',      // Tamil
                'te-IN': 'te',   // Telugu - India
                'te': 'te',      // Telugu
                'kn-IN': 'kn',   // Kannada - India
                'kn': 'kn',      // Kannada
                'ml-IN': 'ml',   // Malayalam - India
                'ml': 'ml',      // Malayalam
                'bn-IN': 'bn',   // Bengali - India
                'bn': 'bn',      // Bengali
                'pa-IN': 'pa',   // Punjabi - India
                'pa': 'pa'       // Punjabi
            };
            
            if (localeMap[fullLocale]) {
                console.log(`Language detected from locale: ${localeMap[fullLocale]}`);
                return localeMap[fullLocale];
            }
            
            // Check navigator.languages array for more hints
            if (navigator.languages && navigator.languages.length > 0) {
                for (let lang of navigator.languages) {
                    if (localeMap[lang]) {
                        console.log(`Language detected from languages array: ${localeMap[lang]}`);
                        return localeMap[lang];
                    }
                }
            }
            
            // Try to use IP-based geolocation for more accurate state detection
            // This is a fallback method using a free IP geolocation API
            this.detectByIPLocation();
            
            // Default to Hindi for Indian timezone (most widely spoken)
            console.log('Defaulting to Hindi for Indian timezone');
            return 'hi';
        }
        
        // Default to English for non-Indian timezones
        console.log('Defaulting to English');
        return 'en';
    }

    async detectByIPLocation() {
        try {
            // Using ipapi.co for IP-based location detection (free, no API key needed)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            console.log(`IP Location detected: ${data.region}, ${data.country_name}`);
            
            // Map Indian states to languages
            const stateLanguageMap = {
                'Gujarat': 'gu',
                'Maharashtra': 'mr',
                'Tamil Nadu': 'ta',
                'Telangana': 'te',
                'Andhra Pradesh': 'te',
                'Karnataka': 'kn',
                'Kerala': 'ml',
                'West Bengal': 'bn',
                'Punjab': 'pa',
                'Haryana': 'hi',
                'Uttar Pradesh': 'hi',
                'Madhya Pradesh': 'hi',
                'Rajasthan': 'hi',
                'Delhi': 'hi',
                'Bihar': 'hi',
                'Jharkhand': 'hi',
                'Chhattisgarh': 'hi'
            };
            
            const detectedLang = stateLanguageMap[data.region];
            
            if (detectedLang && data.country_code === 'IN') {
                console.log(`Language detected by IP location: ${detectedLang} (${data.region})`);
                this.currentLanguage = detectedLang;
                localStorage.setItem('preferredLanguage', detectedLang);
                localStorage.setItem('languageManuallySelected', 'false');
                
                // Update UI and trigger change
                this.applyLanguage(detectedLang);
                const languageText = document.querySelector('.language-text');
                if (languageText) {
                    languageText.textContent = this.supportedLanguages[detectedLang];
                }
                document.querySelectorAll('.language-option').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-lang') === detectedLang);
                });
                
                // Trigger language change event
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('languageChanged', { 
                        detail: { language: detectedLang } 
                    }));
                }, 200);
            }
        } catch (error) {
            console.log('IP location detection failed, using default:', error);
        }
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
                                data-lang="${code}"
                                title="${name}">
                            <span class="option-icon">${code === this.currentLanguage ? '✓ ' : ''}</span>
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
        // Set flag to TRUE when user manually selects language
        localStorage.setItem('languageManuallySelected', 'true');
        
        console.log(`Language manually changed to: ${langCode}`);
        
        // Update button text
        const languageButton = document.getElementById('languageButton');
        if (languageButton) {
            const langText = languageButton.querySelector('.language-text');
            if (langText) {
                langText.textContent = this.supportedLanguages[langCode];
            }
        }
        
        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === langCode) {
                option.classList.add('active');
                const icon = option.querySelector('.option-icon');
                if (icon) icon.textContent = '✓ ';
            } else {
                option.classList.remove('active');
                const icon = option.querySelector('.option-icon');
                if (icon) icon.textContent = '';
            }
        });
        
        // Apply language changes
        this.applyLanguage(langCode);
        
        // Dispatch event for page-specific language updates
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: langCode } 
        }));
        
        console.log(`Language changed event dispatched for: ${langCode}`);
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
