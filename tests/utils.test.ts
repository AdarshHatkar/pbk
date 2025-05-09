import { describe, it, expect } from 'vitest';
import { add, multiply } from '../src/utils.js';

describe('Utils', () => {
  describe('add', () => {
    it('should add two numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(-1, 1)).toBe(-1);
      expect(multiply(0, 5)).toBe(0);
    });
  });
});