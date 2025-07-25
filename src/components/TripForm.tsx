import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGemini } from "@/hooks/useGemini";
import { Trip } from "@/hooks/useTrips";
import { Sparkles, Loader2 } from "lucide-react";

interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: any) => Promise<void>;
  onCancel: () => void;
}

export const TripForm = ({ trip, onSubmit, onCancel }: TripFormProps) => {
  const { toast } = useToast();
  const { generateContent, isLoading: geminiLoading } = useGemini();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: trip?.title || "",
    description: trip?.description || "",
    destination: trip?.destination || "",
    start_date: trip?.start_date || "",
    end_date: trip?.end_date || "",
    budget: trip?.budget?.toString() || "",
    ai_suggestions: trip?.ai_suggestions || ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAISuggestions = async () => {
    if (!formData.destination) {
      toast({
        title: "Missing destination",
        description: "Please enter a destination first",
        variant: "destructive"
      });
      return;
    }

    try {
      const prompt = `Generate travel suggestions for a trip to ${formData.destination}${formData.budget ? ` with a budget of $${formData.budget}` : ''}${formData.start_date && formData.end_date ? ` from ${formData.start_date} to ${formData.end_date}` : ''}. Include top attractions, local cuisine recommendations, and practical tips. Keep it concise but helpful.`;
      
      const suggestions = await generateContent(prompt);
      setFormData(prev => ({ ...prev, ai_suggestions: suggestions }));
      
      toast({
        title: "AI suggestions generated!",
        description: "Travel recommendations have been added to your trip"
      });
    } catch (error) {
      toast({
        title: "Failed to generate suggestions",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.destination) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and destination",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      });
      
      toast({
        title: trip ? "Trip updated!" : "Trip created!",
        description: "Your trip has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{trip ? "Edit Trip" : "Create New Trip"}</CardTitle>
        <CardDescription>
          Plan your perfect trip with AI-powered suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Trip Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="My Amazing Trip"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              placeholder="Paris, France"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Tell us about your trip..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder="1000.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai_suggestions">AI Travel Suggestions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAISuggestions}
                disabled={geminiLoading || !formData.destination}
              >
                {geminiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate AI Suggestions
              </Button>
            </div>
            <Textarea
              id="ai_suggestions"
              value={formData.ai_suggestions}
              onChange={(e) => handleChange("ai_suggestions", e.target.value)}
              placeholder="AI-generated travel suggestions will appear here..."
              rows={5}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                trip ? "Update Trip" : "Create Trip"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};