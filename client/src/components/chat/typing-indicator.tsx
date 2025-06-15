import { Bot, Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start group">
      <div className="max-w-xs sm:max-w-md lg:max-w-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cute-purple to-cute-blue rounded-full flex items-center justify-center mt-1 shadow-lg animate-pulse-cute relative">
            <Bot className="h-5 w-5 text-white animate-wiggle" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cute-yellow rounded-full animate-bounce-cute"></div>
          </div>
          <div className="bg-gradient-to-br from-cute-pink to-white rounded-3xl rounded-bl-lg px-5 py-4 shadow-lg border-2 border-cute-pink/20 relative">
            <div className="absolute top-2 right-2">
              <Sparkles className="h-4 w-4 text-cute-purple animate-pulse-cute" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cute-purple rounded-full animate-bounce-cute"></div>
              <div className="w-3 h-3 bg-cute-blue rounded-full animate-bounce-cute" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-cute-pink rounded-full animate-bounce-cute" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-xs text-cute-purple ml-2 animate-pulse">思考中...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
