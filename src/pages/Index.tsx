import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type GeneratedImage = {
  id: string;
  prompt: string;
  url: string;
  timestamp: Date;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я AI-ассистент с поддержкой GPT. Могу отвечать на вопросы и генерировать изображения. Чем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [gallery] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: 'Футуристический город',
      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
      timestamp: new Date(),
    },
    {
      id: '2',
      prompt: 'Космический пейзаж',
      url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Это демо-ответ от AI. В финальной версии здесь будет интеграция с GPT API.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI Studio</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/20 transition-colors">
                <Icon name="Settings" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/20 transition-colors">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-card border border-border animate-scale-in">
            <TabsTrigger value="about" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Info" size={16} className="mr-2" />О проекте
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="MessageSquare" size={16} className="mr-2" />Чат
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Image" size={16} className="mr-2" />Галерея
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Clock" size={16} className="mr-2" />История
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="HelpCircle" size={16} className="mr-2" />FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="animate-fade-in">
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
                    <Icon name="Image" size={32} className="text-secondary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Генерация изображений</h3>
                    <p className="text-muted-foreground">
                      Создание уникальных изображений по текстовым описаниям
                    </p>
                  </Card>

                  <Card className="p-6 bg-muted/50 border-accent/20 hover:border-accent/50 transition-all hover:glow">
                    <Icon name="Zap" size={32} className="text-accent mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Быстрая работа</h3>
                    <p className="text-muted-foreground">
                      Мгновенные ответы и обработка запросов в режиме реального времени
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
          </TabsContent>

          <TabsContent value="chat" className="animate-fade-in">
            <Card className="h-[600px] flex flex-col bg-card/50 backdrop-blur-sm border-border">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
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
                  />
                  <Button
                    onClick={handleSend}
                    className="gradient-primary text-white hover:opacity-90 transition-opacity h-auto glow-hover"
                  >
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden group cursor-pointer hover:glow transition-all animate-scale-in"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-medium">{image.prompt}</p>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="aspect-square border-2 border-dashed border-primary/50 flex items-center justify-center cursor-pointer hover:border-primary hover:glow transition-all group animate-scale-in">
                <div className="text-center">
                  <Icon name="Plus" size={48} className="text-primary mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-muted-foreground">Создать новое изображение</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h2 className="text-2xl font-bold mb-6 gradient-text">История взаимодействий</h2>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {messages.slice().reverse().map((message, index) => (
                    <Card key={message.id} className="p-4 bg-muted/50 hover:bg-muted/70 transition-colors animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.role === 'user' ? 'gradient-primary' : 'bg-secondary'
                        }`}>
                          <Icon name={message.role === 'user' ? 'User' : 'Bot'} size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {message.role === 'user' ? 'Вы' : 'AI Ассистент'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{message.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="animate-fade-in">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Часто задаваемые вопросы</h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    Как работает AI Studio?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    AI Studio использует передовые модели GPT для обработки текстовых запросов и генерации ответов.
                    Платформа интегрирована с современными AI-сервисами для обеспечения высокого качества ответов.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    Можно ли генерировать изображения?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Да, платформа поддерживает генерацию изображений по текстовым описаниям. Просто опишите
                    желаемое изображение в чате, и AI создаст уникальную картинку специально для вас.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    Сохраняется ли история разговоров?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Да, все ваши разговоры сохраняются в разделе "История". Вы можете вернуться к любому
                    предыдущему диалогу и продолжить общение с того места, где остановились.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    Какие языки поддерживаются?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    AI Studio поддерживает множество языков, включая русский, английский, испанский, французский
                    и многие другие. AI автоматически определяет язык вашего запроса.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-muted/50 px-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    Безопасны ли мои данные?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Абсолютно. Мы используем современные методы шифрования и защиты данных. Ваши разговоры
                    и личная информация надежно защищены и не передаются третьим лицам.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-8 right-8 z-50 animate-scale-in">
        <Button
          size="lg"
          className="rounded-full gradient-secondary text-white shadow-2xl hover:scale-110 transition-transform glow-hover"
        >
          <Icon name="Sparkles" size={24} className="mr-2" />
          Новый чат
        </Button>
      </div>
    </div>
  );
};

export default Index;
