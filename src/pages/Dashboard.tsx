
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, CalendarDays, ListTodo } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HabitCard from "@/components/dashboard/HabitCard";
import ProgressChart from "@/components/dashboard/ProgressChart";
import AddHabitDialog from "@/components/dashboard/AddHabitDialog";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    habits, 
    isLoading, 
    error, 
    fetchHabits,
    weeklyProgressData,
    categoryData
  } = useHabits();

  const totalCompletedToday = habits.filter(habit => habit.completedToday).length;
  const completionRate = habits.length > 0 
    ? Math.round((totalCompletedToday / habits.length) * 100) 
    : 0;
  
  const maxStreak = habits.length > 0 
    ? Math.max(...habits.map(habit => habit.streak)) 
    : 0;

  useEffect(() => {
    if (error) {
      toast.error(`Error loading habits: ${error}`);
    }
  }, [error]);

  const handleDeleteHabit = (id: string) => {
    // The actual delete happens in the HabitCard component
    // Here we just refresh the list
    fetchHabits();
  };

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
            <AddHabitDialog onHabitAdded={fetchHabits} />
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
                  <div className="text-2xl font-bold">{completionRate}%</div>
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
                  <div className="text-2xl font-bold">{maxStreak}</div>
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
              {isLoading ? (
                <div className="text-center py-8">Loading habits...</div>
              ) : habits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">You don't have any habits yet.</p>
                  <AddHabitDialog onHabitAdded={fetchHabits} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {habits.map((habit) => (
                    <HabitCard 
                      key={habit.id} 
                      {...habit} 
                      onDelete={handleDeleteHabit}
                      onUpdate={fetchHabits}
                    />
                  ))}
                </div>
              )}
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