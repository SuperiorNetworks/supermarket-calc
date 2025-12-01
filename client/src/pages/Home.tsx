import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, Users, ShoppingCart, Calendar, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

type DateRange = "today" | "last7days" | "thisMonth" | "allTime";

export default function Home() {
  const utils = trpc.useUtils();
  const { data: salesData = [], isLoading, refetch } = trpc.sales.list.useQuery(undefined, {
    refetchInterval: 5000, // Real-time sync every 5 seconds
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [dateRange, setDateRange] = useState<DateRange>("allTime");
  const [formData, setFormData] = useState({
    totalSales: "",
    cogs: "",
    expensesOther: "",
    refundsOrDiscounts: "",
    customerCount: "",
    notes: "",
  });

  const upsertMutation = trpc.sales.upsert.useMutation({
    onSuccess: () => {
      toast.success("Sales data saved successfully!");
      utils.sales.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const deleteMutation = trpc.sales.delete.useMutation({
    onSuccess: () => {
      toast.success("Sales data deleted successfully!");
      utils.sales.list.invalidate();
    },
  });

  // Load existing data when date changes
  useEffect(() => {
    const existing = salesData.find((d) => d.date === selectedDate);
    if (existing) {
      setFormData({
        totalSales: existing.totalSales.toString(),
        cogs: existing.cogs.toString(),
        expensesOther: existing.expensesOther.toString(),
        refundsOrDiscounts: existing.refundsOrDiscounts.toString(),
        customerCount: existing.customerCount.toString(),
        notes: existing.notes || "",
      });
    } else {
      setFormData({
        totalSales: "",
        cogs: "",
        expensesOther: "",
        refundsOrDiscounts: "",
        customerCount: "",
        notes: "",
      });
    }
  }, [selectedDate, salesData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate({
      date: selectedDate,
      totalSales: parseInt(formData.totalSales) || 0,
      cogs: parseInt(formData.cogs) || 0,
      expensesOther: parseInt(formData.expensesOther) || 0,
      refundsOrDiscounts: parseInt(formData.refundsOrDiscounts) || 0,
      customerCount: parseInt(formData.customerCount) || 0,
      notes: formData.notes,
    });
  };

  // Filter data by date range
  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return salesData.filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      switch (dateRange) {
        case "today":
          return itemDate.getTime() === today.getTime();
        case "last7days": {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDate >= weekAgo;
        }
        case "thisMonth":
          return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        case "allTime":
        default:
          return true;
      }
    });
  }, [salesData, dateRange]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const todayData = salesData.find((d) => d.date === selectedDate);
    const last7Days = salesData.slice(0, 7);
    const avg7DaySales = last7Days.length > 0 ? last7Days.reduce((sum, d) => sum + d.totalSales, 0) / last7Days.length : 0;

    const totalRevenue = filteredData.reduce((sum, d) => sum + d.totalSales, 0);
    const totalCOGS = filteredData.reduce((sum, d) => sum + d.cogs, 0);
    const totalExpenses = filteredData.reduce((sum, d) => sum + d.expensesOther, 0);
    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;
    const avgDailySales = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;
    const avgNetMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      todaySales: todayData?.totalSales || 0,
      todayNetProfit: todayData ? todayData.totalSales - todayData.cogs - todayData.expensesOther : 0,
      todayProfitMargin: todayData && todayData.totalSales > 0 ? ((todayData.totalSales - todayData.cogs - todayData.expensesOther) / todayData.totalSales) * 100 : 0,
      todayCustomers: todayData?.customerCount || 0,
      avg7DaySales,
      totalRevenue,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netProfit,
      avgDailySales,
      avgNetMargin,
    };
  }, [salesData, filteredData, selectedDate]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((d) => ({
        date: d.date,
        sales: d.totalSales,
        netProfit: d.totalSales - d.cogs - d.expensesOther,
        cogs: d.cogs,
        expenses: d.expensesOther,
        customers: d.customerCount,
        margin: d.totalSales > 0 ? ((d.totalSales - d.cogs - d.expensesOther) / d.totalSales) * 100 : 0,
      }));
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supermarket Calc</h1>
              <p className="text-sm text-gray-600 mt-1">Live Performance Dashboard for Supermarket Simulator</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <SelectTrigger className="w-[140px] md:w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-600 hidden md:inline">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Daily Input Panel */}
        <Card className="shadow-lg border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Daily Sales Entry
            </CardTitle>
            <CardDescription>Enter or update today's sales data</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="totalSales">Total Sales ($)</Label>
                  <Input
                    id="totalSales"
                    type="number"
                    value={formData.totalSales}
                    onChange={(e) => setFormData({ ...formData, totalSales: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cogs">COGS ($)</Label>
                  <Input
                    id="cogs"
                    type="number"
                    value={formData.cogs}
                    onChange={(e) => setFormData({ ...formData, cogs: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="expensesOther">Other Expenses ($)</Label>
                  <Input
                    id="expensesOther"
                    type="number"
                    value={formData.expensesOther}
                    onChange={(e) => setFormData({ ...formData, expensesOther: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="refundsOrDiscounts">Refunds/Discounts ($)</Label>
                  <Input
                    id="refundsOrDiscounts"
                    type="number"
                    value={formData.refundsOrDiscounts}
                    onChange={(e) => setFormData({ ...formData, refundsOrDiscounts: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customerCount">Customer Count</Label>
                  <Input
                    id="customerCount"
                    type="number"
                    value={formData.customerCount}
                    onChange={(e) => setFormData({ ...formData, customerCount: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Events, promotions, stock issues..."
                  className="mt-1"
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={upsertMutation.isPending} className="w-full md:w-auto">
                {upsertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Day
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Today's Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">${kpis.todaySales.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">7-day avg: ${Math.round(kpis.avg7DaySales).toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Today's Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl md:text-3xl font-bold ${kpis.todayNetProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${kpis.todayNetProfit.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Margin: {kpis.todayProfitMargin.toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.todayCustomers.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Avg basket: ${kpis.todayCustomers > 0 ? (kpis.todaySales / kpis.todayCustomers).toFixed(2) : "0.00"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Period Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl md:text-3xl font-bold ${kpis.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${kpis.netProfit.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Margin: {kpis.avgNetMargin.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Line Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Daily Sales Trend</CardTitle>
              <CardDescription>Revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="netProfit" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Net Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit vs Expenses Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Profit vs Expenses</CardTitle>
              <CardDescription>Daily breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cogs" fill="hsl(var(--chart-4))" name="COGS" />
                  <Bar dataKey="expenses" fill="hsl(var(--chart-3))" name="Expenses" />
                  <Bar dataKey="netProfit" fill="hsl(var(--chart-2))" name="Net Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* P&L Summary */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle>Profit & Loss Summary</CardTitle>
            <CardDescription>Financial overview for selected period</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Revenue</span>
                  <span className="font-bold text-lg">${kpis.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total COGS</span>
                  <span className="font-bold text-lg text-red-600">-${kpis.totalCOGS.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Gross Profit</span>
                  <span className="font-bold text-lg text-green-600">${kpis.grossProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Operating Expenses</span>
                  <span className="font-bold text-lg text-red-600">-${kpis.totalExpenses.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-lg">Net Profit</span>
                  <span className={`font-bold text-2xl ${kpis.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${kpis.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Avg Daily Sales</span>
                  <span className="font-bold">${Math.round(kpis.avgDailySales).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Avg Net Margin</span>
                  <span className="font-bold">{kpis.avgNetMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Days Tracked</span>
                  <span className="font-bold">{filteredData.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Day-by-Day Activity</CardTitle>
            <CardDescription>Complete sales history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">COGS</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net Profit</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                    <TableHead className="text-right">Customers</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        No data available. Start by entering your first day's sales!
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((row) => {
                      const netProfit = row.totalSales - row.cogs - row.expensesOther;
                      const margin = row.totalSales > 0 ? (netProfit / row.totalSales) * 100 : 0;
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.date}</TableCell>
                          <TableCell className="text-right">${row.totalSales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${row.cogs.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${row.expensesOther.toLocaleString()}</TableCell>
                          <TableCell className={`text-right font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ${netProfit.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">{margin.toFixed(1)}%</TableCell>
                          <TableCell className="text-right">{row.customerCount}</TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-gray-600">{row.notes || "-"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container py-6 text-center text-sm text-gray-600">
          <p>Supermarket Calc - Real-time Performance Dashboard</p>
          <p className="mt-1">Built for Steam Supermarket Simulator</p>
        </div>
      </footer>
    </div>
  );
}
