import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
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
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Achievement } from "@/types/achievement";
import { adminSupabase } from "@/integrations/supabase/adminClient";

type AchievementsListProps = {
  achievements: Achievement[];
  isLoading: boolean;
  refetchAchievements?: () => void;
};

const AchievementsList = ({ 
  achievements, 
  isLoading,
  refetchAchievements 
}: AchievementsListProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [editedAchievement, setEditedAchievement] = useState({
    title: "",
    description: "",
    icon: ""
  });

  const handleEdit = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setEditedAchievement({
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon
    });
    setIsEditing(true);
  };

  const handleDelete = async (achievementId: string) => {
    setIsDeleting(true);
    
    try {
      const { error } = await adminSupabase
        .from("achievements")
        .delete()
        .eq("id", achievementId);
        
      if (error) throw error;
      
      toast({
        title: "Achievement deleted",
        description: "The achievement has been successfully deleted."
      });
      
      if (refetchAchievements) {
        refetchAchievements();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete achievement: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error deleting achievement:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedAchievement) return;
    
    try {
      const { error } = await adminSupabase
        .from("achievements")
        .update({
          title: editedAchievement.title,
          description: editedAchievement.description,
          icon: editedAchievement.icon,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedAchievement.id);
        
      if (error) throw error;
      
      toast({
        title: "Achievement updated",
        description: "The achievement has been successfully updated."
      });
      
      setIsEditing(false);
      
      if (refetchAchievements) {
        refetchAchievements();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update achievement: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error updating achievement:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading achievements...</div>;
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No achievements found.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((achievement) => (
            <TableRow key={achievement.id}>
              <TableCell className="font-medium text-2xl">{achievement.icon}</TableCell>
              <TableCell>{achievement.title}</TableCell>
              <TableCell className="hidden md:table-cell">
                {achievement.description.length > 60 
                  ? `${achievement.description.substring(0, 60)}...` 
                  : achievement.description}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(achievement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the achievement "{achievement.title}"? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(achievement.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Achievement</DialogTitle>
            <DialogDescription>
              Make changes to the achievement details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={editedAchievement.title} 
                onChange={(e) => setEditedAchievement(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={editedAchievement.description} 
                onChange={(e) => setEditedAchievement(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="icon" className="text-sm font-medium">Icon (emoji)</label>
              <Input 
                id="icon" 
                value={editedAchievement.icon} 
                onChange={(e) => setEditedAchievement(prev => ({ ...prev, icon: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementsList;