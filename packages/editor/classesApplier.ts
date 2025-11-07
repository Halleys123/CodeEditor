// ANSWER: Allowed properties user can change are: (thought for now)
// 1. VirtulizationWrapperClasses: // ? NONE
// 2. StickyContainerClasses: // * background-color, font-size, gap, font-family
// -------------------------- // Direct children under it will have // * padding, gap
// 3. NumberContainerClasses: // ? NONE
// 4. CodeContainerClasses: // ? NONE
// 5. NumberSpanClasses: // * color
// 6. CodeLineClasses: // * transition: color [time], background-color
// ------------------- On hover // * background-color
// 7. CodeSpanClasses: // # TBD
// 8. VerticalDivideClasses: // * border-right;

// ANSWER: Deciding on variables names
// ? StickyContainerClasses variables:
// 1. --[UUID]-bg-color
// 2. --[UUID]-font-size
// 3. --[UUID]-gap
// 4. --[UUID]-font-family
// 5. --[UUID]-padding
// ? NumberSpanClasses variables:
// 6. --[UUID]-line-number-color
// ? CodeLineClasses variables:
// 7. --[UUID]-line-transition-time
// 8. --[UUID]-line-hover-bg-color
// ? VerticalDivideClasses variables:
// 9. --[UUID]-vertical-divide-border

// ANSWER: Fixed Properties required on each are:
// 1. VirtulizationWrapperClasses: // * position: relateive, width: 100%
// ------------------------------ All child classes will have // * padding, margin as 0 and box-sizing: border box
// 2. StickyContainerClasses: // * position: sticky; top: 0; left: 0; width: 100%; overflow: hidden; display: flex; flex-direction: row;
// -------------------------- // * display: flex; flex-direction: column; align-self: stretch; align-items: flex-start; justify-content: flex-start;
// 3. NumberContainerClasses: // * align-items: center; min-width: 40px; max-width: 60px; text-align: right;
// 4. CodeContainerClasses: // * flex: 1; color: white; // Color for now only
// 5. NumberSpanClasses: // * width: 100%; display: block;
// 6. CodeLineClasses: // * width: 100%; cursor: text;
// 7. CodeSpanClasses: // # TBD
// 8. VerticalDivideClasses: // * border-right;

// Generates classes based on description by the user and allows to modify some of them and then apply them
class ClassHandler {
  // Other properties
  private sessionUUID: string;

  // Style and theme Related properties
  private AllowedThemeVariables: Set<string>;
  private CSSVariables: Record<string, Record<string, string>>;
  private CSS_StylesRecord: Record<string, Record<string, string>>;
  private ThemeVariableAliasMap: Record<string, string>;

  // Elements in Code Structure, their Classes
  private VirtulizationWrapperClassName: string;
  private StickyContainerClassName: string;
  private NumberContainerClassName: string;
  private CodeContainerClassName: string;
  private NumberSpanClassName: string;
  private CodeLineClassName: string;
  private VerticalDivideClassName: string;

