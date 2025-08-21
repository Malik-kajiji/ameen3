import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const EditContactDialog = ({ open, onOpenChange, initialData, onSave }) => {
    const [contact, setContact] = useState({
        address: '',
        phone: '',
        email: '',
        socialMedia: {
            facebook: '',
            instagram: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            setContact({
                address: initialData.address || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                socialMedia: {
                    facebook: initialData.socialMedia?.facebook || '',
                    instagram: initialData.socialMedia?.instagram || ''
                }
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(contact);
    };

    const updateContact = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setContact(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setContact(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">تحرير معلومات الاتصال</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[80vh] flex flex-col">
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    <div className="space-y-2">
                        <label className="text-right block">العنوان</label>
                        <Input
                            value={contact.address}
                            onChange={(e) => updateContact('address', e.target.value)}
                            placeholder="العنوان"
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block">رقم الهاتف</label>
                        <Input
                            value={contact.phone}
                            onChange={(e) => updateContact('phone', e.target.value)}
                            placeholder="رقم الهاتف"
                            className="text-right"
                            dir="ltr"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block">البريد الإلكتروني</label>
                        <Input
                            value={contact.email}
                            onChange={(e) => updateContact('email', e.target.value)}
                            placeholder="البريد الإلكتروني"
                            className="text-right"
                            dir="ltr"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block">فيسبوك</label>
                        <Input
                            value={contact.socialMedia?.facebook || ''}
                            onChange={(e) => updateContact('socialMedia.facebook', e.target.value)}
                            placeholder="رابط صفحة الفيسبوك"
                            className="text-right"
                            dir="ltr"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-right block">انستغرام</label>
                        <Input
                            value={contact.socialMedia?.instagram || ''}
                            onChange={(e) => updateContact('socialMedia.instagram', e.target.value)}
                            placeholder="رابط حساب الانستغرام"
                            className="text-right"
                            dir="ltr"
                        />
                    </div>
                    </div>
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