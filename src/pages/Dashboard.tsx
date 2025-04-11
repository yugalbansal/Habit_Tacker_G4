
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart2, CalendarDays, ListTodo } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HabitCard from "@/components/dashboard/HabitCard";
import ProgressChart from "@/components/dashboard/ProgressChart";

const Dashboard = () => {
  // Sample data for demonstration
  const [habits, setHabits] = useState([
    {
      id: "1",
      title: "Morning Meditation",
      category: "Wellness",
      streak: 5,
      completedToday: true,
      progress: 70,
    },
    {
      id: "2",
      title: "Read for 30 minutes",
      category: "Learning",
      streak: 12,
      completedToday: false,
      progress: 60,
    },
    {
      id: "3",
      title: "Workout",
      category: "Fitness",
      streak: 3,
      completedToday: false,
      progress: 30,
    },
    {
      id: "4",
      title: "Drink 8 glasses of water",
      category: "Health",
      streak: 7,
      completedToday: true,
      progress: 80,
    },
  ]);

  const weeklyProgressData = [
    { name: "Mon", completed: 3, total: 4 },
    { name: "Tue", completed: 4, total: 4 },
    { name: "Wed", completed: 2, total: 4 },
    { name: "Thu", completed: 3, total: 4 },
    { name: "Fri", completed: 3, total: 4 },
    { name: "Sat", completed: 1, total: 4 },
    { name: "Sun", completed: 0, total: 4 },
  ];

  const categoryData = [
    { name: "Fitness", completed: 10, total: 12 },
    { name: "Health", completed: 15, total: 20 },
    { name: "Learning", completed: 8, total: 10 },
    { name: "Wellness", completed: 12, total: 15 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 pt-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">
                Track your habits and monitor your progress
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Habit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{habits.length}</div>
                  <div className="text-sm text-muted-foreground">Active Habits</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">75%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="habits" className="mb-8">
            <TabsList>
              <TabsTrigger value="habits">My Habits</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="habits" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} {...habit} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressChart data={weeklyProgressData} title="Weekly Progress" />
                <ProgressChart data={categoryData} title="Habits by Category" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