  constructor(
    VirtulizationWrapperClassName: string,
    StickyContainerClassName: string,
    NumberContainerClassName: string,
    CodeContainerClassName: string,
    NumberSpanClassName: string,
    CodeLineClassName: string,
    VerticalDivideClassName: string
  ) {
    this.VirtulizationWrapperClassName = VirtulizationWrapperClassName;
    this.StickyContainerClassName = StickyContainerClassName;
    this.NumberContainerClassName = NumberContainerClassName;
    this.CodeContainerClassName = CodeContainerClassName;
    this.NumberSpanClassName = NumberSpanClassName;
    this.CodeLineClassName = CodeLineClassName;
    this.VerticalDivideClassName = VerticalDivideClassName;

    this.sessionUUID = 'a' + crypto.randomUUID().toString();

    this.AllowedThemeVariables = new Set([
      `--${this.sessionUUID}-bg-color`,
      `--${this.sessionUUID}-font-size`,
      `--${this.sessionUUID}-gap`,
      `--${this.sessionUUID}-font-family`,
      `--${this.sessionUUID}-padding`,
      `--${this.sessionUUID}-line-number-color`,
      `--${this.sessionUUID}-line-transition-time`,
      `--${this.sessionUUID}-line-hover-bg-color`,
      `--${this.sessionUUID}-vertical-divide-border`,
    ]);

    this.ThemeVariableAliasMap = {
      VirtualContainerBGColor: 'bg-color',
      StickyContainerFontSize: 'font-size',
      StickyContainerGap: 'gap',
      StickyContainerFontFamily: 'font-family',
      StickyContainerPadding: 'padding',
      LineNumberColor: 'line-number-color',
      CodeLineTransitionTime: 'line-transition-time',
      CodeLineHoverBGColor: 'line-hover-bg-color',
      VerticalDivideBorderColor: 'vertical-divide-border',
    };

    this.CSSVariables = {
      default: {
        [`--${this.sessionUUID}-bg-color`]: '#1e1e1e',
        [`--${this.sessionUUID}-font-size`]: '14px',
        [`--${this.sessionUUID}-gap`]: '2px',
        [`--${this.sessionUUID}-font-family`]:
          "'Consolas', 'Monaco', 'Courier New', monospace",
        [`--${this.sessionUUID}-padding`]: '8px 12px',
        [`--${this.sessionUUID}-line-number-color`]: '#858585',
        [`--${this.sessionUUID}-line-transition-time`]: '0.1s',
        [`--${this.sessionUUID}-line-hover-bg-color`]: '#2a2a2a',
        [`--${this.sessionUUID}-vertical-divide-border`]: '#3e3e3e',
      },
    };

    this.CSS_StylesRecord = {
      [`.${this.VirtulizationWrapperClassName}`]: {
        position: 'relative',
        width: '100%',
      },
      [`.${this.VirtulizationWrapperClassName} *`]: {
        margin: '0',
        padding: '0',
        'box-sizing': 'border-box',
      },

      [`.${this.StickyContainerClassName}`]: {
        position: 'sticky',
        top: '0',
        left: '0',
        'background-color': `var(--${this.sessionUUID}-bg-color)`,
        width: '100%',
        overflow: 'hidden',
        'font-size': `var(--${this.sessionUUID}-font-size)`,
        display: 'flex',
        'flex-direction': 'row',
        gap: `var(--${this.sessionUUID}-gap)`,
        'font-family': `var(--${this.sessionUUID}-font-family)`,
      },

      [`.${this.StickyContainerClassName} > div:nth-child(1), .${this.StickyContainerClassName} > div:nth-child(3)`]:
        {
          padding: `var(--${this.sessionUUID}-padding)`,
          display: 'flex',
          'flex-direction': 'column',
          gap: `var(--${this.sessionUUID}-gap)`,
          'align-self': 'stretch',
          'align-items': 'flex-start',
          'justify-content': 'flex-start',
        },

      [`.${this.NumberContainerClassName}`]: {
        'align-items': 'center',
        'min-width': '40px',
        'max-width': '60px',
        cursor: 'pointer',
        'text-align': 'right',
      },

      [`.${this.CodeContainerClassName}`]: {
        flex: '1',
        color: 'white',
      },

      [`.${this.NumberSpanClassName}`]: {
        color: `var(--${this.sessionUUID}-line-number-color)`,
        width: '100%',
        display: 'block',
        'min-width': '30px',
      },

      [`.${this.CodeLineClassName}`]: {
        width: '100%',
        cursor: 'text',
        transition: `all var(--${this.sessionUUID}-line-transition-time)`,
      },
      [`.${this.CodeLineClassName}:hover`]: {
        'background-color': `var(--${this.sessionUUID}-line-hover-bg-color)`,
      },
      // VerticalDivide
      [`.${this.VerticalDivideClassName}`]: {
        'align-self': 'stretch',
        'border-right': `1px solid var(--${this.sessionUUID}-vertical-divide-border)`,
      },
    };

    this.applyBaseVariables();
    this.applyTheme('default');
  }

  private applyBaseVariables() {
    const styles = document.createElement('style');
    styles.setAttribute('data-session-id', this.sessionUUID);
    styles.setAttribute('data-type', 'base-styles');

    let cssText = '';

    // Loop over CSS_StylesRecord and create CSS rules
    for (const [selector, properties] of Object.entries(
      this.CSS_StylesRecord
    )) {
      cssText += `${selector} {\n`;
      for (const [property, value] of Object.entries(properties)) {
        cssText += `  ${property}: ${value};\n`;
      }
      cssText += '}\n\n';
    }

    styles.textContent = cssText;
    document.querySelector('head')?.appendChild(styles);
  }

  createTheme(themeName: string, overrides: Record<string, string>): void {
    if (!themeName) {
      console.error('Theme name is required to create a theme');
      return;
    }

    const baseTheme = { ...this.CSSVariables.default };

    for (const [alias, value] of Object.entries(overrides)) {
      const baseKey = this.ThemeVariableAliasMap[alias];

      if (!baseKey) {
        console.warn(`Ignoring unknown theme variable alias: ${alias}`);
        continue;
      }

      const variableName = `--${this.sessionUUID}-${baseKey}`;

      if (!this.AllowedThemeVariables.has(variableName)) {
        console.warn(
          `Skipping disallowed theme variable assignment for alias: ${alias}`
        );
        continue;
      }

      baseTheme[variableName] = value;
    }

    this.CSSVariables[themeName] = baseTheme;
  }

  applyTheme(ThemeName: string) {
    if (!this.CSSVariables[ThemeName]) {
      console.error(
        'Invalid Theme name, no such theme name present, use createTheme to create such a theme'
      );
      return;
    }

    // Remove old theme if exists
    const oldTheme = document.querySelector(
      `style[data-session-id="${this.sessionUUID}"][data-type="theme"]`
    );
    if (oldTheme) {
      oldTheme.remove();
    }

    const styles = document.createElement('style');
    styles.setAttribute('data-session-id', this.sessionUUID);
    styles.setAttribute('data-type', 'theme');
    styles.setAttribute('data-theme-name', ThemeName);

    // Add CSS variables to :root
    let cssText = ':root {\n';
    const themeVariables = this.CSSVariables[ThemeName];
    for (const [varName, varValue] of Object.entries(themeVariables)) {
      cssText += `  ${varName}: ${varValue};\n`;
    }
    cssText += '}\n';

    styles.textContent = cssText;
    document.querySelector('head')?.appendChild(styles);
  }
}

export default ClassHandler;
