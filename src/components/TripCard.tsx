import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Trash2, Edit, Sparkles } from "lucide-react";
import { Trip } from "@/hooks/useTrips";
import beachImage from "@/assets/destination-beach.jpg";
import mountainImage from "@/assets/destination-mountain.jpg";
import cityImage from "@/assets/destination-city.jpg";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

export const TripCard = ({ trip, onEdit, onDelete }: TripCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget);
  };

  const getDestinationImage = (destination: string) => {
    const dest = destination.toLowerCase();
    if (dest.includes('beach') || dest.includes('island') || dest.includes('coast')) {
      return beachImage;
    } else if (dest.includes('mountain') || dest.includes('alps') || dest.includes('peak')) {
      return mountainImage;
    } else {
      return cityImage;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getDestinationImage(trip.destination)} 
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(trip)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDelete(trip.id)}
            className="bg-white/20 backdrop-blur-sm hover:bg-red-500/80 text-white border-white/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <CardTitle className="text-xl mb-1">{trip.title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-white/80">
            <MapPin className="h-4 w-4" />
            {trip.destination}
          </CardDescription>
        </div>
      </div>
      <CardContent>
        {trip.description && (
          <p className="text-sm text-muted-foreground mb-3">{trip.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {trip.start_date && trip.end_date && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </Badge>
          )}
          {trip.budget && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatBudget(trip.budget)}
            </Badge>
          )}
        </div>

        {trip.ai_suggestions && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-md border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
              AI Suggestions
            </h4>
            <p className="text-sm text-muted-foreground">{trip.ai_suggestions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};