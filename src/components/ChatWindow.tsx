import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

interface ChatWindowProps {
  currentChat: Chat;
  isLoading: boolean;
  handleSend: () => void;
  messagesLabel: string;
  placeholderLabel: string;
}

export const ChatWindow = ({
  currentChat,
  isLoading,
  handleSend,
  messagesLabel,
  placeholderLabel
}: ChatWindowProps) => {
  const [input, setInput] = useState('');

  const onSend = () => {
    handleSend();
    setInput('');
  };

  return (
    <div className="animate-scale-in">
      <Card className="h-[600px] flex flex-col bg-card/50 backdrop-blur-sm border-border transition-all duration-300 hover:glow">
        <div className="p-4 border-b border-border flex items-center justify-between animate-slide-down">
          <h3 className="font-semibold">{currentChat.title}</h3>
          <span className="text-xs text-muted-foreground">
            {currentChat.messages.length} {messagesLabel}
          </span>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {currentChat.messages.map((message, index) => (
              <div
                key={message.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 transition-all duration-300 hover:scale-102 ${
                    message.role === 'user'
                      ? 'gradient-primary text-white glow-hover'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-scale-in">
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border animate-slide-up">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={placeholderLabel}
              className="resize-none bg-muted/50 border-border focus:border-primary transition-all duration-300"
              rows={3}
              disabled={isLoading}
            />
            <Button
              onClick={onSend}
              disabled={isLoading || !input.trim()}
              className="gradient-primary text-white hover:scale-110 transition-all duration-300 h-auto glow-hover"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
