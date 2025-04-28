
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition_type: 'manual' | 'daily_streak' | 'total_completions';
  condition_value: number | null;
  created_at: string;
  updated_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
};
