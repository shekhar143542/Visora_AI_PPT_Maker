/**
 * Theme Scoping Utility
 * Ensures presentation themes are only applied to slide content
 * and don't affect the application UI
 */

import { Theme } from '@/lib/types';

export interface ScopedThemeStyles {
  slideContainer: React.CSSProperties;
  slideContent: React.CSSProperties;
  slideTitle: React.CSSProperties;
  slideAccent: React.CSSProperties;
}

/**
 * Get scoped theme styles that only affect slide content
 * @param theme - The presentation theme
 * @returns Scoped styles object
 */
export function getScopedThemeStyles(theme: Theme): ScopedThemeStyles {
  return {
    slideContainer: {
      // Container styles - only affect slide container
      backgroundColor: theme.backgroundColor,
      fontFamily: theme.fontFamily,
      // Use CSS containment to prevent style bleeding
      contain: 'style layout',
      isolation: 'isolate',
    },
    slideContent: {
      // Content styles - only affect slide content
      backgroundColor: theme.slideBackgroundColor || theme.backgroundColor,
      color: theme.fontColor,
      fontFamily: theme.fontFamily,
    },
    slideTitle: {
      // Title styles - only affect slide titles
      color: theme.accentColor,
      fontFamily: theme.fontFamily,
    },
    slideAccent: {
      // Accent styles - only affect accent elements
      backgroundColor: theme.accentColor,
      color: theme.backgroundColor,
    },
  };
}

/**
 * Apply theme styles only to slide container
 * @param element - The slide container element
 * @param theme - The presentation theme
 */
export function applySlideTheme(element: HTMLElement, theme: Theme): void {
  if (!element) return;

  // Remove any existing theme classes
  element.classList.remove(
    'theme-modern', 'theme-corporate', 'theme-creative', 'theme-minimal',
    'theme-vibrant', 'theme-dark', 'theme-light'
  );

  // Add scoped theme class
  element.classList.add(`slide-theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}`);

  // Apply scoped styles
  const styles = getScopedThemeStyles(theme);
  Object.assign(element.style, styles.slideContainer);
}

/**
 * Clear theme styles from an element
 * @param element - The element to clear
 */
export function clearSlideTheme(element: HTMLElement): void {
  if (!element) return;

  // Remove theme classes
  element.classList.remove(
    'theme-modern', 'theme-corporate', 'theme-creative', 'theme-minimal',
    'theme-vibrant', 'theme-dark', 'theme-light'
  );

  // Remove theme-specific classes
  const themeClasses = Array.from(element.classList).filter(cls => 
    cls.startsWith('slide-theme-') || cls.startsWith('theme-')
  );
  themeClasses.forEach(cls => element.classList.remove(cls));

  // Reset styles
  element.style.backgroundColor = '';
  element.style.color = '';
  element.style.fontFamily = '';
  element.style.contain = '';
  element.style.isolation = '';
}

/**
 * Check if an element is a slide container
 * @param element - The element to check
 * @returns True if element is a slide container
 */
export function isSlideContainer(element: HTMLElement): boolean {
  return element.classList.contains('slide-container') || 
         element.classList.contains('slide-theme-preview') ||
         element.closest('.slide-container') !== null;
}

/**
 * Ensure theme styles don't affect application UI
 * @param theme - The presentation theme
 * @returns CSS variables for slide content only
 */
export function getSlideCSSVariables(theme: Theme): Record<string, string> {
  return {
    '--slide-bg-color': theme.backgroundColor,
    '--slide-content-bg-color': theme.slideBackgroundColor || theme.backgroundColor,
    '--slide-text-color': theme.fontColor,
    '--slide-accent-color': theme.accentColor,
    '--slide-font-family': theme.fontFamily,
    '--slide-navbar-color': theme.navbarColor || theme.backgroundColor,
    '--slide-sidebar-color': theme.sidebarColor || theme.backgroundColor,
  };
}

/**
 * Apply theme CSS variables to a slide container
 * @param element - The slide container element
 * @param theme - The presentation theme
 */
export function applySlideCSSVariables(element: HTMLElement, theme: Theme): void {
  if (!element) return;

  const variables = getSlideCSSVariables(theme);
  Object.entries(variables).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
}

/**
 * Theme scoping validation
 * Ensures theme styles are properly scoped
 */
export function validateThemeScoping(): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for global theme classes on body
  if (document.body.classList.toString().includes('theme-')) {
    issues.push('Global theme classes found on body element');
    recommendations.push('Remove theme classes from body element');
  }

  // Check for global theme classes on html
  if (document.documentElement.classList.toString().includes('theme-')) {
    issues.push('Global theme classes found on html element');
    recommendations.push('Remove theme classes from html element');
  }

  // Check for theme CSS variables on root
  const rootStyles = getComputedStyle(document.documentElement);
  const hasThemeVariables = Array.from(rootStyles).some(property => 
    property.startsWith('--theme-') || property.startsWith('--slide-')
  );

  if (hasThemeVariables) {
    issues.push('Theme CSS variables found on root element');
    recommendations.push('Move theme variables to slide containers only');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Clean up any global theme styles
 */
export function cleanupGlobalThemeStyles(): void {
  // Remove theme classes from body and html
  document.body.classList.remove(
    'theme-modern', 'theme-corporate', 'theme-creative', 'theme-minimal',
    'theme-vibrant', 'theme-dark', 'theme-light'
  );
  
  document.documentElement.classList.remove(
    'theme-modern', 'theme-corporate', 'theme-creative', 'theme-minimal',
    'theme-vibrant', 'theme-dark', 'theme-light'
  );

  // Remove theme CSS variables from root
  const rootStyles = getComputedStyle(document.documentElement);
  Array.from(rootStyles).forEach(property => {
    if (property.startsWith('--theme-') || property.startsWith('--slide-')) {
      document.documentElement.style.removeProperty(property);
    }
  });
}
