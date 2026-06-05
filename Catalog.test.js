const Catalog = require('./Catalog');

describe('Тести модуля Catalog (CraftTools)', () => {
  let catalog;

  beforeEach(() => {
    catalog = new Catalog();
  });

  // === МЕТОД: addResource ===

  test('addResource: позитивний EP', () => {
    const validResource = { title: 'Figma', category: 'Design', url: 'https://figma.com' };
    const result = catalog.addResource(validResource);
    expect(result).toBe(true);
    expect(catalog.resources.length).toBe(1);
  });

  test('addResource: границя BVA (1 символ)', () => {
    const resource = { title: 'F', category: 'Design', url: 'https://figma.com' };
    expect(() => catalog.addResource(resource)).toThrow("Title must be at least 2 characters long");
  });

  test('addResource: границя BVA (2 символи)', () => {
    const resource = { title: 'Go', category: 'Dev', url: 'https://go.dev' };
    const result = catalog.addResource(resource);
    expect(result).toBe(true);
  });

  test('addResource: негативний EP (невідома категорія)', () => {
    const resource = { title: 'Steam', category: 'Gaming', url: 'https://steam.com' };
    expect(() => catalog.addResource(resource)).toThrow("Invalid category");
  });

  test('addResource: негативний EP (хибний URL)', () => {
    const resource = { title: 'Notion', category: 'Productivity', url: 'not-a-url' };
    expect(() => catalog.addResource(resource)).toThrow("Invalid URL format");
  });

  // === МЕТОД: search ===

  test('search: позитивний EP (частковий збіг, будь-який регістр)', () => {
    catalog.addResource({ title: 'VS Code', category: 'Dev', url: 'https://code.visualstudio.com' });
    const res = catalog.search('  vS  ');
    expect(res.length).toBe(1);
    expect(res[0].title).toBe('VS Code');
  });

  test('search: позитивний EP (порожній запит повертає все)', () => {
    catalog.addResource({ title: 'Figma', category: 'Design', url: 'https://figma.com' });
    const res = catalog.search('   ');
    expect(res.length).toBe(1);
  });

  test('search: негативний EP (тип даних не рядок)', () => {
    expect(() => catalog.search(123)).toThrow("Query must be a string");
  });

  // === МЕТОД: filterByCategory ===

  test('filterByCategory: позитивний EP', () => {
    catalog.addResource({ title: 'VS Code', category: 'Dev', url: 'https://code.visualstudio.com' });
    const res = catalog.filterByCategory('Dev');
    expect(res.length).toBe(1);
  });

  test('filterByCategory: негативний EP(null)', () => {
    expect(() => catalog.filterByCategory(null)).toThrow("Category must be a non-empty string");
  });

  test('filterByCategory: негативний EP (неправильний регістр)', () => {
    expect(() => catalog.filterByCategory('dev')).toThrow("Requested category does not exist");
  });
});