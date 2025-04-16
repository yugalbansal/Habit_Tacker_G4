
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Achievement } from "@/types/achievement";
import AchievementsList from "./AchievementsList";
import AddAchievementForm from "./AddAchievementForm";

type AchievementsManagerProps = {
  achievements: Achievement[];
  isLoading: boolean;
  refetchAchievements: () => void;
};

const AchievementsManager = ({ 
  achievements, 
  isLoading,
  refetchAchievements
}: AchievementsManagerProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsList 
              achievements={achievements} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <AddAchievementForm onSuccess={refetchAchievements} />
      </div>
    </div>
  );
};

export default AchievementsManager;
