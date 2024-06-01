export default class Section {
  constructor({ items, renderer }, classSelector) {
    this.items = items;
    this.renderer = renderer;
    this.container = document.querySelector(classSelector);
  }

  renderItems() {
    this.items.forEach((item) => {
      this.renderer(item);
    });
  }

  addItem(element) {
    this.container.prepend(element);
  }
}
