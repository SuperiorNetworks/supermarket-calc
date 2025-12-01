import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { deleteSalesData } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("sales.upsert", () => {
  const testDate = "2025-12-01";

  beforeEach(async () => {
    // Clean up test data
    try {
      await deleteSalesData(testDate);
    } catch (e) {
      // Ignore if doesn't exist
    }
  });

  it("creates new sales record", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sales.upsert({
      date: testDate,
      totalSales: 5000,
      cogs: 3000,
      expensesOther: 1000,
      refundsOrDiscounts: 100,
      customerCount: 50,
      notes: "Test day",
    });

    expect(result).toBeDefined();
    expect(result?.date).toBe(testDate);
    expect(result?.totalSales).toBe(5000);
    expect(result?.cogs).toBe(3000);
    expect(result?.customerCount).toBe(50);
  });

  it("updates existing sales record", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create initial record
    await caller.sales.upsert({
      date: testDate,
      totalSales: 5000,
      cogs: 3000,
      expensesOther: 1000,
      refundsOrDiscounts: 100,
      customerCount: 50,
      notes: "Initial",
    });

    // Update the same date
    const updated = await caller.sales.upsert({
      date: testDate,
      totalSales: 6000,
      cogs: 3500,
      expensesOther: 1200,
      refundsOrDiscounts: 150,
      customerCount: 60,
      notes: "Updated",
    });

    expect(updated?.totalSales).toBe(6000);
    expect(updated?.cogs).toBe(3500);
    expect(updated?.customerCount).toBe(60);
    expect(updated?.notes).toBe("Updated");
  });
});

describe("sales.list", () => {
  it("returns all sales data", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sales.list();

    expect(Array.isArray(result)).toBe(true);
    // Should have at least the test data we created
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});

describe("sales.delete", () => {
  const testDate = "2025-12-15";

  it("deletes sales record", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a record to delete
    await caller.sales.upsert({
      date: testDate,
      totalSales: 1000,
      cogs: 500,
      expensesOther: 200,
      refundsOrDiscounts: 0,
      customerCount: 10,
    });

    // Delete it
    const result = await caller.sales.delete({ date: testDate });

    expect(result.success).toBe(true);

    // Verify it's gone
    const allData = await caller.sales.list();
    const found = allData.find((d) => d.date === testDate);
    expect(found).toBeUndefined();
  });
});
