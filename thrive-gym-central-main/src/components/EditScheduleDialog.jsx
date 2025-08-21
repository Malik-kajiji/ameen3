import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DAYS = [
    'السبت',
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس'
];

const SHIFTS = {
    firstShift: 'الفترة الصباحية',
    secondShift: 'الفترة المسائية',
    thirdShift: 'الفترة الليلية'
};

export const EditScheduleDialog = ({ open, onOpenChange, initialData, onSave }) => {
    const [schedule, setSchedule] = useState(DAYS.map(day => ({
        day,
        firstShift: '',
        secondShift: '',
        thirdShift: ''
    })));

    useEffect(() => {
        if (initialData && Array.isArray(initialData)) {
            // Map initial data to ensure all required fields exist
            const mappedSchedule = DAYS.map(day => {
                const existingDay = initialData.find(d => d.day === day);
                return existingDay || {
                    day,
                    firstShift: '',
                    secondShift: '',
                    thirdShift: ''
                };
            });
            setSchedule(mappedSchedule);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(schedule);
    };

    const updateShift = (dayIndex, shift, value) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], [shift]: value };
        setSchedule(updatedSchedule);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className="sm:max-w-[700px] overflow-hidden" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">تحرير جدول المدربين</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] flex flex-col">
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                        {schedule.map((day, dayIndex) => (
                            <div key={dayIndex} className="p-4 border rounded-lg space-y-3">
                                <div className="font-bold text-right">{day.day}</div>
                                {Object.entries(SHIFTS).map(([shift, label]) => (
                                    <div key={shift} className="space-y-2">
                                        <label className="text-right block">{label}</label>
                                        <Input
                                            value={day[shift]}
                                            onChange={(e) => updateShift(dayIndex, shift, e.target.value)}
                                            placeholder="اسم المدرب"
                                            className="text-right"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-2 border-t">
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