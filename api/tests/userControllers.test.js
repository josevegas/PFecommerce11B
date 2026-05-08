const { postUserController } = require('../src/controllers/userControllers/postUserController');

// Mocking nodemailer/SendEmailWelcome
jest.mock('../src/nodemailer/SendEmailWelcome/sendEmail.js', () => jest.fn().mockResolvedValue(true));

// Mocking the database models
jest.mock('../src/db', () => ({
  User: {
    findOrCreate: jest.fn(),
  },
}));

const { User } = require('../src/db');
const sendEmailWelcome = require('../src/nodemailer/SendEmailWelcome/sendEmail.js');

describe('User Controllers Unit Tests', () => {
  beforeAll(() => {
    process.env.ADMIN_EMAILS = 'admin@test.com,boss@test.com';
  });

  describe('postUserController', () => {
    it('should assign Admin role if email is in ADMIN_EMAILS', async () => {
      const mockUser = { update: jest.fn() };
      User.findOrCreate.mockResolvedValue([mockUser, true]);

      await postUserController('Admin User', 'admin@test.com', 'Client', true, '123 St');

      expect(User.findOrCreate).toHaveBeenCalledWith(expect.objectContaining({
        defaults: expect.objectContaining({ type: 'Admin' })
      }));
    });

    it('should send welcome email for new client users', async () => {
      const mockUser = { update: jest.fn() };
      User.findOrCreate.mockResolvedValue([mockUser, true]);

      await postUserController('New Client', 'client@test.com', 'Client', true, '123 St');

      expect(sendEmailWelcome).toHaveBeenCalledWith('client@test.com');
    });

    it('should not send welcome email if user already exists', async () => {
      const mockUser = { update: jest.fn() };
      User.findOrCreate.mockResolvedValue([mockUser, false]);
      jest.clearAllMocks();

      await postUserController('Old Client', 'client@test.com', 'Client', true, '123 St');

      expect(sendEmailWelcome).not.toHaveBeenCalled();
    });
  });
});
