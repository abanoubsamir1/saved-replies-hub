import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Plus, Loader2 } from "lucide-react";

interface AddCategoryDialogProps {
    onCategoryAdded: () => void;
}

export function AddCategoryDialog({ onCategoryAdded }: AddCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { language } = useLanguage();

    const [formData, setFormData] = useState({
        name_en: "",
        name_ar: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { error } = await supabase.from("categories").insert({
                name_en: formData.name_en,
                name_ar: formData.name_ar,
                user_id: session.user.id,
            });

            if (error) throw error;

            toast({
                title: language === 'en' ? "Success" : "تم بنجاح",
                description: language === 'en' ? "Category added successfully!" : "تم إضافة الفئة بنجاح!",
            });

            setFormData({ name_en: "", name_ar: "" });
            setOpen(false);
            onCategoryAdded();
        } catch (error: any) {
            toast({
                title: language === 'en' ? "Error" : "خطأ",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const isRTL = language === 'ar';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {language === 'en' ? "Add Category" : "إضافة فئة"}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir={isRTL ? "rtl" : "ltr"}>
                <DialogHeader className="text-start">
                    <DialogTitle>{language === 'en' ? "Add New Category" : "إضافة فئة جديدة"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name_en" className="text-start">English Name</Label>
                        <Input
                            id="name_en"
                            value={formData.name_en}
                            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                            placeholder="e.g., Personal"
                            required
                            className="text-start"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name_ar" className="text-start">Arabic Name / الاسم بالعربية</Label>
                        <Input
                            id="name_ar"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            placeholder="مثال: شخصي"
                            required
                            className="text-start"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {language === 'en' ? "Add Category" : "إضافة الفئة"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
