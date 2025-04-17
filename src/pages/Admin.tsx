import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserTable from "@/components/admin/UserTable";
import { Users, BarChart3, Settings, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminSupabase } from "@/integrations/supabase/adminClient";
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
  // Fetch users data using adminSupabase with service key (bypasses RLS)
  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        // Get all auth users directly using the service key client
        const { data: authUsers, error: authUsersError } = await adminSupabase.auth.admin.listUsers();
        
        if (authUsersError) {
          console.error("Error fetching auth users:", authUsersError);
          return [];
        }
        
        console.log("Fetched auth users:", authUsers?.users?.length);
        
        if (!authUsers?.users?.length) {
          return [];
        }
        
        // Get all profiles to get names
        const { data: profiles, error: profilesError } = await adminSupabase
          .from("profiles")
          .select("*");
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }
        
        console.log("Fetched profiles:", profiles?.length);
        
        // Create a map of profiles by id for faster lookup
        const profilesMap = (profiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
        
        // For each auth user, get the profile data and habits count
        const enhancedUsers = await Promise.all(
          authUsers.users.map(async (user) => {
            const profile = profilesMap[user.id];
            
            // Get habits count for this user
            const { count: habitsCount, error: habitsError } = await adminSupabase
              .from("habits")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id);
            
            if (habitsError) {
              console.error(`Error fetching habits for user ${user.id}:`, habitsError);
            }
            
            // Determine if user is active (logged in within last 30 days)
            const lastSignIn = user.last_sign_in_at || user.created_at;
            const isActive = new Date(lastSignIn) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            
            return {
              id: user.id,
              name: profile?.full_name || "Unnamed User",
              email: user.email || `User ${user.id.substring(0, 8)}`,
              status: isActive ? "active" as const : "inactive" as const,
              joinDate: new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              habitsCount: habitsCount || 0
            };
          })
        );
        
        console.log("Enhanced users:", enhancedUsers.length);
        return enhancedUsers;
      } catch (error) {
        console.error("Error in admin users query:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  // Fetch statistics from Supabase also using admin client
  const { data: stats = { totalUsers: 0, activeUsers: 0, totalHabits: 0, totalCompletions: 0 }, isLoading: isLoadingStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      try {
        // Count total users
        const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();
        const totalUsers = authData?.users?.length || 0;
        
        if (authError) {
          console.error("Error counting users:", authError);
        }
        
        // Count active users (signed in in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeUsers = authData?.users?.filter(user => {
          const lastSignIn = user.last_sign_in_at || user.created_at;
          return new Date(lastSignIn) > thirtyDaysAgo;
        }).length || 0;
        
        // Count total habits
        const { count: totalHabits, error: habitsError } = await adminSupabase
          .from("habits")
          .select("*", { count: "exact", head: true });
        
        if (habitsError) {
          console.error("Error counting habits:", habitsError);
        }
        
        // Count total completions
        const { count: totalCompletions, error: completionsError } = await adminSupabase
          .from("habit_logs")
          .select("*", { count: "exact", head: true });
        
        if (completionsError) {
          console.error("Error counting completions:", completionsError);
        }
        
        return {
          totalUsers,
          activeUsers,
          totalHabits: totalHabits || 0,
          totalCompletions: totalCompletions || 0
        };
      } catch (error) {
        console.error("Error in admin stats query:", error);
        return {
          totalUsers: 0,
          activeUsers: 0,
          totalHabits: 0,
          totalCompletions: 0
        };
      }
    }
  });

  // Fetch achievements using admin client
  const { data: achievements = [], isLoading: isLoadingAchievements, refetch: refetchAchievements } = useQuery({
    queryKey: ["adminAchievements"],
    queryFn: async () => {
      const { data, error } = await adminSupabase
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
