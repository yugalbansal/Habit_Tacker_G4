
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    appName: "Itracker",
    maintenanceMode: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Configure global application settings
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="appName">Application Name</Label>
            <Input 
              id="appName" 
              value={settings.appName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="maintenanceMode" 
                className="rounded"
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
              <Label htmlFor="maintenanceMode">Enable maintenance mode</Label>
            </div>
          </div>
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
