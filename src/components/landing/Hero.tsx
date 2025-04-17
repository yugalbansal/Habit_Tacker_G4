
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Clock, Award } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden pt-20">
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
            Track Habits, Achieve Goals
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build better habits, break bad ones, and achieve your goals with our powerful tracking system designed to keep you motivated and consistent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard 
            icon={<BarChart className="h-6 w-6 text-primary" />}
            title="Visual Progress"
            description="Track your progress with beautiful, intuitive charts and visualizations."
          />
          <FeatureCard 
            icon={<Clock className="h-6 w-6 text-primary" />}
            title="Daily Tracking"
            description="Never miss a day with reminders and streak tracking."
          />
          <FeatureCard 
            icon={<Award className="h-6 w-6 text-primary" />}
            title="Goal Setting"
            description="Set and achieve your goals with our guided goal-setting system."
          />
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="glass-card rounded-lg p-6 flex flex-col items-center text-center">
      <div className="p-3 rounded-full bg-secondary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Hero;
