
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, isToday, isSameDay } from 'date-fns';

const AttendanceCalendar = ({ employeeId, employeeName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const attendanceRecords = [
    {
      date: new Date(2024, 0, 15),
      status: 'present',
      checkIn: '08:00',
      checkOut: '17:00',
      hours: 9,
      notes: 'يوم عمل عادي',
    },
    {
      date: new Date(2024, 0, 16),
      status: 'late',
      checkIn: '08:30',
      checkOut: '17:00',
      hours: 8.5,
      notes: 'تأخر 30 دقيقة',
    },
    {
      date: new Date(2024, 0, 17),
      status: 'absent',
      notes: 'إجازة مرضية',
    },
    {
      date: new Date(2024, 0, 18),
      status: 'early_leave',
      checkIn: '08:00',
      checkOut: '15:00',
      hours: 7,
      notes: 'خروج مبكر - ظروف خاصة',
    },
  ];

  const getAttendanceForDate = (date) =>
    attendanceRecords.find((r) => isSameDay(r.date, date));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'early_leave':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      present: { label: 'حضر', variant: 'default' },
      absent: { label: 'غائب', variant: 'destructive' },
      late: { label: 'متأخر', variant: 'secondary' },
      early_leave: { label: 'خروج مبكر', variant: 'outline' },
    };
    const info = map[status];
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const modifiers = {
    present: attendanceRecords.filter((r) => r.status === 'present').map((r) => r.date),
    absent: attendanceRecords.filter((r) => r.status === 'absent').map((r) => r.date),
    late: attendanceRecords.filter((r) => r.status === 'late').map((r) => r.date),
    earlyLeave: attendanceRecords.filter((r) => r.status === 'early_leave').map((r) => r.date),
  };

  const modifiersStyles = {
    present: { backgroundColor: '#dcfce7', color: '#166534' },
    absent: { backgroundColor: '#fecaca', color: '#dc2626' },
    late: { backgroundColor: '#fef3c7', color: '#d97706' },
    earlyLeave: { backgroundColor: '#fed7aa', color: '#ea580c' },
  };

  const record = getAttendanceForDate(selectedDate);

  return (
    <div className="space-y-6 rtl">
      <div className="text-right">
        <h3 className="text-2xl font-bold">سجل الحضور — {employeeName}</h3>
        <p className="text-muted-foreground">تتبع حضور وانصراف الموظف</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">التقويم</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="pointer-events-auto"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">تفاصيل {format(selectedDate, 'yyyy-MM-dd')}</CardTitle>
          </CardHeader>
          <CardContent>
            {record ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse text-right">
                    {getStatusIcon(record.status)}
                    {getStatusBadge(record.status)}
                  </div>
                </div>
                {record.notes && (
                  <div className="text-sm text-muted-foreground text-right p-2 bg-muted rounded">
                    {record.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد بيانات حضور لهذا اليوم</p>
                {!isToday(selectedDate) && (
                  <Button className="mt-4" size="sm">إضافة سجل حضور</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
