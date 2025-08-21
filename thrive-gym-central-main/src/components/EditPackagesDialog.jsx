import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

export const EditPackagesDialog = ({ open, onOpenChange, initialData, onSave }) => {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        if (initialData) {
            setPackages(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(packages);
    };

    const addPackage = () => {
        setPackages([...packages, {
            title: '',
            price: '',
            period: '',
            benefits: ['دخول 24 ساعة', 'معدات عالمية المستوى', 'فريق مدربين محترف']
        }]);
    };

    const removePackage = (index) => {
        setPackages(packages.filter((_, i) => i !== index));
    };

    const updatePackage = (index, field, value) => {
        const updatedPackages = [...packages];
        updatedPackages[index] = { ...updatedPackages[index], [field]: value };
        setPackages(updatedPackages);
    };

    const addBenefit = (packageIndex) => {
        const updatedPackages = [...packages];
        updatedPackages[packageIndex].benefits.push('');
        setPackages(updatedPackages);
    };

    const removeBenefit = (packageIndex, benefitIndex) => {
        const updatedPackages = [...packages];
        updatedPackages[packageIndex].benefits = updatedPackages[packageIndex].benefits.filter((_, i) => i !== benefitIndex);
        setPackages(updatedPackages);
    };

    const updateBenefit = (packageIndex, benefitIndex, value) => {
        const updatedPackages = [...packages];
        updatedPackages[packageIndex].benefits[benefitIndex] = value;
        setPackages(updatedPackages);
    };

    const movePackage = (index, direction) => {
        if ((direction === 'up' && index === 0) || 
            (direction === 'down' && index === packages.length - 1)) return;

        const newPackages = [...packages];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newPackages[index], newPackages[newIndex]] = [newPackages[newIndex], newPackages[index]];
        setPackages(newPackages);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className="sm:max-w-[700px] overflow-hidden" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">تحرير الباقات</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[80vh] flex flex-col">
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                        {packages.map((pkg, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => movePackage(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <MoveUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => movePackage(index, 'down')}
                                            disabled={index === packages.length - 1}
                                        >
                                            <MoveDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => removePackage(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-right block">عنوان الباقة</label>
                                    <Input
                                        value={pkg.title}
                                        onChange={(e) => updatePackage(index, 'title', e.target.value)}
                                        placeholder="عنوان الباقة"
                                        className="text-right"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-right block">السعر</label>
                                        <Input
                                            type="number"
                                            value={pkg.price}
                                            onChange={(e) => updatePackage(index, 'price', e.target.value)}
                                            placeholder="السعر"
                                            className="text-right"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-right block">المدة (بالأيام)</label>
                                        <Input
                                            type="number"
                                            value={pkg.period}
                                            onChange={(e) => updatePackage(index, 'period', e.target.value)}
                                            placeholder="المدة بالأيام"
                                            className="text-right"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-right block">المميزات</label>
                                    <div className="space-y-2">
                                        {pkg.benefits.map((benefit, benefitIndex) => (
                                            <div key={benefitIndex} className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() => removeBenefit(index, benefitIndex)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    value={benefit}
                                                    onChange={(e) => updateBenefit(index, benefitIndex, e.target.value)}
                                                    placeholder="الميزة"
                                                    className="text-right"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => addBenefit(index)}
                                        >
                                            <Plus className="h-4 w-4 ml-2" />
                                            إضافة ميزة
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={addPackage}
                    >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة باقة جديدة
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