
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserTable from "@/components/admin/UserTable";
import { Users, BarChart3, Settings, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AdminDashboard from "@/components/admin/Dashboard";
import Statistics from "@/components/admin/Statistics";
import AchievementsManager from "@/components/admin/AchievementsManager";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { Achievement } from "@/types/achievement";

type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  joinDate: string;
  habitsCount: number;
};

const Admin = () => {
  // Fetch users data from Supabase
  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return [];
      }

      console.log("Fetched profiles:", profiles.length);
      
      // For each profile, get the user status (active/inactive) based on last sign in
      const enhancedProfiles = await Promise.all(
        profiles.map(async (profile) => {
          // Get habits count for this user
          const { count: habitsCount, error: habitsError } = await supabase
            .from("habits")
            .select("*", { count: "exact", head: true })
            .eq("user_id", profile.id);
          
          if (habitsError) {
            console.error(`Error fetching habits for user ${profile.id}:`, habitsError);
          }
          
          // Using updated_at from profiles as a proxy for "last active"
          const isActive = new Date(profile.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          
          return {
            id: profile.id,
            name: profile.full_name || "Unnamed User",
            email: `User ${profile.id.substring(0, 8)}`, // We can't get email directly from profiles
            status: isActive ? "active" as const : "inactive" as const,
            joinDate: new Date(profile.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            habitsCount: habitsCount || 0
          };
        })
      );
      
      console.log("Enhanced profiles:", enhancedProfiles.length);
      return enhancedProfiles;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  // Fetch statistics from Supabase
  const { data: stats = { totalUsers: 0, activeUsers: 0, totalHabits: 0, totalCompletions: 0 }, isLoading: isLoadingStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // Count total users
      const { count: totalUsers, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact" });
      
      if (usersError) {
        console.error("Error counting users:", usersError);
      }
      
      // Count active users (updated in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers, error: activeUsersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .gte("updated_at", thirtyDaysAgo.toISOString());
      
      if (activeUsersError) {
        console.error("Error counting active users:", activeUsersError);
      }
      
      // Count total habits
      const { count: totalHabits, error: habitsError } = await supabase
        .from("habits")
        .select("*", { count: "exact" });
      
      if (habitsError) {
        console.error("Error counting habits:", habitsError);
      }
      
      // Count total completions
      const { count: totalCompletions, error: completionsError } = await supabase
        .from("habit_logs")
        .select("*", { count: "exact" });
      
      if (completionsError) {
        console.error("Error counting completions:", completionsError);
      }
      
      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalHabits: totalHabits || 0,
        totalCompletions: totalCompletions || 0
      };
    }
  });

  // Fetch achievements from Supabase
  const { data: achievements = [], isLoading: isLoadingAchievements, refetch: refetchAchievements } = useQuery({
    queryKey: ["adminAchievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching achievements:", error);
        return [];
      }
      
      return data as Achievement[];
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 pt-24">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users and monitor application statistics
            </p>
          </div>

          <AdminDashboard stats={stats} isLoading={isLoadingStats} />

          <Tabs defaultValue="users" className="mb-8">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Statistics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Achievements
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center p-8">
                  <p>Loading users...</p>
                </div>
              ) : (
                <UserTable users={users} refetchUsers={refetchUsers} />
              )}
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-6">
              <Statistics stats={stats} isLoading={isLoadingStats} />
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <AchievementsManager 
                achievements={achievements} 
                isLoading={isLoadingAchievements}
                refetchAchievements={refetchAchievements}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
