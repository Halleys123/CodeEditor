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
  private stylesHTMLElement: HTMLStyleElement;
  private AllowedThemeVariables: Set<string>;
  private CSSVariables: Record<string, Record<string, string>>;
  private CSS_StylesRecord: Record<string, Record<string, string>>;

  // Elements in Code Structure, their IDs
  private VirtulizationWrapperID: string;
  private StickyContainerID: string;
  private NumberContainerID: string;
  private CodeContainerID: string;
  private NumberSpanID: string;
  private CodeLineID: string;
  private CodeSpanID: string;
  private VerticalDivideID: string;

  constructor(
    VirtulizationWrapperID: string,
    StickyContainerID: string,
    NumberContainerID: string,
    CodeContainerID: string,
    NumberSpanID: string,
    CodeLineID: string,
    CodeSpanID: string,
    VerticalDivideID: string
  ) {
    this.VirtulizationWrapperID = VirtulizationWrapperID;
    this.StickyContainerID = StickyContainerID;
    this.NumberContainerID = NumberContainerID;
    this.CodeContainerID = CodeContainerID;
    this.NumberSpanID = NumberSpanID;
    this.CodeLineID = CodeLineID;
    this.CodeSpanID = CodeSpanID;
    this.VerticalDivideID = VerticalDivideID;

    this.VirtulizationWrapperClasses = '';
    this.StickyContainerClasses = '';
    this.NumberContainerClasses = '';
    this.CodeContainerClasses = '';
    this.NumberSpanClasses = '';
    this.CodeLineClasses = '';
    this.CodeSpanClasses = '';
    this.VerticalDivideClasses = '';

    this.sessionUUID = new Date().toString();

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

    let tempStyles = document.querySelector('style');

    if (tempStyles) {
      this.stylesHTMLElement = tempStyles;
    } else {
      this.stylesHTMLElement = document.createElement('style');
    }

    this.CSS_StylesRecord = {
      [this.VirtulizationWrapperID]: {
        position: 'relative',
      },
    };
  }

  applyTheme(ThemeName: string) {
    if (!this.CSSVariables[ThemeName]) {
      console.error(
        'Invalid Theme name, no such theme name present, use createTheme to create such a theme'
      );
      return;
    }
  }
}

export default ClassHandler;
