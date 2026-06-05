class Catalog {
  constructor() {
    this.resources = [];
    this.allowedCategories = ['Design', 'Dev', 'Productivity'];
  }

  // Додавання ресурсу з нетривіальною валідацією
  addResource(resource) {
    if (!resource || typeof resource !== 'object') {
      throw new Error("Invalid resource object");
    }
    if (!resource.title || resource.title.trim().length < 2) {
      throw new Error("Title must be at least 2 characters long");
    }
    if (!this.allowedCategories.includes(resource.category)) {
      throw new Error(`Invalid category. Allowed: ${this.allowedCategories.join(', ')}`);
    }
    // Проста перевірка URL на наявність http/https
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    if (!resource.url || !urlPattern.test(resource.url)) {
      throw new Error("Invalid URL format");
    }

    this.resources.push({
      ...resource,
      title: resource.title.trim(),
      isApproved: false
    });
    return true;
  }

  // Пошук за назвою 
  search(query) {
    if (typeof query !== 'string') {
      throw new Error("Query must be a string");
    }
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) {
      return this.resources; // Якщо пустий запит — повертаємо все
    }
    return this.resources.filter(r => r.title.toLowerCase().includes(cleanQuery));
  }

  // Фільтрація за категорією
  filterByCategory(category) {
    if (!category || typeof category !== 'string') {
      throw new Error("Category must be a non-empty string");
    }
    if (!this.allowedCategories.includes(category)) {
      throw new Error("Requested category does not exist");
    }
    return this.resources.filter(r => r.category === category);
  }
}

module.exports = Catalog;