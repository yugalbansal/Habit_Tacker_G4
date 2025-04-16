
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

  // Fetch user achievements - fixed to use join syntax
  const { data: userAchievements = [], isLoading: isLoadingAchievements } = useQuery({
    queryKey: ["userAchievements", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          id,
          earned_at,
          achievement:achievement_id (
            id,
            title,
            description,
            icon
          )
        `)
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching user achievements:", error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.achievement.title,
        description: item.achievement.description,
        date: new Date(item.earned_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        icon: item.achievement.icon,
      }));
    },
    enabled: !!user,
  });

  // Fetch available achievements
  const { data: allAchievements = [] } = useQuery({
    queryKey: ["allAchievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*");
      
      if (error) {
        console.error("Error fetching all achievements:", error);
        return [];
      }
      
      return data;
    },
  });

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
                {userAchievements.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{userAchievements.length}</Badge>
                )}
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
                          <div className="text-2xl font-bold">{userAchievements.length}</div>
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
              {isLoadingAchievements ? (
                <div className="flex items-center justify-center p-8">
                  <p>Loading achievements...</p>
                </div>
              ) : (
                <>
                  {userAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userAchievements.map((achievement) => (
                        <Card key={achievement.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="text-4xl">{achievement.icon}</div>
                              <div>
                                <h3 className="font-medium">{achievement.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {achievement.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Earned on {achievement.date}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="mb-4">
                        <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Complete your habits consistently to earn achievements. There are {allAchievements.length} achievements waiting for you!
                      </p>
                    </div>
                  )}
                  
                  {allAchievements.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Available Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allAchievements.map(achievement => {
                          const isEarned = userAchievements.some(ua => ua.title === achievement.title);
                          return (
                            <div key={achievement.id} className={`p-4 rounded-lg border ${isEarned ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                              <div className="flex items-center gap-3">
                                <div className="text-2xl opacity-70">{achievement.icon}</div>
                                <div>
                                  <h4 className="font-medium">{achievement.title}</h4>
                                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                              </div>
                              {isEarned && (
                                <Badge className="mt-2" variant="outline">Earned</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default User;
