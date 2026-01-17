import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
}

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid = ({ categories, onSelectCategory }: CategoryGridProps) => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group border-2 hover:border-primary"
        >
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {language === 'en' ? category.name_en : category.name_ar}
              </h3>
              {(category.description_en || category.description_ar) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'en' ? category.description_en : category.description_ar}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
