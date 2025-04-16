
import { Achievement } from "@/types/achievement";

type AchievementsListProps = {
  achievements: Achievement[];
  isLoading: boolean;
};

const AchievementsList = ({ achievements, isLoading }: AchievementsListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading achievements...</p>
      </div>
    );
  }
  
  if (achievements.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No achievements created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex items-start gap-4 p-4 border rounded-lg">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <h3 className="font-medium">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Created on {new Date(achievement.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsList;
