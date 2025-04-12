
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import { useAuth } from "@/providers/AuthProvider";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Better Habits?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of others who are using Itracker to build better habits and achieve their goals.
            </p>
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Get Started"}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
