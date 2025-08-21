import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

export const EditFeaturesDialog = ({ open, onOpenChange, initialData, onSave }) => {
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFeatures(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(features);
    };

    const addFeature = () => {
        setFeatures([...features, { title: '', description: '', icon: '' }]);
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const updateFeature = (index, field, value) => {
        const updatedFeatures = [...features];
        updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
        setFeatures(updatedFeatures);
    };

    const moveFeature = (index, direction) => {
        if ((direction === 'up' && index === 0) || 
            (direction === 'down' && index === features.length - 1)) return;

        const newFeatures = [...features];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
        setFeatures(newFeatures);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className="sm:max-w-[600px] overflow-hidden" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">تحرير المميزات</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[80vh] flex flex-col">
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                        {features.map((feature, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => moveFeature(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <MoveUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => moveFeature(index, 'down')}
                                            disabled={index === features.length - 1}
                                        >
                                            <MoveDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => removeFeature(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-right block">العنوان</label>
                                    <Input
                                        value={feature.title}
                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                        placeholder="عنوان الميزة"
                                        className="text-right"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-right block">الوصف</label>
                                    <Textarea
                                        value={feature.description}
                                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                        placeholder="وصف الميزة"
                                        className="text-right"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-right block">رابط الأيقونة</label>
                                    <Input
                                        value={feature.icon}
                                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                        placeholder="رابط الأيقونة"
                                        className="text-right"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={addFeature}
                    >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة ميزة جديدة
                    </Button>
                    <div className="flex justify-end gap-3 mt-6 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" className="btn-gradient">
                            حفظ التغييرات
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};