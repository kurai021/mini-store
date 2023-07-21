const { createProduct } = require('../controllers/adminController');
const Product = require('../models/product');

// Mock para simular el comportamiento de adminOnly
jest.mock('../middlewares/authMiddleware', () => {
    return {
        adminOnly: (req, res, next) => {
            req.user = { userId: 1, role: 'admin' }; // Simulamos que el usuario es un administrador
            next();
        },
    };
});

describe('Admin Controller', () => {
    describe('createProduct', () => {
        test('should create a new product', async () => {
            const req = {
                body: {
                    name: 'Test Product',
                    category: 'Test Category',
                    store: 'Test Store',
                    price: 9.99,
                    active: true,
                    quantity: 100,
                },
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await createProduct(req, res);

            // Verificar si la función Product.create fue llamada con los datos correctos
            expect(Product.create).toHaveBeenCalledWith({
                name: 'Test Product',
                category: 'Test Category',
                store: 'Test Store',
                price: 9.99,
                active: true,
                quantity: 100,
            });

            // Verificar si la función res.json fue llamada con el producto creado
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });

        test('should handle errors', async () => {
            const req = {
                body: {
                    // Datos incompletos o incorrectos para provocar un error
                    name: null, // El nombre no puede ser nulo
                    category: 'Test Category',
                    store: 'Test Store',
                    price: 'invalid', // El precio debe ser un número
                    active: true,
                    quantity: 100,
                },
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await createProduct(req, res);

            // Verificar si la función res.status fue llamada con el código de error 500
            expect(res.status).toHaveBeenCalledWith(500);

            // Verificar si la función res.json fue llamada con el mensaje de error
            expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
        });
    });
});
