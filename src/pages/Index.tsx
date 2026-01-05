import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { translations, type Language } from '@/i18n/translations';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { TabContent } from '@/components/TabContent';

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

type Theme = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

const themes: Theme[] = [
  {
    id: 'purple-dream',
    name: 'Фиолетовая мечта',
    colors: { primary: '263 70% 65%', secondary: '328 85% 60%', accent: '200 100% 50%' }
  },
  {
    id: 'ocean-breeze',
    name: 'Океанский бриз',
    colors: { primary: '200 100% 50%', secondary: '180 100% 40%', accent: '160 100% 45%' }
  },
  {
    id: 'sunset-glow',
    name: 'Закатное сияние',
    colors: { primary: '25 95% 53%', secondary: '340 82% 52%', accent: '280 87% 65%' }
  },
  {
    id: 'forest-magic',
    name: 'Лесная магия',
    colors: { primary: '142 76% 36%', secondary: '120 100% 25%', accent: '88 50% 53%' }
  },
  {
    id: 'midnight-sky',
    name: 'Полуночное небо',
    colors: { primary: '230 35% 50%', secondary: '250 60% 60%', accent: '190 95% 40%' }
  },
  {
    id: 'cherry-blossom',
    name: 'Сакура',
    colors: { primary: '340 75% 55%', secondary: '320 70% 65%', accent: '10 80% 60%' }
  }
];

type InterfaceSize = 'auto' | 'compact' | 'normal' | 'large';

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Новый чат',
      messages: [{
        id: '1',
        role: 'assistant',
        content: 'Привет! Я AI-ассистент с GPT. Задавай любые вопросы, буду рад помочь!',
        timestamp: new Date(),
      }],
      createdAt: new Date(),
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('purple-dream');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');
  const [interfaceSize, setInterfaceSize] = useState<InterfaceSize>('auto');

  const t = translations[language];
  const currentChat = chats.find(c => c.id === currentChatId) || chats[0];

  useEffect(() => {
    const selectedTheme = themes.find(t => t.id === theme);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary', selectedTheme.colors.primary);
      document.documentElement.style.setProperty('--secondary', selectedTheme.colors.secondary);
      document.documentElement.style.setProperty('--accent', selectedTheme.colors.accent);
    }
  }, [theme]);

  useEffect(() => {
    const sizeMap = {
      auto: '16px',
      compact: '14px',
      normal: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizeMap[interfaceSize];
  }, [interfaceSize]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setChats(chats.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    setInput('');
    setIsLoading(true);

    try {
      const chatMessages = [...currentChat.messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://functions.poehali.dev/95f5cb78-65a9-4cf4-8f2c-41d516db1697', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages })
      });

      const data = await response.json();

      if (data.message) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };

        setChats(chats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, userMessage, aiResponse] }
            : chat
        ));
      } else if (data.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${language === 'ru' ? 'Ошибка' : 'Error'}: ${data.error}`,
          timestamp: new Date(),
        };
        setChats(chats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, userMessage, errorMessage] }
            : chat
        ));
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'ru' ? 'Извините, произошла ошибка при обработке запроса.' : 'Sorry, an error occurred while processing the request.',
        timestamp: new Date(),
      };
      setChats(chats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, userMessage, errorMessage] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `${t.chat} ${chats.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        role: 'assistant',
        content: language === 'ru' ? 'Здравствуйте! Чем могу помочь?' : 'Hello! How can I help you?',
        timestamp: new Date(),
      }],
      createdAt: new Date(),
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
    setActiveTab('chat');
    setIsSidebarOpen(false);
  };

  const deleteChat = (chatId: string) => {
    if (chats.length === 1) return;
    const newChats = chats.filter(c => c.id !== chatId);
    setChats(newChats);
    if (currentChatId === chatId) {
      setCurrentChatId(newChats[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatSidebar
                chats={chats}
                currentChatId={currentChatId}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                setCurrentChatId={setCurrentChatId}
                setActiveTab={setActiveTab}
                createNewChat={createNewChat}
                deleteChat={deleteChat}
                newChatLabel={t.newChat}
                messagesLabel={t.messages}
              />
              
              <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow flex items-center justify-center animate-float">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">{t.aiStudio}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 transition-all hover:scale-110"
                onClick={() => setActiveTab('settings')}
              >
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:ml-64 container mx-auto px-4 py-8">
        <div className="w-full">
          <div className="grid w-full grid-cols-3 sm:grid-cols-5 mb-8 bg-card border border-border rounded-lg p-1 animate-scale-in">
            {[
              { id: 'about', label: t.about, icon: 'Info' },
              { id: 'chat', label: t.chat, icon: 'MessageSquare' },
              { id: 'history', label: t.history, icon: 'Clock' },
              { id: 'faq', label: t.faq, icon: 'HelpCircle' },
              { id: 'settings', label: t.settings, icon: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'gradient-primary text-white shadow-lg glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab.icon as any} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'chat' ? (
            <ChatWindow
              currentChat={currentChat}
              isLoading={isLoading}
              handleSend={handleSend}
              messagesLabel={t.messages}
              placeholderLabel={t.placeholder}
            />
          ) : (
            <TabContent
              activeTab={activeTab}
              chats={chats}
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              interfaceSize={interfaceSize}
              setInterfaceSize={setInterfaceSize}
              themes={themes}
              t={t}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
