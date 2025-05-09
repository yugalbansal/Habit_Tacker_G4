
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { startOfWeek, format, addDays, isSameDay, subDays, isYesterday } from "date-fns";

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
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      
      // Fetch completion logs for today
      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed_date", today);
      
      if (logsError) throw logsError;
      
      // Fetch logs for calculation of streaks
      const { data: allLogsData, error: allLogsError } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_date", { ascending: false });
      
      if (allLogsError) throw allLogsError;
      
      // Transform habits data
      const transformedHabits = habitsData.map(habit => {
        // Check if completed today
        const completedToday = logsData.some(log => log.habit_id === habit.id);
        
        // Calculate streak based on consecutive days
        const habitLogs = allLogsData.filter(log => log.habit_id === habit.id);
        
        // Sort logs by date (newest first)
        const sortedLogs = habitLogs.sort((a, b) => 
          new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()
        );
        
        // Calculate streak - consecutive days without missing a day
        let streak = 0;
        
        // If not completed today, check if completed yesterday
        // If not completed yesterday, streak breaks unless it's a new day
        if (!completedToday) {
          const completedYesterday = sortedLogs.some(log => 
            log.completed_date === yesterday
          );
          
          if (!completedYesterday) {
            // Streak is broken only if it's not a new habit created today
            if (format(new Date(habit.created_at), 'yyyy-MM-dd') !== today) {
              streak = 0;
            }
          } else {
            // If completed yesterday but not today, count the streak up to yesterday
            streak = 1; // Start with yesterday
            
            // Continue checking previous days
            for (let i = 1; i < sortedLogs.length; i++) {
              const expectedDate = format(subDays(new Date(), i + 1), 'yyyy-MM-dd');
              const hasExpectedDate = sortedLogs.some(log => log.completed_date === expectedDate);
              
              if (hasExpectedDate) {
                streak++;
              } else {
                break;
              }
            }
          }
        } else {
          // Completed today, start streak at 1
          streak = 1;
          
          // Check for consecutive previous days
          for (let i = 1; i < 365; i++) {
            const expectedDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
            const hasExpectedDate = sortedLogs.some(log => log.completed_date === expectedDate);
            
            if (hasExpectedDate) {
              streak++;
            } else {
              break;
            }
          }
        }
        
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
      const isToday = isSameDay(date, new Date());
      const completed = isToday ? habits.filter(h => h.completedToday).length : 0;
      
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
