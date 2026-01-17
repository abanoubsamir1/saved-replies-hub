import { Copy, Check, Heart, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReplyData {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
}

interface ExtendedReplyCardProps {
  id: string;
  reply: ReplyData;
  categoryName?: string;
  onCopy?: () => void;
  onFavoriteChange?: () => void;
  onDelete?: () => void;
  currentUserId?: string;
  createdBy?: string;
}

export const ReplyCard = ({ id, reply, categoryName, onCopy, onFavoriteChange, onDelete, currentUserId, createdBy }: ExtendedReplyCardProps) => {
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedAr, setCopiedAr] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    checkIfFavorite();
  }, [id]);

  const checkIfFavorite = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('reply_id', id)
        .maybeSingle();

      if (!error && data) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive",
        });
        return;
      }

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('reply_id', id);

        if (error) throw error;

        setIsFavorite(false);
        toast({ title: language === 'en' ? 'Removed from favorites' : 'تم الإزالة من المفضلة' });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: session.user.id,
            reply_id: id,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast({ title: language === 'en' ? 'Added to favorites' : 'تم الإضافة للمفضلة' });
      }

      onFavoriteChange?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCopy = async (content: string, language: 'en' | 'ar') => {
    try {
      await navigator.clipboard.writeText(content);

      if (language === 'en') {
        setCopiedEn(true);
        setTimeout(() => setCopiedEn(false), 2000);
      } else {
        setCopiedAr(true);
        setTimeout(() => setCopiedAr(false), 2000);
      }

      // Log the copy action
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('copy_logs').insert({
          user_id: session.user.id,
          reply_id: id,
        });
      }

      toast({ title: t('copied') });
      onCopy?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm(language === 'en' ? "Are you sure you want to delete this reply?" : "هل أنت متأكد من حذف هذا الرد؟")) return;

    try {
      const { error } = await supabase.from('replies').delete().eq('id', id);
      if (error) throw error;

      toast({ title: language === 'en' ? "Reply deleted" : "تم حذف الرد" });
      onDelete?.();
    } catch (error) {
      toast({ title: "Error deleting reply", variant: "destructive" });
    }
  };

  const isOwner = currentUserId && createdBy && currentUserId === createdBy;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 text-start space-y-2">
            {categoryName && (
              <Badge variant="secondary" className="text-xs">
                {categoryName}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className="shrink-0 hover:bg-primary/10 transition-colors"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="shrink-0 hover:bg-destructive/10 text-destructive transition-colors"
                title={language === 'en' ? "Delete" : "حذف"}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* English Section */}
        <div className="border rounded-lg p-4 space-y-2 bg-muted/30" dir="ltr">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">English</div>
              <h3 className="font-semibold text-base text-left">{reply.title_en}</h3>
              <p className="text-sm whitespace-pre-wrap text-left text-muted-foreground">{reply.content_en}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(reply.content_en, 'en')}
              className="shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {copiedEn ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Arabic Section */}
        <div className="border rounded-lg p-4 space-y-2 bg-muted/30" dir="rtl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">العربية</div>
              <h3 className="font-semibold text-base text-right">{reply.title_ar}</h3>
              <p className="text-sm whitespace-pre-wrap text-right text-muted-foreground">{reply.content_ar}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(reply.content_ar, 'ar')}
              className="shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {copiedAr ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
