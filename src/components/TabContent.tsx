import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Language } from '@/i18n/translations';

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

type InterfaceSize = 'auto' | 'compact' | 'normal' | 'large';

interface TabContentProps {
  activeTab: string;
  chats: Chat[];
  theme: string;
  setTheme: (theme: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  interfaceSize: InterfaceSize;
  setInterfaceSize: (size: InterfaceSize) => void;
  themes: Theme[];
  t: any;
}

export const TabContent = ({
  activeTab,
  chats,
  theme,
  setTheme,
  language,
  setLanguage,
  interfaceSize,
  setInterfaceSize,
  themes,
  t
}: TabContentProps) => {
  if (activeTab === 'about') {
    return (
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
    );
  }

  if (activeTab === 'history') {
    return (
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
    );
  }

  if (activeTab === 'faq') {
    return (
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
    );
  }

  if (activeTab === 'settings') {
    return (
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
              {themes.map((themeItem, index) => (
                <Card
                  key={themeItem.id}
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  onClick={() => setTheme(themeItem.id)}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-110 hover:glow animate-scale-in ${
                    theme === themeItem.id ? 'ring-2 ring-primary glow' : ''
                  }`}
                >
                  <div className="flex gap-2 mb-3">
                    <div className="w-full h-8 rounded animate-gradient" style={{ background: `linear-gradient(135deg, hsl(${themeItem.colors.primary}) 0%, hsl(${themeItem.colors.secondary}) 100%)` }} />
                  </div>
                  <p className="text-sm font-medium text-center">{themeItem.name}</p>
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
    );
  }

  return null;
};
