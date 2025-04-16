
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type HabitCardProps = {
  id: string;
  title: string;
  category: string;
  description?: string;
  streak: number;
  completedToday: boolean;
  progress: number;
  onDelete: (id: string) => void;
  onUpdate: () => void;
};

const HabitCard = ({
  id,
  title,
  category,
  description,
  streak,
  completedToday,
  progress,
  onDelete,
  onUpdate,
}: HabitCardProps) => {
  const [isCompleted, setIsCompleted] = useState(completedToday);
  const [currentStreak, setCurrentStreak] = useState(streak);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      if (!isCompleted) {
        // Mark as completed
        const { error } = await supabase.from('habit_logs').insert({
          habit_id: id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          completed_date: today
        });
        
        if (error) throw error;
        
        setIsCompleted(true);
        setCurrentStreak(currentStreak + 1);
        setCurrentProgress(Math.min(100, currentProgress + 10));
        toast.success("Habit completed for today!");
      } else {
        // Remove completion
        const { error } = await supabase.from('habit_logs')
          .delete()
          .match({ 
            habit_id: id, 
            completed_date: today 
          });
        
        if (error) throw error;
        
        setIsCompleted(false);
        setCurrentStreak(Math.max(0, currentStreak - 1));
        setCurrentProgress(Math.max(0, currentProgress - 10));
        toast.info("Habit marked as incomplete");
      }
      
      onUpdate();
    } catch (error: any) {
      toast.error(`Error updating habit: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHabit = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('habits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Habit deleted successfully");
      onDelete(id);
    } catch (error: any) {
      toast.error(`Error deleting habit: ${error.message}`);
    } finally {
      setIsDeleting(false);
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
            <DropdownMenuItem disabled className="cursor-pointer flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the habit and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteHabit}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
          disabled={isSubmitting}
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