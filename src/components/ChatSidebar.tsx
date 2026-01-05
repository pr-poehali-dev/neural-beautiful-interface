import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  setCurrentChatId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  newChatLabel: string;
  messagesLabel: string;
}

export const ChatSidebar = ({
  chats,
  currentChatId,
  isSidebarOpen,
  setIsSidebarOpen,
  setCurrentChatId,
  setActiveTab,
  createNewChat,
  deleteChat,
  newChatLabel,
  messagesLabel
}: ChatSidebarProps) => {
  const ChatList = () => (
    <div className="space-y-2">
      {chats.map((chat, index) => (
        <div
          key={chat.id}
          style={{ animationDelay: `${index * 0.05}s` }}
          className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-102 animate-fade-in ${
            chat.id === currentChatId
              ? 'bg-primary/20 border border-primary/50 glow'
              : 'hover:bg-muted/50'
          }`}
          onClick={() => {
            setCurrentChatId(chat.id);
            setActiveTab('chat');
            setIsSidebarOpen(false);
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{chat.title}</p>
            <p className="text-xs text-muted-foreground">
              {chat.messages.length} {messagesLabel}
            </p>
          </div>
          {chats.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-all hover:text-destructive hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            >
              <Icon name="Trash2" size={16} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden hover:scale-110 transition-transform">
            <Icon name="Menu" size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 animate-slide-up">
          <div className="h-full flex flex-col bg-card">
            <div className="p-4 border-b border-border">
              <Button onClick={createNewChat} className="w-full gradient-primary text-white hover:scale-105 transition-transform">
                <Icon name="Plus" size={20} className="mr-2" />
                {newChatLabel}
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <ChatList />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-card/50 backdrop-blur-sm animate-slide-up">
        <div className="h-full flex flex-col p-4">
          <Button onClick={createNewChat} className="w-full gradient-primary text-white mb-4 hover:scale-105 transition-transform glow-hover">
            <Icon name="Plus" size={20} className="mr-2" />
            {newChatLabel}
          </Button>
          <ScrollArea className="flex-1">
            <ChatList />
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
