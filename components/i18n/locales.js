// Supported UI languages. `dir` drives the document direction (RTL scripts).
export const locales = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'hi', name: 'हिन्दी', dir: 'ltr' },
  { code: 'ta', name: 'தமிழ்', dir: 'ltr' },
  { code: 'te', name: 'తెలుగు', dir: 'ltr' },
  { code: 'ml', name: 'മലയാളം', dir: 'ltr' },
  { code: 'mr', name: 'मराठी', dir: 'ltr' },
  { code: 'kn', name: 'ಕನ್ನಡ', dir: 'ltr' },
  { code: 'gu', name: 'ગુજરાતી', dir: 'ltr' },
  { code: 'bn', name: 'বাংলা', dir: 'ltr' },
  { code: 'ur', name: 'اردو', dir: 'rtl' },
  { code: 'or', name: 'ଓଡ଼ିଆ', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'ru', name: 'Русский', dir: 'ltr' },
  { code: 'pt', name: 'Português', dir: 'ltr' },
]

export const defaultLocale = 'en'

export function getLocale(code) {
  return locales.find((l) => l.code === code) || locales[0]
}
