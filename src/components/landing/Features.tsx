
import { Check, Zap, TrendingUp, MoveHorizontal } from "lucide-react";

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Build Better Habits
          </h2>
          <p className="text-muted-foreground">
            Itracker provides all the tools you need to build lasting habits and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          <FeatureBlock
            icon={<Check className="h-6 w-6 text-primary" />}
            title="Habit Tracking"
            description="Track your daily habits with a simple check-in system. Build streaks and never break the chain."
          />
          <FeatureBlock
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            title="Progress Visualization"
            description="See your progress over time with intuitive charts and analytics that keep you motivated."
          />
          <FeatureBlock
            icon={<MoveHorizontal className="h-6 w-6 text-primary" />}
            title="Flexible Goals"
            description="Set daily, weekly, or monthly goals. Adjust as needed and stay on track with your personal targets."
          />
          <FeatureBlock
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Motivation Boosters"
            description="Get reminders, achievements, and motivation boosts to keep your habit-building journey exciting."
          />
        </div>

        <div className="mt-20 glass-card rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">
                Track Your Progress Anywhere
              </h3>
              <p className="text-muted-foreground mb-6">
                Itracker works on all your devices, so you can track your habits and goals wherever you are. Stay consistent and never miss a day.
              </p>
              <ul className="space-y-3">
                {["Beautiful dashboard view", "Daily, weekly and monthly insights", "Goal completion tracking", "Custom habit categories"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 lg:p-12 flex items-center justify-center">
              {/* This would typically be a screenshot or illustration */}
              <div className="glass-card rounded-lg w-full max-w-md aspect-[4/3] flex items-center justify-center border border-white/10">
                <p className="text-muted-foreground text-sm">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureBlock = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="p-6 rounded-lg bg-card border border-border/50">
      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-secondary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Features;
