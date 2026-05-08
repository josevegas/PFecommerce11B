const { postFavoriteController } = require('../src/controllers/favoriteControllers/postFavoriteController');

// Mocking the database models
jest.mock('../src/db', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

const { User } = require('../src/db');

describe('Favorite Controllers Unit Tests', () => {
  describe('postFavoriteController', () => {
    it('should add food to user favorites', async () => {
      const mockUser = { 
        id: 'user-1', 
        addFood: jest.fn().mockResolvedValue(true) 
      };
      User.findOne.mockResolvedValue(mockUser);

      const result = await postFavoriteController('test@test.com', 'food-123');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(mockUser.addFood).toHaveBeenCalledWith('food-123');
      expect(result.message).toBe('Favorito agregado con éxito.');
    });

    it('should throw error if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(postFavoriteController('bad@test.com', 'food-1'))
        .rejects.toThrow('Usuario no encontrado');
    });
  });
});
