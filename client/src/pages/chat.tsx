import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ChatMessage as ChatMessageType, ChatSettings } from "@shared/schema";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";
import TypingIndicator from "@/components/chat/typing-indicator";
import ConnectionControls from "@/components/chat/connection-controls";
import FontSelector, { availableFonts } from "@/components/chat/font-selector";
import { Card } from "@/components/ui/card";
import { MessageCircle, Bot, Heart, Sparkles, Star } from "lucide-react";

export default function ChatPage() {
  const [selectedMode, setSelectedMode] = useState<'ollama' | 'lmstudio'>('ollama');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessageType[]>({
    queryKey: ['/api/messages'],
  });

  // Fetch chat settings
  const { data: settings } = useQuery<ChatSettings>({
    queryKey: ['/api/settings'],
  });

  // Fetch available models
  const { data: modelsData, refetch: refetchModels } = useQuery<{models: string[], connected: boolean}>({
    queryKey: ['/api/models', selectedMode],
    enabled: !!selectedMode,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<ChatSettings>) => {
      const response = await apiRequest('POST', '/api/settings', newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, mode, model }: { content: string; mode: string; model: string }) => {
      const response = await apiRequest('POST', '/api/chat', { content, mode, model });
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize from settings
  useEffect(() => {
    if (settings) {
      setSelectedMode(settings.selectedMode as 'ollama' | 'lmstudio');
      setSelectedModel(settings.selectedModel);
      setSelectedFont(settings.selectedFont);
    }
  }, [settings]);

  // Set first available model when models load
  useEffect(() => {
    if (modelsData?.models && modelsData.models.length > 0 && !selectedModel) {
      setSelectedModel(modelsData.models[0]);
    }
  }, [modelsData, selectedModel]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !selectedModel) return;
    
    sendMessageMutation.mutate({
      content: content.trim(),
      mode: selectedMode,
      model: selectedModel,
    });
  };

  const handleModeChange = (mode: 'ollama' | 'lmstudio') => {
    setSelectedMode(mode);
    setSelectedModel('');
    updateSettingsMutation.mutate({
      selectedMode: mode,
      selectedModel: '',
      isConnected: modelsData?.connected || false,
      selectedFont,
    });
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    updateSettingsMutation.mutate({
      selectedMode,
      selectedModel: model,
      isConnected: modelsData?.connected || false,
      selectedFont,
    });
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    updateSettingsMutation.mutate({
      selectedMode,
      selectedModel,
      isConnected: modelsData?.connected || false,
      selectedFont: font,
    });
  };

  // Get font class name for dynamic application
  const getFontClassName = (fontName: string) => {
    const fontMap: Record<string, string> = {
      'Inter': 'font-inter',
      'Noto Sans JP': 'font-noto-sans-jp',
      'Roboto': 'font-roboto',
      'Lato': 'font-lato',
      'Open Sans': 'font-open-sans',
      'Source Code Pro': 'font-source-code-pro',
    };
    return fontMap[fontName] || 'font-inter';
  };

  if (messagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-user-green"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen max-w-4xl mx-auto ${getFontClassName(selectedFont)} bg-gradient-to-br from-cute-pink/5 to-cute-purple/5`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-slate to-medium-gray text-white p-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cute-purple/10 to-cute-pink/10"></div>
        <div className="absolute top-2 right-4">
          <Sparkles className="h-4 w-4 text-cute-yellow animate-pulse-cute" />
        </div>
        <div className="absolute bottom-2 left-4">
          <Star className="h-3 w-3 text-cute-pink animate-wiggle" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-7 w-7 animate-wiggle" />
              <Heart className="h-3 w-3 text-cute-pink absolute -top-1 -right-1 animate-pulse-cute" />
            </div>
            <h1 className="text-xl font-bold text-pink-600 drop-shadow-lg">
              ✨ ローカルAIチャット ✨
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <ConnectionControls
              selectedMode={selectedMode}
              selectedModel={selectedModel}
              models={modelsData?.models || []}
              isConnected={modelsData?.connected || false}
              onModeChange={handleModeChange}
              onModelChange={handleModelChange}
              onRefreshModels={() => refetchModels()}
            />
            
            <FontSelector
              selectedFont={selectedFont}
              onFontChange={handleFontChange}
            />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cute-pink to-cute-purple rounded-full mb-6 shadow-xl animate-pulse-cute">
                <MessageCircle className="h-10 w-10 text-white animate-wiggle" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cute-yellow rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-cute-blue rounded-full animate-bounce-cute"></div>
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cute-purple to-cute-pink bg-clip-text text-transparent">
                ✨ ローカルAIアシスタントへようこそ! ✨
              </h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                💝 プライベートでオフライン対応の環境で、AIアシスタントと安全に会話できます。
                <br />
                🌸 下のメッセージボックスから会話を始めてください。
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Sparkles className="h-4 w-4 text-cute-pink animate-bounce-cute" />
                <Star className="h-4 w-4 text-cute-purple animate-pulse-cute" />
                <Sparkles className="h-4 w-4 text-cute-blue animate-bounce-cute" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending || !selectedModel}
          placeholder={
            !selectedModel 
              ? "モデルを選択してください..."
              : "メッセージを入力してください..."
          }
        />
      </main>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-cute-pink/10 to-cute-purple/10 px-4 py-3 text-xs border-t-2 border-cute-pink/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cute-yellow/5 to-cute-blue/5"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-3 w-3 text-cute-purple animate-pulse-cute" />
            <span className="text-cute-purple font-medium">
              💖 使用中: {selectedModel || 'なし'} ({selectedMode === 'ollama' ? 'Ollama' : 'LM Studio'})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${modelsData?.connected ? 'bg-cute-purple animate-pulse-cute' : 'bg-gray-400'}`}></div>
            <span className={modelsData?.connected ? 'text-cute-purple font-medium' : 'text-gray-500'}>
              {modelsData?.connected ? '🌟 接続済み' : '💔 未接続'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
