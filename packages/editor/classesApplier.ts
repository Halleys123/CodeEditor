// Allowed properties user can change are: (thought for now)
// 1. VirtulizationWrapperClasses: // ? NONE
// 2. StickyContainerClasses: // * background-color, font-size, gap, font-family
// 3. NumberContainerClasses: // ? NONE
// 4. CodeContainerClasses: // ? NONE
// 5. NumberSpanClasses: // * color
// 6. DummyNumberSpanClasses: // ? NONE
// 7. CodeLineClasses: // * hover:background-color
// 8. CodeSpanClasses: // # TBD
// 9. VerticalDivideClasses: // * border-right;

// Generates classes based on description by the user and allows to modify some of them and then apply them
class ClassHandler {
  // Parent container classes
  VirtulizationWrapperClasses: string; // Have a virtual height according to [total lines of code * line height]
  StickyContainerClasses: string; // Have height according to the user provided parent
  // Main Content containers - Both should have same padding, gap and height
  NumberContainerClasses: string; // For numbers
  CodeContainerClasses: string; // For actual code
  // Classes of spans storing numbers
  NumberSpanClasses: string;
  DummyNumberSpanClasses: string; // User can't modify this
  // Classes of div storing a line of code
  // ? Actual code classes will be decided later on
  CodeLineClasses: string;
  CodeSpanClasses: string; // ! Will be thought later just for reference as different keywords, parameters etc may have differnt colors
  // Extra classes
  VerticalDivideClasses: string;

  // Other properties
  styles: HTMLStyleElement;
  constructor() {
    this.VirtulizationWrapperClasses = '';
    this.StickyContainerClasses = '';
    this.NumberContainerClasses = '';
    this.CodeContainerClasses = '';
    this.NumberSpanClasses = '';
    this.DummyNumberSpanClasses = '';
    this.CodeLineClasses = '';
    this.CodeSpanClasses = '';
    this.VerticalDivideClasses = '';

    let tempStyles = document.querySelector('style');
    if (tempStyles) {
      this.styles = tempStyles;
    } else {
      this.styles = document.createElement('style');
    }
  }
}
