import { createContext, useContext, useState, ReactNode } from 'react';
import { whatsappService } from '../services/whatsappService';
import { useToast } from '../hooks/use-toast';

interface WhatsAppContextType {
  sendMessage: (params: {
    to: string;
    message: string;
    listingId: string;
    listingTitle: string;
  }) => Promise<{ success: boolean; whatsappUrl: string }>;
  getMessages: (listingId: string) => Promise<any[]>;
  isLoading: boolean;
  error: string | null;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async ({
    to,
    message,
    listingId,
    listingTitle,
  }: {
    to: string;
    message: string;
    listingId: string;
    listingTitle: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await whatsappService.sendMessage({
        to,
        message,
        listingId,
        listingTitle,
      });
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully.',
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getMessages = async (listingId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const messages = await whatsappService.getMessages(listingId);
      return messages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WhatsAppContext.Provider
      value={{
        sendMessage,
        getMessages,
        isLoading,
        error,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
} 