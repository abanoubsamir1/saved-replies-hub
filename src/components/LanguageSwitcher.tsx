import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

export const LanguageSwitcher = ({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage === 'en' ? 'English' : 'العربية'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onLanguageChange('en')} className="cursor-pointer">
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLanguageChange('ar')} className="cursor-pointer">
          العربية (Arabic)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
