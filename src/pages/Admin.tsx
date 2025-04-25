import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserTable from "@/components/admin/UserTable";
import { Users, BarChart3, Settings, Award } from "lucide-react";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import { useQuery } from "@tanstack/react-query";
import AdminDashboard from "@/components/admin/Dashboard";
import Statistics from "@/components/admin/Statistics";
import AchievementsManager from "@/components/admin/AchievementsManager";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { Achievement } from "@/types/achievement";
import { AuthUser } from "@supabase/supabase-js";

type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  joinDate: string;
  habitsCount: number;
};

const Admin = () => {
  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        const { data: { users: authUsers }, error: authUsersError } = await adminSupabase.auth.admin.listUsers();
        
        if (authUsersError) {
          console.error("Error fetching auth users:", authUsersError);
          return [];
        }
        
        console.log("Fetched auth users:", authUsers?.length);
        
        if (!authUsers?.length) {
          return [];
        }
        
        const { data: profiles, error: profilesError } = await adminSupabase
          .from("profiles")
          .select("*");
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }
        
        console.log("Fetched profiles:", profiles?.length);
        
        const profilesMap = (profiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
        
        const enhancedUsers = await Promise.all(
          authUsers.map(async (user: AuthUser) => {
            const profile = profilesMap[user.id];
            
            const { count: habitsCount, error: habitsError } = await adminSupabase
              .from("habits")
              .select("*", { count: "exact", head: true })
              .eq("user_id", user.id);
            
            if (habitsError) {
              console.error(`Error fetching habits for user ${user.id}:`, habitsError);
            }
            
            return {
              id: user.id,
              name: profile?.full_name || "Unnamed User",
              email: user.email || `User ${user.id.substring(0, 8)}`,
              status: user.last_sign_in_at && 
                new Date(user.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                ? "active" as const 
                : "inactive" as const,
              joinDate: new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              habitsCount: habitsCount || 0
            };
          })
        );
        
        return enhancedUsers;
      } catch (error) {
        console.error("Error in admin users query:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  // ... keep existing code (stats query and other functionality)

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
