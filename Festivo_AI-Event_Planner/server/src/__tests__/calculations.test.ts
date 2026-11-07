import { describe, it, expect } from 'vitest';
import { CreateEventSchema, ExpenseSchema, TaskSchema, AIPlanSchema } from '../schemas/index.js';
import { aiService } from '../services/aiService.js';
import { IEvent, IExpense, ITask } from '../types/index.js';

describe('Festivo AI Business Logic & Calculations', () => {
  describe('Budget Calculations', () => {
    const totalBudget = 100000;
    const expenses: IExpense[] = [
      {
        id: '1',
        eventId: 'evt_1',
        category: 'venue',
        description: 'Banquet Hall',
        estimatedAmount: 40000,
        actualAmount: 38000,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        eventId: 'evt_1',
        category: 'catering',
        description: 'Buffet Catering',
        estimatedAmount: 30000,
        actualAmount: 32000,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '3',
        eventId: 'evt_1',
        category: 'decoration',
        description: 'Floral stage',
        estimatedAmount: 15000,
        actualAmount: 0, // Unpaid/not spent yet
        createdAt: '',
        updatedAt: '',
      },
    ];

    it('calculates total actual spending and remaining budget correctly', () => {
      const totalActual = expenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
      const remaining = totalBudget - totalActual;
      expect(totalActual).toBe(70000);
      expect(remaining).toBe(30000);
    });

    it('calculates budget utilization percentage correctly', () => {
      const totalActual = expenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
      const utilization = (totalActual / totalBudget) * 100;
      expect(utilization).toBe(70);
    });

    it('calculates budget variance correctly (Actual - Estimated)', () => {
      const totalEstimated = expenses.reduce((sum, e) => sum + (e.estimatedAmount || 0), 0);
      const totalActual = expenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
      const variance = totalActual - totalEstimated; // 70000 - 85000 = -15000
      expect(totalEstimated).toBe(85000);
      expect(variance).toBe(-15000);
    });

    it('handles zero budget safely without NaN or division by zero', () => {
      const zeroBudget = 0;
      const totalActual = 500;
      const utilization = zeroBudget > 0 ? (totalActual / zeroBudget) * 100 : 0;
      const remaining = zeroBudget - totalActual;
      expect(utilization).toBe(0);
      expect(remaining).toBe(-500);
      expect(isNaN(utilization)).toBe(false);
    });

    it('rejects negative expense values via Zod schema', () => {
      const invalidNegative = {
        category: 'venue',
        description: 'Test',
        estimatedAmount: -100,
        actualAmount: -50,
      };
      const result = ExpenseSchema.safeParse(invalidNegative);
      expect(result.success).toBe(false);
    });
  });

  describe('Timeline & Task Logic', () => {
    it('detects overdue tasks accurately compared to event date or target date', () => {
      const today = new Date('2026-10-29T00:00:00Z');
      const pastDueDate = '2026-10-20';
      const futureDueDate = '2026-11-15';

      const isOverdue = (taskDueDate: string, status: string) => {
        return status !== 'completed' && new Date(taskDueDate) < today;
      };

      expect(isOverdue(pastDueDate, 'pending')).toBe(true);
      expect(isOverdue(pastDueDate, 'completed')).toBe(false);
      expect(isOverdue(futureDueDate, 'pending')).toBe(false);
    });

    it('calculates task completion percentage correctly', () => {
      const tasks: Partial<ITask>[] = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'in_progress' },
        { status: 'pending' },
      ];
      const completed = tasks.filter((t) => t.status === 'completed').length;
      const pct = Math.round((completed / tasks.length) * 100);
      expect(pct).toBe(50);
    });

    it('validates task schema rejects empty title', () => {
      const invalidTask = {
        title: '',
        dueDate: '2026-11-20',
      };
      const result = TaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('Event Validation & AI Schemas', () => {
    it('validates event creation requirements and defaults currency to INR', () => {
      const validEventInput = {
        name: 'Ananya Golden Jubilee Birthday',
        type: 'birthday',
        date: '2026-12-15',
        location: 'Mumbai',
        guestCount: 120,
        budget: 450000,
      };
      const parsed = CreateEventSchema.safeParse(validEventInput);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.currency).toBe('INR');
      }
    });

    it('rejects invalid guest count (<= 0) and invalid dates', () => {
      const invalidEvent = {
        name: 'Invalid Event',
        type: 'wedding',
        date: 'not-a-real-date',
        location: 'Goa',
        guestCount: -5,
        budget: 50000,
      };
      const parsed = CreateEventSchema.safeParse(invalidEvent);
      expect(parsed.success).toBe(false);
    });

    it('generates a valid, mathematically sound AI plan via fallback engine', () => {
      const testEvent: IEvent = {
        id: 'test_evt',
        name: 'Test Celebration',
        type: 'wedding',
        date: '2026-12-30',
        location: 'Jaipur',
        guestCount: 200,
        budget: 1000000,
        currency: 'INR',
        expenses: [],
        tasks: [],
        vendors: [],
        ideas: [],
        chatHistory: [],
        createdAt: '',
        updatedAt: '',
      };

      const plan = aiService.generateTailoredFallbackPlan(testEvent);
      const validation = AIPlanSchema.safeParse(plan);
      expect(validation.success).toBe(true);

      // Verify that budget allocations add up to total budget
      const totalAllocated = plan.budgetAllocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
      expect(totalAllocated).toBe(testEvent.budget);
    });
  });
});
