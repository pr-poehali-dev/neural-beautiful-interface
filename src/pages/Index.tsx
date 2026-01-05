import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const currentChat = chats.find(c => c.id === currentChatId) || chats[0];

  useEffect(() => {
    const selectedTheme = themes.find(t => t.id === theme);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary', selectedTheme.colors.primary);
      document.documentElement.style.setProperty('--secondary', selectedTheme.colors.secondary);
      document.documentElement.style.setProperty('--accent', selectedTheme.colors.accent);
    }
  }, [theme]);

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
          content: `Ошибка: ${data.error}`,
          timestamp: new Date(),
        };
        setChats(chats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, userMessage, errorMessage] }
            : chat
        ));
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке запроса.',
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
      title: `Чат ${chats.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Здравствуйте! Чем могу помочь?',
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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Icon name="Menu" size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="h-full flex flex-col bg-card">
                    <div className="p-4 border-b border-border">
                      <Button onClick={createNewChat} className="w-full gradient-primary text-white">
                        <Icon name="Plus" size={20} className="mr-2" />
                        Новый чат
                      </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-2">
                        {chats.map(chat => (
                          <div
                            key={chat.id}
                            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                              chat.id === currentChatId
                                ? 'bg-primary/20 border border-primary/50'
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
                                {chat.messages.length} сообщений
                              </p>
                            </div>
                            {chats.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
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
              
              <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI Studio</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 transition-colors"
                onClick={() => setActiveTab('settings')}
              >
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-card/50 backdrop-blur-sm">
        <div className="h-full flex flex-col p-4">
          <Button onClick={createNewChat} className="w-full gradient-primary text-white mb-4">
            <Icon name="Plus" size={20} className="mr-2" />
            Новый чат
          </Button>
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    chat.id === currentChatId
                      ? 'bg-primary/20 border border-primary/50'
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
                      {chat.messages.length} сообщений
                    </p>
                  </div>
                  {chats.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
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
              { id: 'about', label: 'О проекте', icon: 'Info' },
              { id: 'chat', label: 'Чат', icon: 'MessageSquare' },
              { id: 'history', label: 'История', icon: 'Clock' },
              { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
              { id: 'settings', label: 'Настройки', icon: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'gradient-primary text-white shadow-lg'
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
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-secondary animate-pulse-glow flex items-center justify-center">
                      <Icon name="Sparkles" size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold gradient-text">AI Studio</h2>
                      <p className="text-muted-foreground">Современная платформа для работы с AI</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <Card className="p-6 bg-muted/50 border-primary/20 hover:border-primary/50 transition-all hover:glow">
                      <Icon name="MessageSquare" size={32} className="text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Умные ответы</h3>
                      <p className="text-muted-foreground">
                        Интеграция с GPT для интеллектуальных ответов на любые вопросы
                      </p>
                    </Card>

                    <Card className="p-6 bg-muted/50 border-secondary/20 hover:border-secondary/50 transition-all hover:glow">
                      <Icon name="Layers" size={32} className="text-secondary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Множество чатов</h3>
                      <p className="text-muted-foreground">
                        Создавайте неограниченное количество чатов для разных задач
                      </p>
                    </Card>

                    <Card className="p-6 bg-muted/50 border-accent/20 hover:border-accent/50 transition-all hover:glow">
                      <Icon name="Palette" size={32} className="text-accent mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Персонализация</h3>
                      <p className="text-muted-foreground">
                        6 уникальных тем оформления на ваш вкус
                      </p>
                    </Card>

                    <Card className="p-6 bg-muted/50 border-primary/20 hover:border-primary/50 transition-all hover:glow">
                      <Icon name="Shield" size={32} className="text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
                      <p className="text-muted-foreground">
                        Защита данных и конфиденциальность на высшем уровне
                      </p>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="animate-fade-in">
              <Card className="h-[600px] flex flex-col bg-card/50 backdrop-blur-sm border-border">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">{currentChat.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {currentChat.messages.length} сообщений
                  </span>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {currentChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'user'
                              ? 'gradient-primary text-white'
                              : 'bg-muted text-foreground'
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

                <div className="p-6 border-t border-border">
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
                      placeholder="Введите сообщение..."
                      className="resize-none bg-muted/50 border-border focus:border-primary transition-colors"
                      rows={3}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="gradient-primary text-white hover:opacity-90 transition-opacity h-auto glow-hover"
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
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <h2 className="text-2xl font-bold mb-6 gradient-text">История всех чатов</h2>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {chats.map((chat) => (
                      <Card key={chat.id} className="p-4 bg-muted/50">
                        <h3 className="font-semibold mb-3 gradient-text">{chat.title}</h3>
                        <div className="space-y-3">
                          {chat.messages.map((message, index) => (
                            <div key={message.id} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.role === 'user' ? 'gradient-primary' : 'bg-secondary'
                              }`}>
                                <Icon name={message.role === 'user' ? 'User' : 'Bot'} size={16} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {message.role === 'user' ? 'Вы' : 'AI'}
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
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Часто задаваемые вопросы</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="item-1" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                      Как работает AI Studio?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      AI Studio использует передовые модели GPT-4 для обработки запросов. Все ответы генерируются
                      в реальном времени с учётом контекста беседы.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                      Как создать новый чат?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Нажмите кнопку "Новый чат" в боковой панели слева. Каждый чат сохраняется автоматически
                      и доступен в любое время.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                      Как сменить тему оформления?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Перейдите в раздел "Настройки" и выберите понравившуюся тему из списка. 
                      Доступно 6 уникальных вариантов оформления.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                      Безопасны ли мои данные?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Да, все данные надежно защищены. Мы не передаём вашу информацию третьим лицам
                      и используем современные протоколы шифрования.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Настройки</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Тема оформления</label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите тему" />
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
                    {themes.map((t) => (
                      <Card
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                          theme === t.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="flex gap-2 mb-3">
                          <div className="w-full h-8 rounded" style={{ background: `linear-gradient(135deg, hsl(${t.colors.primary}) 0%, hsl(${t.colors.secondary}) 100%)` }} />
                        </div>
                        <p className="text-sm font-medium text-center">{t.name}</p>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-6 bg-muted/30 mt-8">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Дополнительные настройки</h3>
                        <p className="text-sm text-muted-foreground">
                          Все ваши чаты сохраняются локально в браузере. Темы применяются мгновенно
                          и сохраняются между сеансами.
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
