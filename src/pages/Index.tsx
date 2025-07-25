import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTrips, Trip } from "@/hooks/useTrips";
import { TripCard } from "@/components/TripCard";
import { TripForm } from "@/components/TripForm";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Trips</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Plan and manage your travel adventures with AI assistance
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Trip
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No trips yet</h2>
            <p className="text-muted-foreground mb-6">
              Start planning your next adventure with AI-powered suggestions
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={handleEditTrip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
