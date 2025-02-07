import 'dotenv/config';

// Any setup code needed before running tests
jest.setTimeout(30000); // Increase timeout if needed

export default async () => {
  console.log('✅ E2E Tests Setup Completed');
};
