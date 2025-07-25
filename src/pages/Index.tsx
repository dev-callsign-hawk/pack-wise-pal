import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useTrips, Trip } from "@/hooks/useTrips";
import { TripCard } from "@/components/TripCard";
import { TripForm } from "@/components/TripForm";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-travel.jpg";

const Index = () => {
  const { trips, isLoading, createTrip, updateTrip, deleteTrip } = useTrips();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const handleCreateTrip = async (tripData: any) => {
    await createTrip(tripData);
    setShowForm(false);
  };

  const handleUpdateTrip = async (tripData: any) => {
    if (editingTrip) {
      await updateTrip(editingTrip.id, tripData);
      setEditingTrip(null);
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      await deleteTrip(id);
      toast({
        title: "Trip deleted",
        description: "Your trip has been successfully deleted"
      });
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <TripForm
          onSubmit={handleCreateTrip}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (editingTrip) {
    return (
      <div className="min-h-screen bg-background p-4">
        <TripForm
          trip={editingTrip}
          onSubmit={handleUpdateTrip}
          onCancel={() => setEditingTrip(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Travel Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              My Trips
            </h1>
            <p className="text-xl mb-6">
              Plan and manage your travel adventures with AI assistance
            </p>
            <Button 
              onClick={() => setShowForm(true)} 
              size="lg"
              className="bg-white text-black hover:bg-white/90 animate-scale-in"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Trip
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">No trips yet</h2>
            <p className="text-muted-foreground mb-6">
              Start planning your next adventure with AI-powered suggestions
            </p>
            <Button onClick={() => setShowForm(true)} className="hover-scale">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <div 
                key={trip.id} 
                className="animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TripCard
                  trip={trip}
                  onEdit={handleEditTrip}
                  onDelete={handleDeleteTrip}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
