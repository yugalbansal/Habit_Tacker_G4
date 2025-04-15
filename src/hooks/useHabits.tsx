
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { startOfWeek, format, addDays, isSameDay } from "date-fns";

export type Habit = {
  id: string;
  title: string;
  category: string;
  description?: string;
  streak: number;
  completedToday: boolean;
  progress: number;
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHabits = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id);
      
      if (habitsError) throw habitsError;
      
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Fetch completion logs for today
      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed_date", today);
      
      if (logsError) throw logsError;
      
      // For streak calculation, get completion logs for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: streakData, error: streakError } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("completed_date", format(thirtyDaysAgo, 'yyyy-MM-dd'));
      
      if (streakError) throw streakError;
      
      // Transform habits data
      const transformedHabits = habitsData.map(habit => {
        // Check if completed today
        const completedToday = logsData.some(log => log.habit_id === habit.id);
        
        // Calculate streak (simplified version)
        const habitLogs = streakData.filter(log => log.habit_id === habit.id);
        const sortedLogs = habitLogs.sort((a, b) => 
          new Date(a.completed_date).getTime() - new Date(b.completed_date).getTime()
        );
        
        // Simple calculation - just count all logs in the last 30 days
        const streak = sortedLogs.length;
        
        // Calculate progress (based on streaks)
        const progress = Math.min(100, streak * 10);
        
        // Get frequency as category
        const category = habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
        
        return {
          id: habit.id,
          title: habit.name,
          category,
          description: habit.description,
          streak,
          completedToday,
          progress,
        };
      });
      
      setHabits(transformedHabits);
    } catch (err: any) {
      console.error("Error fetching habits:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyProgressData = () => {
    const start = startOfWeek(new Date());
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return weekDays.map((name, i) => {
      const date = addDays(start, i);
      const completed = habits.filter(h => h.completedToday && isSameDay(new Date(), date)).length;
      
      return {
        name,
        completed,
        total: habits.length
      };
    });
  };

  const getCategoryData = () => {
    const categories = [...new Set(habits.map(h => h.category))];
    
    return categories.map(category => {
      const habitsInCategory = habits.filter(h => h.category === category);
      const completed = habitsInCategory.filter(h => h.completedToday).length;
      
      return {
        name: category,
        completed,
        total: habitsInCategory.length
      };
    });
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    weeklyProgressData: getWeeklyProgressData(),
    categoryData: getCategoryData(),
  };
};