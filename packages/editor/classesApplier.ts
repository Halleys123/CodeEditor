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
  // Parent container classes
  private VirtulizationWrapperClasses: string; // Have a virtual height according to [total lines of code * line height]
  private StickyContainerClasses: string; // Have height according to the user provided parent
  // Main Content containers - Both should have same padding, gap and height
  private NumberContainerClasses: string; // For numbers
  private CodeContainerClasses: string; // For actual code
  // Classes of spans storing numbers
  private NumberSpanClasses: string;
  // Classes of div storing a line of code
  // # Actual code classes will be decided later on
  private CodeLineClasses: string;
  private CodeSpanClasses: string; // ! Will be thought later just for reference as different keywords, parameters etc may have differnt colors
  // Extra classes
  private VerticalDivideClasses: string;

  // Other properties
  private sessionUUID: string;

  // Style and theme Related properties
  private AllowedThemeVariables: Set<string>;
  private CSSVariables: Record<string, Record<string, string>>;
  private CSS_StylesRecord: Record<string, Record<string, string>>;

  // Elements in Code Structure, their Classes
  private VirtulizationWrapperClass: string;
  private StickyContainerClass: string;
  private NumberContainerClass: string;
  private CodeContainerClass: string;
  private NumberSpanClass: string;
  private CodeLineClass: string;
  private CodeSpanClass: string;
  private VerticalDivideClass: string;

  constructor(
    VirtulizationWrapperClass: string,
    StickyContainerClass: string,
    NumberContainerClass: string,
    CodeContainerClass: string,
    NumberSpanClass: string,
    CodeLineClass: string,
    CodeSpanClass: string,
    VerticalDivideClass: string
  ) {
    this.VirtulizationWrapperClass = VirtulizationWrapperClass;
    this.StickyContainerClass = StickyContainerClass;
    this.NumberContainerClass = NumberContainerClass;
    this.CodeContainerClass = CodeContainerClass;
    this.NumberSpanClass = NumberSpanClass;
    this.CodeLineClass = CodeLineClass;
    this.CodeSpanClass = CodeSpanClass;
    this.VerticalDivideClass = VerticalDivideClass;

    this.VirtulizationWrapperClasses = '';
    this.StickyContainerClasses = '';
    this.NumberContainerClasses = '';
    this.CodeContainerClasses = '';
    this.NumberSpanClasses = '';
    this.CodeLineClasses = '';
    this.CodeSpanClasses = '';
    this.VerticalDivideClasses = '';

    this.sessionUUID = crypto.randomUUID().toString();

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

    this.CSSVariables = {
      default: {
        [`--${this.sessionUUID}-bg-color`]: '#121212',
        [`--${this.sessionUUID}-font-size`]: '15px',
        [`--${this.sessionUUID}-gap`]: '0px',
        [`--${this.sessionUUID}-font-family`]: 'monospace',
        [`--${this.sessionUUID}-padding`]: '0px',
        [`--${this.sessionUUID}-line-number-color`]: '#f0f0f0',
        [`--${this.sessionUUID}-line-transition-time`]: '0.05s',
        [`--${this.sessionUUID}-line-hover-bg-color`]: '#212121',
        [`--${this.sessionUUID}-vertical-divide-border`]: '#545454',
      },
    };

    this.CSS_StylesRecord = {
      // VirtulizationWrapper
      [`.${this.VirtulizationWrapperClass}`]: {
        position: 'relative',
        width: '100%',
      },
      [`.${this.VirtulizationWrapperClass} *`]: {
        margin: '0',
        padding: '0',
        'box-sizing': 'border-box',
      },

      // StickyContainer
      [`.${this.StickyContainerClass}`]: {
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
      [`.${this.StickyContainerClass} > div`]: {
        padding: `var(--${this.sessionUUID}-padding)`,
        display: 'flex',
        'flex-direction': 'column',
        gap: `var(--${this.sessionUUID}-gap)`,
        'align-self': 'stretch',
        'align-items': 'flex-start',
        'justify-content': 'flex-start',
      },
      // NumberContainer
      [`.${this.NumberContainerClass}`]: {
        'align-items': 'center',
        'min-width': '40px',
        'max-width': '60px',
        'text-align': 'right',
      },

      // CodeContainer
      [`.${this.CodeContainerClass}`]: {
        flex: '1',
        color: 'white',
      },

      // NumberSpan (class selector for multiple elements)
      [`.${this.NumberSpanClass}`]: {
        color: `var(--${this.sessionUUID}-line-number-color)`,
        width: '100%',
        display: 'block',
      },

      // CodeLine (class selector for multiple elements)
      [`.${this.CodeLineClass}`]: {
        width: '100%',
        cursor: 'text',
        transition: `all var(--${this.sessionUUID}-line-transition-time)`,
      },
      [`.${this.CodeLineClass}:hover`]: {
        'background-color': `var(--${this.sessionUUID}-line-hover-bg-color)`,
      },
      // VerticalDivide
      [`.${this.VerticalDivideClass}`]: {
        'align-self': 'stretch',
        'border-right': `1px solid var(--${this.sessionUUID}-vertical-divide-border)`,
      },
    };

    this.applyBaseVariables();
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
