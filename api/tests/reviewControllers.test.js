const { postReviewController } = require('../src/controllers/reviewControllers/postReviewController');

// Mocking the database models and sequelize
jest.mock('../src/db', () => {
  const mSequelize = {
    transaction: jest.fn(callback => callback('mock-transaction')),
    fn: jest.fn(),
    col: jest.fn(),
  };
  return {
    Review: {
      create: jest.fn(),
      findOne: jest.fn(),
    },
    Food: {
      findByPk: jest.fn(),
      update: jest.fn(),
    },
    User: {
      findByPk: jest.fn(),
    },
    Item: {
      findByPk: jest.fn(),
      update: jest.fn(),
    },
    sequelize: mSequelize,
  };
});

const { Review, Food, User, Item, sequelize } = require('../src/db');

describe('Review Controllers Unit Tests', () => {
  describe('postReviewController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if required IDs are missing', async () => {
      await expect(postReviewController()).rejects.toThrow('Missing required IDs');
    });

    it('should throw error if rating is out of bounds', async () => {
      await expect(postReviewController('f1', 'u1', 'good', 6, 'i1')).rejects.toThrow('Rating must be between 1 and 5');
    });

    it('should successfully create a review and update food score', async () => {
      // Setup mocks
      Food.findByPk.mockResolvedValue({ id: 'f1' });
      User.findByPk.mockResolvedValue({ id: 'u1' });
      Item.findByPk.mockResolvedValue({ id: 'i1' });
      
      Review.create.mockResolvedValue({ id: 'r1' });
      Item.update.mockResolvedValue([1]);
      
      const mockAverage = { get: () => 4.5 };
      Review.findOne.mockResolvedValue(mockAverage);
      Food.update.mockResolvedValue([1]);

      const result = await postReviewController('f1', 'u1', 'Excelente!', 5, 'i1');

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(Review.create).toHaveBeenCalled();
      expect(Food.update).toHaveBeenCalledWith(
        { total_score: "4.50" },
        expect.any(Object)
      );
      expect(result.id).toBe('r1');
    });
  });
});
