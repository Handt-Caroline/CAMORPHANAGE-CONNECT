'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MessageInterfaceProps {
  currentUser: any;
  recipient: any;
  recipientProfile: any;
  senderProfile: any;
}

export default function MessageInterface({ 
  currentUser, 
  recipient, 
  recipientProfile, 
  senderProfile 
}: MessageInterfaceProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !subject.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: recipient.id,
          subject: subject.trim(),
          content: message.trim(),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setMessage('');
        setSubject('');
        setTimeout(() => {
          router.push('/messages');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h2>
        <p className="text-green-600">Your message has been sent successfully.</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Message</h1>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
            {currentUser.role === 'ORGANIZATION' ? '🏠' : '🏢'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              To: {recipientProfile.name}
            </p>
            <p className="text-sm text-gray-600">
              {currentUser.role === 'ORGANIZATION' ? 'Orphanage' : 'Organization'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter message subject..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message here..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSend}
            disabled={!message.trim() || !subject.trim() || isSending}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
          
          <button
            onClick={() => router.back()}
            className="px-6 py-4 bg-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
