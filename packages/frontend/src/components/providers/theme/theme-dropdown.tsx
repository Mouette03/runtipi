import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from './theme-provider';

export const ThemeDropdown: React.FC = () => {
  const { theme, resolvedTheme, setTheme, supportsSystemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const SunIcon = () => (
    <svg className="icon icon-tabler icon-tabler-sun me-2" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="12" cy="12" r="4" />
      <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
    </svg>
  );

  const MoonIcon = () => (
    <svg className="icon icon-tabler icon-tabler-moon me-2" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </svg>
  );

  const DeviceDesktopIcon = () => (
    <svg className="icon icon-tabler icon-tabler-device-desktop me-2" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <line x1="7" y1="20" x2="17" y2="20" />
      <line x1="9" y1="16" x2="9" y2="20" />
      <line x1="15" y1="16" x2="15" y2="20" />
    </svg>
  );

  const handleSelect = (mode: ThemeMode) => {
    setTheme(mode);
    setIsOpen(false);
  };

  return (
    <div className="nav-item dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="nav-link px-0 text-reset"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Changer le thème"
        aria-expanded={isOpen}
      >
        {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </button>

      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow show position-absolute" style={{ right: 0 }}>
          <button
            type="button"
            className={`dropdown-item ${theme === 'light' ? 'active' : ''}`}
            onClick={() => handleSelect('light')}
          >
            <SunIcon /> Clair
          </button>

          <button
            type="button"
            className={`dropdown-item ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleSelect('dark')}
          >
            <MoonIcon /> Sombre
          </button>

          {supportsSystemTheme && (
            <button
              type="button"
              className={`dropdown-item ${theme === 'system' ? 'active' : ''}`}
              onClick={() => handleSelect('system')}
            >
              <DeviceDesktopIcon /> Système
            </button>
          )}
        </div>
      )}
    </div>
  );
};
