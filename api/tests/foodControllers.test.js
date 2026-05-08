const { postFoodController } = require('../src/controllers/foodControllers/postFoodController');
const { putFoodController } = require('../src/controllers/foodControllers/putFoodController');

// Mocking Cloudinary
jest.mock('../src/utils/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn((options, callback) => ({
      end: jest.fn(() => callback(null, { secure_url: 'http://mock-url.com/image.jpg' })),
    })),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
  },
}));

// Mocking the database models
jest.mock('../src/db', () => ({
  Food: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
}));

const { Food } = require('../src/db');

describe('Food Controllers Unit Tests', () => {
  describe('postFoodController', () => {
    it('should create a food item and upload image to cloudinary', async () => {
      const mockFood = { id: 'food-1', name: 'Pizza', dataValues: { id: 'food-1', name: 'Pizza' } };
      Food.create.mockResolvedValue(mockFood);

      const result = await postFoodController(
        'Pizza', 
        Buffer.from('fake-image'), 
        'Delicious', 
        'Pastas', 
        100, 10, 90, 5, ['Vegana']
      );

      expect(Food.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Pizza',
        image: 'http://mock-url.com/image.jpg'
      }));
      expect(result.id).toBe('food-1');
    });
  });

  describe('putFoodController', () => {
    it('should update food item and handle image replacement', async () => {
      const mockFood = { 
        id: 'food-1', 
        image: 'http://cloudinary.com/old.jpg',
        update: jest.fn().mockResolvedValue(true)
      };
      Food.findByPk.mockResolvedValue(mockFood);

      await putFoodController('food-1', { name: 'New Name', image: Buffer.from('new-image') });

      expect(Food.findByPk).toHaveBeenCalledWith('food-1');
      expect(mockFood.update).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Name',
        image: 'http://mock-url.com/image.jpg'
      }));
    });
  });
});
