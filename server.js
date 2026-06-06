const express = require('express');
const Catalog = require('./Catalog');

const app = express();
const PORT = process.env.PORT || 3000;

// Мідлвар для автоматичного парсингу JSON у тілі запитів
app.use(express.json());

// Ініціалізація модуля каталогу
const catalog = new Catalog();

// Наповнення бази тестовими даними 
catalog.addResource({ title: 'Figma', category: 'Design', url: 'https://figma.com' });
catalog.addResource({ title: 'VS Code', category: 'Dev', url: 'https://code.visualstudio.com' });

// 1. Обов'язковий Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Основний API Endpoint: отримання всіх ресурсів або пошук за query (?q=...)
app.get('/api/resources', (req, res) => {
  try {
    const { q } = req.query;
    if (q !== undefined) {
      const results = catalog.search(q);
      return res.json(results);
    }
    return res.json(catalog.search(''));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET endpoint для отримання списку допустимих параметрів (категорій)
app.get('/api/resources/category', (req, res) => {
  res.status(200).json({
    allowedCategories: ['Design', 'Dev', 'Productivity']
  });
});

// Додатковий Endpoint: фільтрація за категорією
app.get('/api/resources/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const results = catalog.filterByCategory(category);
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Додатковий Endpoint: додавання нового ресурсу
app.post('/api/resources', (req, res) => {
  try {
    const resourceData = req.body;
    catalog.addResource(resourceData);
    res.status(201).json({ success: true, message: 'Resource added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Слухач порту
app.listen(PORT, () => {
  console.log(`Сервер успішно запущено на порту ${PORT}`);
});