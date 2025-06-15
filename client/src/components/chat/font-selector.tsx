import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type } from "lucide-react";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

const availableFonts = [
  { value: 'Inter', label: 'Inter', family: 'Inter, sans-serif' },
  { value: 'Noto Sans JP', label: 'Noto Sans JP', family: '"Noto Sans JP", sans-serif' },
  { value: 'Roboto', label: 'Roboto', family: 'Roboto, sans-serif' },
  { value: 'Lato', label: 'Lato', family: 'Lato, sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', family: '"Open Sans", sans-serif' },
  { value: 'Source Code Pro', label: 'Source Code Pro', family: '"Source Code Pro", monospace' },
];

export default function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Type className="h-4 w-4 text-gray-300" />
      <label className="text-gray-300 text-xs">フォント:</label>
      <Select value={selectedFont} onValueChange={onFontChange}>
        <SelectTrigger className="bg-medium-gray text-white border-none focus:ring-2 focus:ring-user-green min-w-[120px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableFonts.map((font) => (
            <SelectItem 
              key={font.value} 
              value={font.value}
              style={{ fontFamily: font.family }}
            >
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { availableFonts };