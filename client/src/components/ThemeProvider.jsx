import { createContext, useContext, useEffect, useState } from 'react';

  const ThemeContext = createContext({
      theme: 'system',
      setTheme: () => null,
  });

  export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'kitaab-theme' }) {
      const [theme, setTheme] = useState(() => {
          return localStorage.getItem(storageKey) || defaultTheme;
      });

      useEffect(() => {
          const root = window.document.documentElement;

          root.classList.remove('light', 'dark');

          if (theme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light';
              root.classList.add(systemTheme);
          } else {
              root.classList.add(theme);
          }

          localStorage.setItem(storageKey, theme);
      }, [theme, storageKey]);

      return (
          <ThemeContext.Provider value={{ theme, setTheme }}>
              {children}
          </ThemeContext.Provider>
      );
  }

  export const useTheme = () => {
      const context = useContext(ThemeContext);
      if (!context) {
          throw new Error('useTheme must be used within ThemeProvider');
      }
      return context;
  };