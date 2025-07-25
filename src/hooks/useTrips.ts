import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Trip {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  ai_suggestions?: string;
  created_at: string;
  updated_at: string;
}

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setTrips(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trips';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('trips')
        .insert([tripData])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      setTrips(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create trip';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      setTrips(prev => prev.map(trip => trip.id === id ? data : trip));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update trip';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete trip';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    isLoading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
    refetch: fetchTrips
  };
};