import { supabase } from '../lib/supabase';

interface WhatsAppMessage {
  to: string;
  message: string;
  listingId: string;
  listingTitle: string;
}

export const whatsappService = {
  async sendMessage({ to, message, listingId, listingTitle }: WhatsAppMessage) {
    try {
      // In a real implementation, you would call the WhatsApp Business API here
      // For now, we'll just log the message and store it in our database
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            to,
            message,
            listing_id: listingId,
            listing_title: listingTitle,
            sent_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Return a WhatsApp deep link for the user to open in their WhatsApp app
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${to}?text=${encodedMessage}`;
      
      return {
        success: true,
        whatsappUrl,
        messageId: data.id,
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  },

  async getMessages(listingId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('listing_id', listingId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },
}; 