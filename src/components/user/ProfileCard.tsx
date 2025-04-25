
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Save, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";

type ProfileCardProps = {
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
  };
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    full_name: profile.full_name || "",
    avatar_url: profile.avatar_url || ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let avatarUrl = profile.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // First, remove old avatar if it exists and contains the user ID
        if (profile.avatar_url) {
          try {
            const oldAvatarPath = profile.avatar_url.split('/').pop();
            const oldFolder = profile.avatar_url.split('/').slice(-2)[0];
            
            if (oldFolder === user.id && oldAvatarPath) {
              await supabase.storage
                .from('avatars')
                .remove([`${user.id}/${oldAvatarPath}`]);
            }
          } catch (removeError) {
            console.warn("Error removing old avatar:", removeError);
            // Continue even if removal fails
          }
        }
        
        // Upload new avatar
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = data.publicUrl;
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedProfile.full_name,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      // Clean up preview URL
      setPreviewUrl(null);
      
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayImage = () => {
    if (previewUrl) return previewUrl;
    if (profile.avatar_url) return profile.avatar_url;
    return "";
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="relative pb-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={getDisplayImage()} alt={profile.full_name || user?.email || ""} />
            <AvatarFallback className="text-xl bg-primary/20 text-primary">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          {isEditing && (
            <div className="mb-4">
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Upload className="h-4 w-4" />
                  Change Avatar
                </div>
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
          
          {!isEditing ? (
            <CardTitle className="text-xl">{profile.full_name || user?.email}</CardTitle>
          ) : (
            <div className="w-full mb-4">
              <Label htmlFor="full_name">Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={updatedProfile.full_name}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={user?.email || ""}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label>Joined</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" /> 
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileCard;
