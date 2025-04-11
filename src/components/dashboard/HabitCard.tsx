
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HabitCardProps = {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedToday: boolean;
  progress: number;
};

const HabitCard = ({
  id,
  title,
  category,
  streak,
  completedToday,
  progress,
}: HabitCardProps) => {
  const [isCompleted, setIsCompleted] = useState(completedToday);
  const [currentStreak, setCurrentStreak] = useState(streak);
  const [currentProgress, setCurrentProgress] = useState(progress);

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      setCurrentStreak(currentStreak + 1);
      setCurrentProgress(Math.min(100, currentProgress + 10));
    } else {
      setIsCompleted(false);
      setCurrentStreak(Math.max(0, currentStreak - 1));
      setCurrentProgress(Math.max(0, currentProgress - 10));
    }
  };

  return (
    <Card className={`${isCompleted ? "border-primary/50 bg-secondary/50" : ""}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {title}
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {category}
          </span>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">day streak</div>
          </div>
          <div className="text-xs text-muted-foreground">{currentProgress}% complete</div>
        </div>
        <Progress value={currentProgress} className="h-1.5" />
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button
          onClick={handleComplete}
          className={`w-full ${
            isCompleted
              ? "bg-primary/20 text-primary hover:bg-primary/30"
              : "bg-secondary hover:bg-secondary/80"
          }`}
          variant="outline"
          size="sm"
        >
          {isCompleted ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Completed
            </>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;
