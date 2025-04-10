
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Save } from "lucide-react";
import { useState } from "react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
};

type ProfileCardProps = {
  user: UserProfile;
};

const ProfileCard = ({ user }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would save the profile to your backend
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="relative pb-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-xl bg-primary/20 text-primary">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {!isEditing ? (
            <CardTitle className="text-xl">{profile.name}</CardTitle>
          ) : (
            <div className="w-full mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
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
              value={profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Joined</Label>
            <p className="text-sm text-muted-foreground mt-1">{profile.joinDate}</p>
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button className="w-full" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileCard;
