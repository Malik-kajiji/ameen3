import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const AddAdminDialog = ({ open, onOpenChange, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        role: '',
        access: []
    });

    const availablePermissions = [
        'الأعضاء',
        'الموظفون',
        'المالية',
        'الممتلكات',
        'التقارير',
        'الإشعارات',
        'البصمة',
        'الموقع',
        'المشرفون'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            username: '',
            password: '',
            name: '',
            email: '',
            role: '',
            access: []
        });
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => ({
            ...prev,
            access: prev.access.includes(permission)
                ? prev.access.filter(p => p !== permission)
                : [...prev.access, permission]
        }));
    };

    const handleRoleChange = (role) => {
        let defaultAccess = [];
        switch (role) {
            case 'مدير عام':
                defaultAccess = availablePermissions;
                break;
            case 'مدير':
                defaultAccess = ['الأعضاء', 'المالية', 'التقارير'];
                break;
            case 'دعم فني':
                defaultAccess = ['الأعضاء', 'الممتلكات'];
                break;
        }
        setFormData(prev => ({
            ...prev,
            role,
            access: defaultAccess
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rtl">
                <DialogHeader>
                    <DialogTitle>إضافة مشرف جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">الاسم</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">اسم المستخدم</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>الدور</Label>
                            <Select
                                value={formData.role}
                                onValueChange={handleRoleChange}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الدور" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="مدير عام">مدير عام</SelectItem>
                                    <SelectItem value="مدير">مدير</SelectItem>
                                    <SelectItem value="دعم فني">دعم فني</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>الصلاحيات</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {availablePermissions.map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox
                                            id={permission}
                                            checked={formData.access.includes(permission)}
                                            onCheckedChange={() => handlePermissionChange(permission)}
                                        />
                                        <Label htmlFor={permission}>{permission}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">إضافة المشرف</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddAdminDialog;