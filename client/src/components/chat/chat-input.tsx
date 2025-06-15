import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Heart, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, disabled = false, placeholder = "メッセージを入力してください..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      resetTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="border-t-2 border-cute-pink/30 p-4 bg-gradient-to-r from-cute-pink/10 to-cute-purple/10">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute top-2 left-3 z-10">
            <Heart className="h-4 w-4 text-cute-purple/60" />
          </div>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[48px] max-h-[120px] resize-none rounded-2xl border-2 border-cute-pink/30 focus:ring-2 focus:ring-cute-purple focus:border-cute-purple pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={disabled}
            rows={1}
          />
          <div className="absolute bottom-2 right-2">
            <Sparkles className="h-3 w-3 text-cute-pink/40" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 bg-gradient-to-r from-user-green to-cute-purple hover:from-cute-purple hover:to-user-green text-white px-6 py-3 rounded-2xl h-auto shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl hover-bounce relative group"
        >
          <Send className="h-4 w-4 group-hover:animate-bounce-cute" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cute-yellow rounded-full animate-pulse-cute opacity-80"></div>
        </Button>
      </form>
    </div>
  );
}
