// adminController.test.js
const { createProduct } = require('../controllers/adminController');
const Product = require('../models/product');

// Mock para verificar el middleware adminOnly
jest.mock('../middlewares/authMiddleware', () => ({
    adminOnly: (req, res, next) => next(),
}));

describe('Admin Controller', () => {
    test('should create a new product', async () => {
        // Arrange
        const mockProductData = {
            name: 'Test Product',
            category: 'Test Category',
            store: 'Test Store',
            price: 9.99,
            active: true,
            quantity: 100,
        };

        const mockProduct = {
            id: 1,
            ...mockProductData,
            createdAt: '2023-07-15T12:00:00Z',
            updatedAt: '2023-07-15T12:00:00Z',
        };

        // Mock de la función "create" del modelo Product
        Product.create = jest.fn().mockResolvedValue(mockProduct);

        // Mock del objeto req y res
        const req = {
            body: mockProductData,
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // Act
        await createProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockProduct);
        expect(Product.create).toHaveBeenCalledWith(mockProductData);
    });

    test('should return 500 if an error occurs during product creation', async () => {
        // Arrange
        const mockProductData = {
            name: 'Test Product',
            // Omitir otras propiedades para provocar un error en la creación
        };

        // Mock de la función "create" del modelo Product para simular un error
        Product.create = jest.fn().mockRejectedValue(new Error('Database error'));

        // Mock del objeto req y res
        const req = {
            body: mockProductData,
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // Act
        await createProduct(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
        expect(Product.create).toHaveBeenCalledWith(mockProductData);
    });
});