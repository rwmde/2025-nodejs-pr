/// <reference types="jest" />
import dotenv from 'dotenv';

// Set test environment
process.env.NODE_ENV = 'test';

// Load environment variables before any tests run
dotenv.config({ path: '.env' });
