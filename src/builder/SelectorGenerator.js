class SelectorGenerator {
  generate(element) {
    if (!element || element.nodeType !== 1) {
      return {};
    }

    const cssSelector = this.getUniqueSelector(element);

    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      text: element.textContent.trim(),
      testId: element.getAttribute("data-testid"),  
      ariaLabel: element.getAttribute("aria-label"),
      selector: cssSelector
    };
  }

  getUniqueSelector(element) {
    if (!element || element.nodeType !== 1) {
      return "";
    }

    // 1. Check for data-testid
    const testId = element.getAttribute("data-testid");
    if (testId) {
      return `[data-testid="${testId}"]`;
    }

    // 2. Check for unique ID
    if (element.id) {
      return `#${element.id}`;
    }

    // 3. Traverse upwards
    const path = [];
    let current = element;

    while (current && current.nodeType === 1) {
      const tagName = current.tagName.toLowerCase();

      if (current.id) {
        path.unshift(`#${current.id}`);
        break;
      }

      const currentTestId = current.getAttribute("data-testid");
      if (currentTestId) {
        path.unshift(`[data-testid="${currentTestId}"]`);
        break;
      }

      if (current === document.body) {
        path.unshift("body");
        break;
      }

      // Find index of current among siblings with the same tag name
      let index = 1;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }

      let siblingCount = 0;
      let nextSibling = current.nextElementSibling;
      while (nextSibling) {
        if (nextSibling.tagName === current.tagName) {
          siblingCount++;
        }
        nextSibling = nextSibling.nextElementSibling;
      }

      const hasSiblings = index > 1 || siblingCount > 0;
      const selector = hasSiblings ? `${tagName}:nth-of-type(${index})` : tagName;

      path.unshift(selector);
      current = current.parentNode;
    }

    return path.join(" > ");
  }
}

export default SelectorGenerator;
