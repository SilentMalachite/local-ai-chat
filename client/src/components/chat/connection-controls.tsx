import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ConnectionControlsProps {
  selectedMode: 'ollama' | 'lmstudio';
  selectedModel: string;
  models: string[];
  isConnected: boolean;
  onModeChange: (mode: 'ollama' | 'lmstudio') => void;
  onModelChange: (model: string) => void;
  onRefreshModels: () => void;
}

export default function ConnectionControls({
  selectedMode,
  selectedModel,
  models,
  isConnected,
  onModeChange,
  onModelChange,
  onRefreshModels
}: ConnectionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 text-sm">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 text-xs">モード:</label>
        <Select value={selectedMode} onValueChange={onModeChange}>
          <SelectTrigger className="bg-medium-gray text-white border-none focus:ring-2 focus:ring-user-green min-w-[100px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ollama">Ollama</SelectItem>
            <SelectItem value="lmstudio">LM Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 text-xs">モデル:</label>
        <div className="flex gap-1">
          <Select value={selectedModel} onValueChange={onModelChange} disabled={!isConnected || models.length === 0}>
            <SelectTrigger className="bg-medium-gray text-white border-none focus:ring-2 focus:ring-user-green min-w-[120px] h-8">
              <SelectValue placeholder={
                !isConnected ? "未接続" : 
                models.length === 0 ? "モデルなし" : 
                "モデルを選択"
              } />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshModels}
            className="text-white hover:bg-medium-gray p-1 h-8 w-8"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? '接続済み' : '未接続'}
        </span>
      </div>
    </div>
  );
}
