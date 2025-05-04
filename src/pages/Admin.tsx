import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/admin/Dashboard";
import UserTable from "@/components/admin/UserTable";
import Statistics from "@/components/admin/Statistics";
import AchievementsManager from "@/components/admin/AchievementsManager";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { Achievement } from "@/types/achievement";
import { AuthUser } from "@supabase/supabase-js";

type AdminUser = {
  id: string;
  email: string;
  lastSignIn: string | null;
  habits: number;
  completions: number;
  joinDate: string;
  fullName: string | null;
  avatarUrl: string | null;
};

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);

  const fetchAchievements = async () => {
    setIsLoadingAchievements(true);
    const { data, error } = await adminSupabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });
    setIsLoadingAchievements(false);

    if (error) {
      console.error("Error fetching achievements:", error);
      return;
    }

    setAchievements(data as Achievement[]);
  };

  const refetchAchievements = () => {
    fetchAchievements();
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUserId(session.user.id);

        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          return;
        }

        const isAdminUser = roles && roles.some(role => role.role === 'admin');
        setIsAdmin(isAdminUser);
      }
    };

    getSession();
    fetchAchievements();
  }, []);

  const { data: adminStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { count: totalUsers } = await adminSupabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: activeUsers } = await adminSupabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const { count: totalHabits } = await adminSupabase
        .from("habits")
        .select("*", { count: "exact", head: true });

      const { count: totalCompletions } = await adminSupabase
        .from("habit_logs")
        .select("*", { count: "exact", head: true });

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalHabits: totalHabits || 0,
        totalCompletions: totalCompletions || 0,
      };
    },
    enabled: isAdmin,
  });

  const { data: profiles = {} } = useQuery({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      const { data, error } = await adminSupabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
        return {};
      }

      const profilesMap = data.reduce((acc: { [key: string]: any }, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      return profilesMap;
    },
    enabled: isAdmin,
  });

  const { data: usersData = { users: [] }, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const { data: authUsers, error: authError } = await adminSupabase.auth.admin.listUsers();

      if (authError) {
        console.error("Error fetching auth users:", authError);
        return { users: [] };
      }

      const profilesMap = profiles;

      const enhancedUsers: AdminUser[] = await Promise.all(
        authUsers.users.map(async (user: AuthUser) => {
          const profile = profilesMap[user.id];
          
          const { count: habitsCount } = await adminSupabase
            .from("habits")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
            
          const { count: completionsCount } = await adminSupabase
            .from("habit_logs")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

          return {
            id: user.id,
            email: user.email || '',
            lastSignIn: user.last_sign_in_at,
            habits: habitsCount || 0,
            completions: completionsCount || 0,
            joinDate: new Date(user.created_at).toLocaleDateString(),
            fullName: profile?.full_name || null,
            avatarUrl: profile?.avatar_url || null,
          };
        })
      );

      return { users: enhancedUsers };
    },
    enabled: isAdmin,
  });

  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-20 pt-24">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, view statistics, and configure application settings
          </p>

          <Tabs defaultValue="dashboard" className="mt-8">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <Dashboard stats={adminStats || {
                totalUsers: 0,
                activeUsers: 0,
                totalHabits: 0,
                totalCompletions: 0
              }} isLoading={isLoadingStats} />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserTable users={usersData.users || []} isLoading={isLoadingUsers} />
            </TabsContent>

            <TabsContent value="statistics" className="mt-6">
              <Statistics stats={adminStats || {
                totalUsers: 0,
                activeUsers: 0,
                totalHabits: 0,
                totalCompletions: 0
              }} isLoading={isLoadingStats} />
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
