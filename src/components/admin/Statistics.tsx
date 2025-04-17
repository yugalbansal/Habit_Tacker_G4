
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatisticsProps = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalHabits: number;
    totalCompletions: number;
  };
  isLoading: boolean;
};

const Statistics = ({ stats, isLoading }: StatisticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          View detailed statistics about application usage
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p>Loading statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">User Metrics</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Users:</dt>
                  <dd className="font-medium">{stats.totalUsers}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Active Users (30 days):</dt>
                  <dd className="font-medium">{stats.activeUsers}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Retention Rate:</dt>
                  <dd className="font-medium">
                    {stats.totalUsers > 0 
                      ? Math.round((stats.activeUsers / stats.totalUsers) * 100) 
                      : 0}%
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-medium mb-2">Activity Metrics</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Habits:</dt>
                  <dd className="font-medium">{stats.totalHabits}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total Completions:</dt>
                  <dd className="font-medium">{stats.totalCompletions}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Avg. Habits per User:</dt>
                  <dd className="font-medium">
                    {stats.totalUsers > 0 
                      ? (stats.totalHabits / stats.totalUsers).toFixed(1) 
                      : 0}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Statistics;
