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

    const userProvidedElement = document.getElementById(this.parentId);
    if (!userProvidedElement) {
      console.error(
        `ID Provided has not associated html element: ${this.parentId}`
      );
      return;
    }

    userProvidedElement?.insertAdjacentElement(
      'beforeend',
      this.virtualization_container
    );

    userProvidedElement.style.overflow = 'auto';

    // * One time claculations no need to reinitialize the program.
    const dummySpanHeightStr = getComputedStyle(dummy_number_span).height;
    this.lineHeight = parseFloat(dummySpanHeightStr) || 1;
    number_div.removeChild(dummy_number_span);

    const CodeContainerStyles = getComputedStyle(code_div);
    const CodeContainerPaddingYStr = CodeContainerStyles.paddingTop;
    const CodeContainerGapStr = CodeContainerStyles.gap;

    this.padY = parseFloat(CodeContainerPaddingYStr) || 0;
    this.lineGap = parseFloat(CodeContainerGapStr) || 0;

    this.virtualize(
      userProvidedElement,
      this.virtualization_container as HTMLDivElement,
      sticky_content_wrapper,
      code_div,
      number_div,
      1
    );

    userProvidedElement.addEventListener('scroll', (e: Event) => {
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

    window.addEventListener('resize', () => {
      const scrollTop = userProvidedElement.scrollTop;
      const previousLineHeight = this.lineHeight + this.lineGap;
      const desiredStartLine = Math.floor(scrollTop / previousLineHeight) + 1;

      this.virtualize(
        userProvidedElement,
        this.virtualization_container as HTMLDivElement,
        sticky_content_wrapper,
        code_div,
        number_div,
        desiredStartLine
      );

      const safeStart = Math.min(
        Math.max(1, desiredStartLine),
        Math.max(1, this.totalCodeLines - this.totalLinesInView + 1)
      );
      const lineOffset = Math.max(0, safeStart - 1);
      const newLineHeight = this.lineHeight + this.lineGap;
      userProvidedElement.scrollTop = lineOffset * newLineHeight;
    });
  }

  private virtualize(
    userProvidedElement: HTMLElement,
    VirtualizationWrapper: HTMLDivElement,
    StickyContainer: HTMLDivElement,
    CodeContainer: HTMLDivElement,
    NumberContainer: HTMLDivElement,
    startLine: number = 1
  ) {
    const userProvidedElementStyle = getComputedStyle(userProvidedElement);
    const userProvidedElementHeightStr = userProvidedElementStyle.height;

    const userProvideElementHeight: number =
      parseFloat(userProvidedElementHeightStr) || 1;

    StickyContainer.style.height = userProvidedElementStyle.height;

    const computedLinesInView =
      (userProvideElementHeight - 2 * this.padY) /
      (this.lineHeight + this.lineGap);

    this.totalLinesInView = Math.max(1, Math.floor(computedLinesInView));

    this.adjustLineElements(
      CodeContainer,
      NumberContainer,
      this.totalLinesInView
    );

    VirtualizationWrapper.style.height =
      (
        Math.max(this.totalCodeLines, this.totalLinesInView) *
          (this.lineHeight + this.lineGap) +
        this.padY * 2
      ).toString() + 'px';

    this.updateNumbers(startLine);
  }

  private adjustLineElements(
    CodeContainer: HTMLDivElement,
    NumberContainer: HTMLDivElement,
    desiredCount: number
  ) {
    const currentCount = this.numberSpanElements.length;
    const newLineHeight = `${this.lineHeight}px`;

    if (currentCount > desiredCount) {
      for (let i = currentCount - 1; i >= desiredCount; i -= 1) {
        const span = this.numberSpanElements.pop();
        if (span && span.parentElement === NumberContainer) {
          NumberContainer.removeChild(span);
        }

        const lastCodeLine = CodeContainer.lastElementChild;
        if (lastCodeLine) {
          CodeContainer.removeChild(lastCodeLine);
        }
      }
    }

    if (this.numberSpanElements.length < desiredCount) {
      for (let i = this.numberSpanElements.length; i < desiredCount; i += 1) {
        const code_line_div = document.createElement('div');
        code_line_div.classList.add(this.codeLineClass);
        code_line_div.innerHTML = `<span>height</span>`;

        const span = document.createElement('span');
        span.classList.add(this.numberSpanClass);

        CodeContainer.insertAdjacentElement('beforeend', code_line_div);
        NumberContainer.insertAdjacentElement('beforeend', span);

        this.numberSpanElements.push(span);
      }
    }

    this.numberSpanElements.forEach((span) => {
      span.style.height = newLineHeight;
      span.style.lineHeight = newLineHeight;
    });

    Array.from(CodeContainer.children).forEach((child) => {
      const element = child as HTMLElement;
      element.style.height = newLineHeight;
      element.style.lineHeight = newLineHeight;
    });
  }

  updateNumbers(startFrom: number) {
    const visibleCount: number = Math.min(
      this.totalCodeLines,
      Math.round(this.totalLinesInView)
    );

    if (visibleCount === 0) {
      return;
    }

    const maxStartIndex = Math.max(1, this.totalCodeLines - visibleCount + 1);
    const safeStart = Math.min(Math.max(1, startFrom), maxStartIndex);

    for (let i = 0; i < visibleCount; i += 1) {
      this.numberSpanElements[i].textContent = (i + safeStart).toString();
    }
  }

  updateGetCodeOn(method: 'manual' | 'timed' | 'onChange') {
    this.getCodeOn = method;
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
    editor.codeSpanClass
  );

  editor.initialize();
  editor.updateNumbers(1);
}

export { Editor };
export default initEditor;
