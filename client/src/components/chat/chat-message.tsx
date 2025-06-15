import { ChatMessage as ChatMessageType } from "@shared/schema";
import { formatTime } from "@/lib/utils";
import { Bot, Heart, Sparkles } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const timestamp = formatTime(new Date(message.timestamp));

  if (isUser) {
    return (
      <div className="flex justify-end group">
        <div className="max-w-xs sm:max-w-md lg:max-w-lg">
          <div className="bg-user-green text-white rounded-3xl rounded-br-lg px-5 py-3 shadow-lg transform transition-all duration-200 hover:scale-[1.02] relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cute-pink rounded-full animate-pulse-cute opacity-70"></div>
            <div className="flex items-start gap-2">
              <Heart className="h-4 w-4 mt-1 text-pink-200 animate-pulse-cute flex-shrink-0" />
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-2 items-center gap-1">
            <Sparkles className="h-3 w-3 text-pink-400 opacity-60" />
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start group">
      <div className="max-w-xs sm:max-w-md lg:max-w-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cute-purple to-cute-blue rounded-full flex items-center justify-center mt-1 shadow-lg animate-pulse-cute">
            <Bot className="h-5 w-5 text-white animate-wiggle" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cute-yellow rounded-full animate-bounce-cute"></div>
          </div>
          <div>
            <div className="bg-gradient-to-br from-cute-pink to-white rounded-3xl rounded-bl-lg px-5 py-4 shadow-lg border-2 border-cute-pink/20 transform transition-all duration-200 hover:scale-[1.02] relative">
              <div className="absolute top-2 right-2">
                <Sparkles className="h-4 w-4 text-cute-purple animate-pulse-cute" />
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                {message.content.includes('```') ? (
                  <div dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/```(\w*)\n([\s\S]*?)```/g, 
                        '<div class="bg-gradient-to-r from-purple-900 to-blue-900 text-gray-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto my-3 border border-purple-400/30"><pre><code>$2</code></pre></div>'
                      )
                      .replace(/\n/g, '<br>')
                  }} />
                ) : (
                  message.content
                )}
              </div>
            </div>
            <div className="flex justify-start mt-2 items-center gap-1">
              <Heart className="h-3 w-3 text-cute-purple opacity-60" />
              <span className="text-xs text-gray-400">{timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
