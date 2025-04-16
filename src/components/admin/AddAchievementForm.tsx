
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AddAchievementFormProps = {
  onSuccess: () => void;
};

const AddAchievementForm = ({ onSuccess }: AddAchievementFormProps) => {
  const { toast } = useToast();
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    icon: "🏆",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase
      .from("achievements")
      .insert({
        title: newAchievement.title,
        description: newAchievement.description,
        icon: newAchievement.icon
      });
    setIsLoading(false);
    
    if (error) {
      console.error("Error adding achievement:", error);
      toast({
        title: "Error",
        description: "Failed to add achievement",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Achievement added successfully"
    });
    
    setNewAchievement({
      title: "",
      description: "",
      icon: "🏆"
    });
    
    onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Achievement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={newAchievement.title} 
              onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Early Bird"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newAchievement.description} 
              onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Complete 10 morning habits"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input 
              id="icon" 
              value={newAchievement.icon} 
              onChange={(e) => setNewAchievement(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="🏆"
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleAddAchievement}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Achievement"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddAchievementForm;
