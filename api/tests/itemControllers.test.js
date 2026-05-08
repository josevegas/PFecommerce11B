const { postItemController } = require('../src/controllers/itemControllers/postItemController');

// Mocking updateCartTotalPrice
jest.mock('../src/controllers/itemControllers/updateCartTotalPrice', () => ({
  updateCartTotalPrice: jest.fn().mockResolvedValue(true),
}));

// Mocking the database models
jest.mock('../src/db', () => {
  const mSequelize = {
    transaction: jest.fn(callback => {
      if (typeof callback === 'function') return callback('mock-transaction');
      return { commit: jest.fn(), rollback: jest.fn() };
    }),
  };
  return {
    Item: {
      create: jest.fn(),
    },
    sequelize: mSequelize,
  };
});

const { Item, sequelize } = require('../src/db');
const { updateCartTotalPrice } = require('../src/controllers/itemControllers/updateCartTotalPrice');

describe('Item Controllers Unit Tests', () => {
  describe('postItemController', () => {
    it('should create an item and update cart total within a transaction', async () => {
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      sequelize.transaction.mockResolvedValue(mockTransaction);
      Item.create.mockResolvedValue({ id: 'item-1' });

      const result = await postItemController('food-1', 'order-1', 10, 2, 20);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(Item.create).toHaveBeenCalledWith(
        expect.objectContaining({ FoodId: 'food-1' }),
        { transaction: mockTransaction }
      );
      expect(updateCartTotalPrice).toHaveBeenCalledWith('order-1', mockTransaction);
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result.id).toBe('item-1');
    });

    it('should rollback transaction if item creation fails', async () => {
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      sequelize.transaction.mockResolvedValue(mockTransaction);
      Item.create.mockRejectedValue(new Error('Creation failed'));

      await expect(postItemController('food-1', 'order-1', 10, 2, 20))
        .rejects.toThrow('Creation failed');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
