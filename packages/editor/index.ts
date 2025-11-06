function setClasses() {
  let styles = document.querySelector('style');
  if (!styles) {
    styles = document.createElement('style');
  }

  // Fixed classes
  const div_line = `.vertical-division-line {align-self: stretch; border-right: 1px solid #aaafff}`;

  // Dynamic Classes
  const virtualization_wrapper = `.virtualization_wrapper { position: relative; width: 100%;}`;
  const sticky_content_wrapper = `.sticky_content_wrapper { position: sticky; top: 0;left: 0; background-color: #121212; width: 100%; height: 100%; overflow: hidden; font-size: 16px; display: flex; flex-direction: row; gap: 0; font-family: monospace;} .sticky_content_wrapper > div { padding: 8px 4px; display: flex; flex-direction: column; gap: 4px; align-self: stretch; align-items: flex-start; justify-content: flex-start;  }`;

  const numberContainerClass = `.number-container-container { align-items: center; justify-content: space-between; min-width: 40px; max-width: 60px; text-align: right; }`;
  const number_span = '.number_span { color: #88bbff; width: 100%; }';
  const dummy_number_span = `.dummy_number_span {opacity: 0; position: absolute; top: 0; left: 0;}`;

  const editorContainerClass = `.editor-container-class { flex: 1; font-size: 14px }`;
  const code_line = `.code-line { width: 100%; flex: 1;cursor: text; transition: all 0.05s;} .code-line:hover {background-color: #151515}`;

  styles.innerHTML += virtualization_wrapper;

  styles.innerHTML += sticky_content_wrapper;

  styles.innerHTML += numberContainerClass;
  styles.innerHTML += number_span;
  styles.innerHTML += dummy_number_span;

  styles.innerHTML += div_line;

  styles.innerHTML += editorContainerClass;
  styles.innerHTML += code_line;

  document.querySelector('head')?.insertAdjacentElement('beforeend', styles);
}

class Editor {
  // Properties
  lineHeight: number = 0;
  lineGap: number = 0;
  padY: number = 0;

  parentId: string;
  initialized: boolean = false;
  getCodeOn: 'onChange' | 'manual' | 'timed' = 'manual';
  code: string = '';
  totalLinesInView: number = 0;
  totalCodeLines: number = 80;

  // editor elements
  numberSpanElements: HTMLSpanElement[] = [];
  virtualization_container: HTMLDivElement | null;

  constructor(parentId: string, getCode: (code: string) => void) {
    this.parentId = parentId;
    this.virtualization_container = null;
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;

    setClasses();

    this.virtualization_container = document.createElement('div');
    this.virtualization_container.classList.add('virtualization_wrapper');

    const sticky_content_wrapper = document.createElement('div');
    sticky_content_wrapper.classList.add('sticky_content_wrapper');

    const number_div = document.createElement('div');
    number_div.classList.add('number-container-container');

    const dummy_number_span = document.createElement('span');
    dummy_number_span.innerText += '1';
    dummy_number_span.classList.add('number_span', 'dummy_number_span');

    const div_line = document.createElement('div');
    div_line.classList.add('vertical-division-line');

    const code_div = document.createElement('div');
    code_div.classList.add('editor-container-class');

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

      span.classList.add('number_span');
      span.style.height = dummySpanHeightStr;

      code_line_div.classList.add('code-line');
      code_line_div.style.height = dummySpanHeightStr;

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
  editor.initialize();
  editor.updateNumbers(1);
}

export { Editor };
export default initEditor;
