
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/user/ProfileCard";
import { Settings, Bell, Shield, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

const User = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      if (!user) return { habits: 0, completions: 0 };
      
      // Get habits count
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("id", { count: "exact" })
        .eq("user_id", user.id);
      
      if (habitsError) {
        console.error("Error fetching habits:", habitsError);
      }
      
      // Get completions count
      const { data: completions, error: completionsError } = await supabase
        .from("habit_logs")
        .select("id", { count: "exact" })
        .eq("user_id", user.id);
      
      if (completionsError) {
        console.error("Error fetching completions:", completionsError);
      }
      
      return {
        habits: habits?.length || 0,
        completions: completions?.length || 0
      };
    },
    enabled: !!user,
  });

  // Sample achievements data (would be replaced with real data from backend)
  const achievements = [
    {
      id: "1",
      title: "Early Bird",
      description: "Completed 10 morning habits",
      date: "Mar 15, 2023",
      icon: "🌅",
    },
    {
      id: "2",
      title: "Streak Master",
      description: "Maintained a 30-day streak",
      date: "Feb 27, 2023",
      icon: "🔥",
    },
    {
      id: "3",
      title: "Goal Crusher",
      description: "Completed all goals for a month",
      date: "Jan 31, 2023",
      icon: "🏆",
    },
  ];

  if (isLoadingProfile || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 pt-24">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile and account settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="mb-8">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Privacy
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ProfileCard profile={profile} />
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Account Statistics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="p-4 rounded-lg bg-secondary">
                          <div className="text-sm text-muted-foreground mb-1">Active Habits</div>
                          <div className="text-2xl font-bold">{stats?.habits || 0}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary">
                          <div className="text-sm text-muted-foreground mb-1">Total Completions</div>
                          <div className="text-2xl font-bold">{stats?.completions || 0}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary">
                          <div className="text-sm text-muted-foreground mb-1">Achievements</div>
                          <div className="text-2xl font-bold">{achievements.length}</div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-4">Top Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-secondary">Fitness (14)</Badge>
                        <Badge variant="outline" className="bg-secondary">Health (10)</Badge>
                        <Badge variant="outline" className="bg-secondary">Productivity (8)</Badge>
                        <Badge variant="outline" className="bg-secondary">Learning (6)</Badge>
                        <Badge variant="outline" className="bg-secondary">Mindfulness (4)</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure your notification preferences
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Notification settings will be available in future updates
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage your privacy and security settings
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Privacy settings will be available in future updates
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Earned on {achievement.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default User;
