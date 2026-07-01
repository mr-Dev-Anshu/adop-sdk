class SelectorGenerator {
  generate(element) {
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      text: element.textContent.trim(),
      testId: element.getAttribute("data-testid"),  
      ariaLabel: element.getAttribute("aria-label"),
    };
  }
}

export default SelectorGenerator;
