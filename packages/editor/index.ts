import ClassHandler from './classesApplier';
import { generateSecureToken } from './utils';

class Editor {
  // Properties
  lineHeight: number = 0;
  lineGap: number = 0;
  padY: number = 0;

  parentId: string;
  getCodeOn: 'onChange' | 'manual' | 'timed' = 'manual';
  code: string = '';
  totalLinesInView: number = 0;
  totalCodeLines: number = 80;

  // editor elements
  numberSpanElements: HTMLSpanElement[] = [];
  virtualization_container: HTMLDivElement | null;

  // Element Classes
  virtualizationWrapperClass: string;
  stickyContainerClass: string;
  numberContainerClass: string;
  codeContainerClass: string;
  numberSpanClass: string;
  codeLineClass: string;
  codeSpanClass: string;
  verticalDivideClass: string;

  private createClassName(): string {
    return generateSecureToken();
  }

  constructor(parentId: string, getCode: (code: string) => void) {
    this.parentId = parentId;
    this.virtualization_container = null;

    // Generate unique classes for all elements
    this.virtualizationWrapperClass = this.createClassName();
    this.stickyContainerClass = this.createClassName();
    this.numberContainerClass = this.createClassName();
    this.codeContainerClass = this.createClassName();
    this.numberSpanClass = this.createClassName();
    this.codeLineClass = this.createClassName();
    this.codeSpanClass = this.createClassName();
    this.verticalDivideClass = this.createClassName();
  }

  initialize() {
    this.virtualization_container = document.createElement('div');
    this.virtualization_container.classList.add(
      this.virtualizationWrapperClass
    );

    const sticky_content_wrapper = document.createElement('div');
    sticky_content_wrapper.classList.add(this.stickyContainerClass);

    const number_div = document.createElement('div');
    number_div.classList.add(this.numberContainerClass);

    const dummy_number_span = document.createElement('span');
    dummy_number_span.classList.add('dummy_number_span');
    dummy_number_span.classList.add(this.numberSpanClass);
    dummy_number_span.innerText += '1';

    const div_line = document.createElement('div');
    div_line.classList.add(this.verticalDivideClass);

    const code_div = document.createElement('div');
    code_div.classList.add(this.codeContainerClass);

    this.virtualization_container.insertAdjacentElement(
      'beforeend',
      sticky_content_wrapper
    );

    sticky_content_wrapper.insertAdjacentElement('beforeend', number_div);
    sticky_content_wrapper.insertAdjacentElement('beforeend', div_line);
    sticky_content_wrapper.insertAdjacentElement('beforeend', code_div);

    number_div.insertAdjacentElement('beforeend', dummy_number_span);

    const userProvidedParentElement = document.getElementById(this.parentId);
    if (!userProvidedParentElement) {
      console.error(
        `ID Provided has not associated html element: ${this.parentId}`
      );
      return;
    }

    userProvidedParentElement?.insertAdjacentElement(
      'beforeend',
      this.virtualization_container
    );

    userProvidedParentElement.style.overflow = 'auto';

    // ! Calculating height of each line later will be used for virtualization

    const spanStyles = getComputedStyle(dummy_number_span);
    const userProvidedParentElementStyle = getComputedStyle(
      userProvidedParentElement
    );
    const ContentDivStyles = getComputedStyle(code_div);

    const dummySpanHeightStr = spanStyles.height;

    const userProvidedParentHeightStr = userProvidedParentElementStyle.height;
    const ContentDivPaddingYStr = ContentDivStyles.paddingTop;
    const ContentDivGapStr = ContentDivStyles.gap;

    this.lineHeight = parseFloat(dummySpanHeightStr) || 1;

    const PrimaryDivHeight: number =
      parseFloat(userProvidedParentHeightStr) || 1;
    this.padY = parseFloat(ContentDivPaddingYStr) || 0;
    this.lineGap = parseFloat(ContentDivGapStr) || 0;

    sticky_content_wrapper.style.height = userProvidedParentElementStyle.height;

    this.totalLinesInView =
      (PrimaryDivHeight - 2 * this.padY) / (this.lineHeight + this.lineGap);

    this.updateVirtualHeight();

    number_div.removeChild(dummy_number_span);

    for (let i = 1; i <= Math.round(this.totalLinesInView); i += 1) {
      const code_line_div = document.createElement('div');
      const span = document.createElement('span');

      span.classList.add(this.numberSpanClass);
      span.style.height = dummySpanHeightStr;
      span.style.lineHeight = dummySpanHeightStr;

      code_line_div.classList.add(this.codeLineClass);
      code_line_div.style.height = dummySpanHeightStr;
      code_line_div.style.lineHeight = dummySpanHeightStr;
      code_line_div.innerHTML = `<span>height</span>`;

      code_div.insertAdjacentElement('beforeend', code_line_div);
      number_div.insertAdjacentElement('beforeend', span);

      this.numberSpanElements.push(span);
    }

    userProvidedParentElement.addEventListener('scroll', (e) => {
      const scrollTop = (e.target as HTMLElement).scrollTop;
      const lineHeight = this.lineHeight + this.lineGap;
      const maxStartIndex = Math.max(
        1,
        this.totalCodeLines - this.totalLinesInView + 1
      );
      const firstVisibleLine = Math.min(
        Math.floor(scrollTop / lineHeight) + 1,
        maxStartIndex
      );

      this.updateNumbers(firstVisibleLine);
    });
  }

  updateNumbers(startFrom: number) {
    let last: number = Math.min(
      this.totalCodeLines,
      Math.round(this.totalLinesInView)
    );

    for (let i = 0; i < last; i += 1) {
      this.numberSpanElements[i].textContent = (i + startFrom).toString();
    }
  }

  updateGetCodeOn(method: 'manual' | 'timed' | 'onChange') {
    this.getCodeOn = method;
  }

  updateVirtualHeight() {
    if (!this.virtualization_container) return;

    this.virtualization_container.style.height =
      (
        Math.max(this.totalCodeLines, this.totalLinesInView) *
          (this.lineHeight + this.lineGap) +
        this.padY * 2
      ).toString() + 'px';
  }
}

function initEditor(parentId: string) {
  const editor = new Editor(parentId, (code: string) => {});
  const classhandler = new ClassHandler(
    editor.virtualizationWrapperClass,
    editor.stickyContainerClass,
    editor.numberContainerClass,
    editor.codeContainerClass,
    editor.numberSpanClass,
    editor.codeLineClass,
    editor.codeSpanClass,
    editor.verticalDivideClass
  );

  classhandler.applyTheme('default');

  editor.initialize();
  editor.updateNumbers(1);
}

export { Editor };
export default initEditor;
