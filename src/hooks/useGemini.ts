import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (prompt: string, model = 'gemini-2.0-flash-exp') => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('generate-with-gemini', {
        body: { prompt, model }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data.generatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    isLoading,
    error
  };
};