import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBar = ({ value, onChange, className = "" }: SearchBarProps) => {
  const { t } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 h-14 text-lg shadow-md border-2 focus:border-primary transition-all duration-300"
      />
    </div>
  );
};
