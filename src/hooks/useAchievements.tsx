
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const useAchievements = () => {
  const { user } = useAuth();
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const { data: userAchievements = [], refetch } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          earned_at,
          achievement:achievement_id (
            id,
            title,
            description,
            icon,
            condition_type,
            condition_value
          )
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Check for new achievements periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const { data: newAchievements, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          earned_at,
          achievement:achievement_id (
            title,
            description,
            icon
          )
        `)
        .eq('user_id', user.id)
        .gt('earned_at', lastChecked.toISOString())
        .order('earned_at', { ascending: true });

      if (error) {
        console.error('Error checking new achievements:', error);
        return;
      }

      // Show toast for each new achievement
      newAchievements?.forEach((achievement) => {
        toast({
          title: `🏆 ${achievement.achievement.title}`,
          description: achievement.achievement.description,
          icon: <Trophy className="h-4 w-4" />,
          duration: 5000
        });
      });

      if (newAchievements?.length) {
        setLastChecked(new Date());
        refetch();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user, lastChecked, refetch]);

  return {
    achievements: userAchievements,
    refetchAchievements: refetch
  };
};
