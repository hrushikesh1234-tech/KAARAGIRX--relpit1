import { useState, useEffect } from 'react';
// Icons replaced with emojis

type ThemeVariant = 'professional' | 'vibrant' | 'tint';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeSettings {
  variant: ThemeVariant;
  primary: string;
  radius: number;
  appearance: ThemeMode;
}

const DEFAULT_THEME: ThemeSettings = {
  variant: 'professional',
  primary: '#2563eb', // Blue
  radius: 0.5,
  appearance: 'light'
};

const PRESET_COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Indigo', value: '#6366f1' },
];

const ThemeCustomizer = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error('Failed to parse theme settings', e);
      }
    }
    return DEFAULT_THEME;
  });

  // Effect to update CSS variables when settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Set primary color and create gradients
    root.style.setProperty('--theme-primary', settings.primary);
    
    // Create a slightly darker shade for hover states
    const darkerColor = adjustColorBrightness(settings.primary, -15);
    root.style.setProperty('--theme-primary-darker', darkerColor);
    
    // Set up gradients based on the primary color
    const gradientEnd = adjustColorBrightness(settings.primary, -10);
    root.style.setProperty('--primary-gradient', 
      `linear-gradient(to right, ${settings.primary}, ${gradientEnd})`);
    
    // Set radius
    root.style.setProperty('--radius', `${settings.radius}rem`);
    root.setAttribute('data-radius', settings.radius.toString());
    
    // Set theme variant
    root.setAttribute('data-theme', settings.variant);
    
    // Save to localStorage
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    
    // Apply dark mode class to html element
    if (settings.appearance === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.appearance === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (settings.appearance === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings]);

  // Function to adjust color brightness
  const adjustColorBrightness = (hex: string, percent: number) => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + (r * percent / 100)));
    g = Math.max(0, Math.min(255, g + (g * percent / 100)));
    b = Math.max(0, Math.min(255, b + (b * percent / 100)));

    // Convert back to hex
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  };

  const handleVariantChange = (variant: ThemeVariant) => {
    setSettings(prev => ({ ...prev, variant }));
  };

  const handlePrimaryColorChange = (color: string) => {
    setSettings(prev => ({ ...prev, primary: color }));
  };

  const handleRadiusChange = (value: number) => {
    setSettings(prev => ({ ...prev, radius: value }));
  };

  const handleAppearanceChange = (appearance: ThemeMode) => {
    setSettings(prev => ({ ...prev, appearance }));
  };

  const resetTheme = () => {
    setSettings(DEFAULT_THEME);
  };

  return (
    <div className="theme-customizer">
      <button 
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full shadow-md flex items-center justify-center"
        style={{ 
          backgroundColor: settings.primary,
          color: '#fff',
          border: 'none'
        }}
      >
        <span className="text-lg">🎨</span>
      </button>
      
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true"></div>
          <div 
            className="bg-white dark:bg-slate-900 w-full sm:w-80 max-w-sm rounded-t-lg sm:rounded-lg shadow-lg z-10 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Theme Customizer</h3>
                <button 
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                  onClick={() => setOpen(false)}
                >
                  <span>✕</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Primary Color</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className="w-full aspect-square rounded-full flex items-center justify-center border-2 transition-all"
                        style={{ 
                          backgroundColor: color.value,
                          borderColor: settings.primary === color.value ? '#fff' : color.value,
                          boxShadow: settings.primary === color.value ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'
                        }}
                        onClick={() => handlePrimaryColorChange(color.value)}
                        title={color.name}
                      >
                        {settings.primary === color.value && (
                          <span className="text-white">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Border Radius: {settings.radius}rem</h4>
                  <input 
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.radius}
                    onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Appearance</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      className={`px-3 py-2 rounded-md flex items-center justify-center text-sm ${
                        settings.appearance === 'light' 
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleAppearanceChange('light')}
                    >
                      <span className="mr-1">☀️</span>
                      Light
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-md flex items-center justify-center text-sm ${
                        settings.appearance === 'dark' 
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleAppearanceChange('dark')}
                    >
                      <span className="mr-1">🌙</span>
                      Dark
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-md flex items-center justify-center text-sm ${
                        settings.appearance === 'system' 
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleAppearanceChange('system')}
                    >
                      <span className="mr-1">💻</span>
                      System
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Theme Variant</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      className={`px-3 py-2 rounded-md text-sm ${
                        settings.variant === 'professional' 
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleVariantChange('professional')}
                    >
                      Classic
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-md text-sm ${
                        settings.variant === 'vibrant' 
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleVariantChange('vibrant')}
                    >
                      Vibrant
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-md text-sm ${
                        settings.variant === 'tint' 
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleVariantChange('tint')}
                    >
                      Soft
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <button 
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-md"
                  onClick={resetTheme}
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeCustomizer; 