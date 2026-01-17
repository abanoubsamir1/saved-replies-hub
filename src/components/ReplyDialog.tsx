import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Loader2 } from "lucide-react";

interface Category {
    id: string;
    name_en: string;
    name_ar: string;
}

interface ReplyDialogProps {
    categories: Category[];
    onReplyAdded: () => void;
}

export function ReplyDialog({ categories, onReplyAdded }: ReplyDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { language } = useLanguage();

    const [formData, setFormData] = useState({
        title_en: "",
        title_ar: "",
        content_en: "",
        content_ar: "",
        category_id: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                toast({
                    title: language === 'en' ? "Error" : "خطأ",
                    description: language === 'en' ? "You must be logged in" : "يجب تسجيل الدخول",
                    variant: "destructive",
                })
                setLoading(false);
                return;
            }

            // Direct insert to replies table (Private Reply)
            const { error } = await supabase.from("replies").insert({
                title_en: formData.title_en,
                title_ar: formData.title_ar,
                content_en: formData.content_en,
                content_ar: formData.content_ar,
                category_id: formData.category_id,
                created_by: session.user.id,
                is_active: true, // Auto-active for own replies
            });

            if (error) throw error;

            toast({
                title: language === 'en' ? "Success" : "تم بنجاح",
                description: language === 'en' ? "Reply added successfully!" : "تم إضافة الرد بنجاح!",
            });

            setFormData({
                title_en: "",
                title_ar: "",
                content_en: "",
                content_ar: "",
                category_id: "",
            });
            setOpen(false);
            onReplyAdded();
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
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {language === 'en' ? "Add Reply" : "إضافة رد"}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir={isRTL ? "rtl" : "ltr"}>
                <DialogHeader className="text-start">
                    <DialogTitle>{language === 'en' ? "Add New Reply" : "إضافة رد جديد"}</DialogTitle>
                    <DialogDescription>
                        {language === 'en'
                            ? "Add a new reply to your personal collection."
                            : "أضف رداً جديداً إلى مجموعتك الخاصة."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category" className="text-start">
                            {language === 'en' ? "Category" : "الفئة"}
                        </Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                            required
                        >
                            <SelectTrigger className="text-start">
                                <SelectValue placeholder={language === 'en' ? "Select category" : "اختر الفئة"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {language === 'en' ? category.name_en : category.name_ar}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title_en" className="text-start">English Title</Label>
                        <Input
                            id="title_en"
                            value={formData.title_en}
                            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                            placeholder="e.g., Greeting"
                            required
                            className="text-start"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title_ar" className="text-start">Arabic Title / العنوان بالعربية</Label>
                        <Input
                            id="title_ar"
                            value={formData.title_ar}
                            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                            placeholder="مثال: ترحيب"
                            required
                            className="text-start"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content_en" className="text-start">English Content</Label>
                        <Textarea
                            id="content_en"
                            value={formData.content_en}
                            onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                            placeholder="Reply content in English..."
                            required
                            className="text-start h-20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content_ar" className="text-start">Arabic Content / المحتوى بالعربية</Label>
                        <Textarea
                            id="content_ar"
                            value={formData.content_ar}
                            onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                            placeholder="محتوى الرد بالعربية..."
                            required
                            className="text-start h-20"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {language === 'en' ? "Save Reply" : "حفظ الرد"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
