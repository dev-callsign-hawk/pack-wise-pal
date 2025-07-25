import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Trash2, Edit } from "lucide-react";
import { Trip } from "@/hooks/useTrips";

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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{trip.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {trip.destination}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(trip)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(trip.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
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
          <div className="mt-3 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-1">AI Suggestions</h4>
            <p className="text-sm text-muted-foreground">{trip.ai_suggestions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};