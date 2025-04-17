
import { Card, CardContent } from "@/components/ui/card";
import { Users, BarChart3, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type DashboardStatsProps = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalHabits: number;
    totalCompletions: number;
  };
  isLoading: boolean;
};

const AdminDashboard = ({ stats, isLoading }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalUsers}</div>
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
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeUsers}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <BarChart3 className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalHabits}</div>
            <p className="text-sm text-muted-foreground">Total Habits</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Database className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalCompletions}</div>
            <p className="text-sm text-muted-foreground">Completions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
