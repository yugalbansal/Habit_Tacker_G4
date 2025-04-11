
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserTable from "@/components/admin/UserTable";
import { Users, BarChart3, Settings, Database } from "lucide-react";

const Admin = () => {
  // Sample users data for demonstration
  const users = [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "active" as const,
      joinDate: "Apr 10, 2023",
      habitsCount: 8,
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "active" as const,
      joinDate: "Feb 15, 2023",
      habitsCount: 5,
    },
    {
      id: "3",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      status: "inactive" as const,
      joinDate: "Jan 7, 2023",
      habitsCount: 0,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      status: "active" as const,
      joinDate: "Mar 22, 2023",
      habitsCount: 12,
    },
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Badge className="mb-2" variant="outline">
                    Active
                  </Badge>
                  <div className="text-2xl font-bold">
                    {users.filter((u) => u.status === "active").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-sm text-muted-foreground">Total Habits</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Database className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-sm text-muted-foreground">Completions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="mb-8">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Statistics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <UserTable users={users} />
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    View detailed statistics about application usage
                  </p>
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Statistics will be available once connected to Supabase
                    </p>
                    <Button className="mt-4">Connect Supabase</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure global application settings
                  </p>
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Admin settings will be available once connected to Supabase
                    </p>
                    <Button className="mt-4">Connect Supabase</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
