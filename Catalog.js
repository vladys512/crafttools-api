const ALLOWED_CATEGORIES = ['Design', 'Dev', 'Productivity'];

class Catalog {
  constructor() {
    this.resources = [];
  }

  // Допоміжний метод для перевірки рядків 
  _checkIsString(value, errorMessage) {
    if (typeof value !== 'string') {
      throw new Error(errorMessage);
    }
  }

  // Метод валідації 
  _validateResource(resource) {
    if (!resource || typeof resource !== 'object') {
      throw new Error("Invalid resource object");
    }
    if (!resource.title || resource.title.trim().length < 2) {
      throw new Error("Title must be at least 2 characters long");
    }
    if (!ALLOWED_CATEGORIES.includes(resource.category)) {
      throw new Error(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    if (!resource.url || !urlPattern.test(resource.url)) {
      throw new Error("Invalid URL format");
    }
  }

  addResource(resource) {
    this._validateResource(resource); // Виклик перевірки
    
    this.resources.push({
      ...resource,
      title: resource.title.trim(),
      isApproved: false
    });
    return true;
  }

  search(query) {
    this._checkIsString(query, "Query must be a string");
    
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) {
      return this.resources; 
    }
    return this.resources.filter(r => r.title.toLowerCase().includes(cleanQuery));
  }

  filterByCategory(category) {
    this._checkIsString(category, "Category must be a non-empty string");
    
    if (category.trim().length === 0) {
      throw new Error("Category must be a non-empty string");
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      throw new Error("Requested category does not exist");
    }
    return this.resources.filter(r => r.category === category);
  }
}

module.exports = Catalog;