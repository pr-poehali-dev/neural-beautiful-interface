import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translations, type Language } from '@/i18n/translations';

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
                        {t.newChat}
                      </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
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
                                {chat.messages.length} {t.messages}
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
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
              
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

      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-card/50 backdrop-blur-sm animate-slide-up">
        <div className="h-full flex flex-col p-4">
          <Button onClick={createNewChat} className="w-full gradient-primary text-white mb-4 hover:scale-105 transition-transform glow-hover">
            <Icon name="Plus" size={20} className="mr-2" />
            {t.newChat}
          </Button>
          <ScrollArea className="flex-1">
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
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {chat.messages.length} {t.messages}
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
          </ScrollArea>
        </div>
      </div>

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

          {activeTab === 'about' && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:glow transition-all duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 animate-slide-up">
                    <div className="w-16 h-16 rounded-2xl gradient-secondary animate-pulse-glow flex items-center justify-center animate-float">
                      <Icon name="Sparkles" size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold gradient-text">{t.aiStudio}</h2>
                      <p className="text-muted-foreground">{t.modernPlatform}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                      { icon: 'MessageSquare', color: 'primary', title: t.smartAnswers, desc: t.smartAnswersDesc },
                      { icon: 'Layers', color: 'secondary', title: t.multipleChats, desc: t.multipleChatsDesc },
                      { icon: 'Palette', color: 'accent', title: t.personalization, desc: t.personalizationDesc },
                      { icon: 'Shield', color: 'primary', title: t.security, desc: t.securityDesc }
                    ].map((item, index) => (
                      <Card key={index} style={{ animationDelay: `${index * 0.1}s` }} className={`p-6 bg-muted/50 border-${item.color}/20 hover:border-${item.color}/50 transition-all duration-300 hover:scale-105 hover:glow animate-scale-in`}>
                        <Icon name={item.icon as any} size={32} className={`text-${item.color} mb-4 animate-bounce-soft`} />
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="animate-scale-in">
              <Card className="h-[600px] flex flex-col bg-card/50 backdrop-blur-sm border-border transition-all duration-300 hover:glow">
                <div className="p-4 border-b border-border flex items-center justify-between animate-slide-down">
                  <h3 className="font-semibold">{currentChat.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {currentChat.messages.length} {t.messages}
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
                          handleSend();
                        }
                      }}
                      placeholder={t.placeholder}
                      className="resize-none bg-muted/50 border-border focus:border-primary transition-all duration-300"
                      rows={3}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="gradient-primary text-white hover:scale-110 transition-all duration-300 h-auto glow-hover"
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:glow transition-all duration-500">
                <h2 className="text-2xl font-bold mb-6 gradient-text animate-slide-down">{t.historyAllChats}</h2>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {chats.map((chat, chatIndex) => (
                      <Card key={chat.id} style={{ animationDelay: `${chatIndex * 0.1}s` }} className="p-4 bg-muted/50 hover:scale-102 transition-all duration-300 animate-scale-in">
                        <h3 className="font-semibold mb-3 gradient-text">{chat.title}</h3>
                        <div className="space-y-3">
                          {chat.messages.map((message, msgIndex) => (
                            <div key={message.id} style={{ animationDelay: `${msgIndex * 0.03}s` }} className="flex items-start gap-3 animate-fade-in">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 ${
                                message.role === 'user' ? 'gradient-primary' : 'bg-secondary'
                              }`}>
                                <Icon name={message.role === 'user' ? 'User' : 'Bot'} size={16} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {message.role === 'user' ? t.you : 'AI'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{message.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:glow transition-all duration-500">
                <h2 className="text-3xl font-bold mb-6 gradient-text animate-slide-down">{t.faqTitle}</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {[
                    { q: t.faqQ1, a: t.faqA1 },
                    { q: t.faqQ2, a: t.faqA2 },
                    { q: t.faqQ3, a: t.faqA3 },
                    { q: t.faqQ4, a: t.faqA4 }
                  ].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} style={{ animationDelay: `${index * 0.1}s` }} className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-102 animate-scale-in">
                      <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:glow transition-all duration-500">
                <h2 className="text-3xl font-bold mb-6 gradient-text animate-slide-down">{t.settingsTitle}</h2>
                
                <div className="space-y-6">
                  <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <label className="text-sm font-medium mb-3 block">{t.languageLabel}</label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                      <SelectTrigger className="w-full transition-all hover:scale-102">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <label className="text-sm font-medium mb-3 block">{t.interfaceSizeLabel}</label>
                    <Select value={interfaceSize} onValueChange={(v) => setInterfaceSize(v as InterfaceSize)}>
                      <SelectTrigger className="w-full transition-all hover:scale-102">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">{t.sizeAuto}</SelectItem>
                        <SelectItem value="compact">{t.sizeCompact}</SelectItem>
                        <SelectItem value="normal">{t.sizeNormal}</SelectItem>
                        <SelectItem value="large">{t.sizeLarge}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <label className="text-sm font-medium mb-3 block">{t.themeLabel}</label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-full transition-all hover:scale-102">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${t.colors.primary})` }} />
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${t.colors.secondary})` }} />
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${t.colors.accent})` }} />
                              </div>
                              <span>{t.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {themes.map((t, index) => (
                      <Card
                        key={t.id}
                        style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                        onClick={() => setTheme(t.id)}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:scale-110 hover:glow animate-scale-in ${
                          theme === t.id ? 'ring-2 ring-primary glow' : ''
                        }`}
                      >
                        <div className="flex gap-2 mb-3">
                          <div className="w-full h-8 rounded animate-gradient" style={{ background: `linear-gradient(135deg, hsl(${t.colors.primary}) 0%, hsl(${t.colors.secondary}) 100%)` }} />
                        </div>
                        <p className="text-sm font-medium text-center">{t.name}</p>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-6 bg-muted/30 mt-8 animate-slide-up hover:scale-102 transition-all duration-300" style={{ animationDelay: '0.7s' }}>
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-primary mt-1 animate-bounce-soft" />
                      <div>
                        <h3 className="font-semibold mb-2">{t.additionalSettings}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t.additionalSettingsDesc}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
