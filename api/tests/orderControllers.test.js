const { postOrderController } = require('../src/controllers/orderControllers/postOrderController');
const { putOrderController } = require('../src/controllers/orderControllers/putOrderController');

// Mocking the database models
jest.mock('../src/db', () => ({
  User: {
    findOne: jest.fn(),
  },
  Order: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  Item: {},
  Food: {},
}));

const { User, Order } = require('../src/db');

describe('Order Controllers Unit Tests', () => {
  
  describe('postOrderController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if email is missing', async () => {
      await expect(postOrderController()).rejects.toThrow('Email is required to create/fetch an order');
    });

    it('should throw an error if user is not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(postOrderController('test@test.com')).rejects.toThrow('User with email test@test.com not found');
    });

    it('should return existing pending order if found', async () => {
      const mockUser = { id: 'user-123', email: 'test@test.com' };
      const mockOrder = { id: 'order-456', status: 'PENDIENTE', Items: [] };
      
      User.findOne.mockResolvedValue(mockUser);
      Order.findOne.mockResolvedValue(mockOrder);

      const result = await postOrderController('test@test.com');
      
      expect(Order.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { UserId: 'user-123', status: 'PENDIENTE' }
      }));
      expect(result).toEqual(mockOrder);
    });

    it('should create a new order if no pending order exists', async () => {
      const mockUser = { id: 'user-123' };
      const mockNewOrder = { id: 'order-789', status: 'PENDIENTE' };
      
      User.findOne.mockResolvedValue(mockUser);
      Order.findOne.mockResolvedValue(null);
      Order.create.mockResolvedValue(mockNewOrder);
      Order.findByPk.mockResolvedValue({ ...mockNewOrder, Items: [] });

      const result = await postOrderController('test@test.com');
      
      expect(Order.create).toHaveBeenCalledWith({ UserId: 'user-123', status: 'PENDIENTE' });
      expect(result.id).toBe('order-789');
    });
  });

  describe('putOrderController', () => {
    it('should throw an error if orderId is missing', async () => {
      await expect(putOrderController({})).rejects.toThrow('orderId is required for update');
    });

    it('should update order fields correctly', async () => {
      const mockOrder = { 
        id: 'order-123', 
        update: jest.fn().mockResolvedValue(true) 
      };
      Order.findByPk.mockResolvedValue(mockOrder);

      const result = await putOrderController({ 
        orderId: 'order-123', 
        order_status: 'En preparación' 
      });

      expect(mockOrder.update).toHaveBeenCalledWith({ order_status: 'En preparación' });
      expect(result).toBe('Order updated successfully');
    });

    it('should throw error if order not found', async () => {
      Order.findByPk.mockResolvedValue(null);
      await expect(putOrderController({ orderId: 'invalid' })).rejects.toThrow('Order with ID invalid not found');
    });
  });
});
