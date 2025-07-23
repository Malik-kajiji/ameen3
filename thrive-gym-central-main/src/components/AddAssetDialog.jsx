import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"

const AddAssetDialog = ({ isOpen, onClose, onSave }) => {
  const [assetData, setAssetData] = useState({
    name: "",
    category: "",
    value: "",
    purchaseDate: undefined,
    warranty: "",
    supplier: "",
    location: "",
    description: "",
    status: "ممتاز",
  })

  const handleSave = () => {
    const newAsset = {
      id: `AST-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      ...assetData,
      lastMaintenance: "جديد",
      nextMaintenance: format(
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
    }
    onSave(newAsset)
    onClose()
    setAssetData({
      name: "",
      category: "",
      value: "",
      purchaseDate: undefined,
      warranty: "",
      supplier: "",
      location: "",
      description: "",
      status: "ممتاز",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-right">
              إضافة أصل جديد
            </DialogTitle>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                اسم الأصل
              </Label>
              <Input
                id="name"
                value={assetData.name}
                onChange={(e) =>
                  setAssetData({ ...assetData, name: e.target.value })
                }
                className="text-right"
                placeholder="مثل: جهاز الجري #1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-right">
                الفئة
              </Label>
              <Select
                value={assetData.category}
                onValueChange={(value) =>
                  setAssetData({ ...assetData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أجهزة كارديو">أجهزة كارديو</SelectItem>
                  <SelectItem value="أجهزة القوة">أجهزة القوة</SelectItem>
                  <SelectItem value="أوزان حرة">أوزان حرة</SelectItem>
                  <SelectItem value="أجهزة وظيفية">أجهزة وظيفية</SelectItem>
                  <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-right">
                القيمة
              </Label>
              <Input
                id="value"
                value={assetData.value}
                onChange={(e) =>
                  setAssetData({ ...assetData, value: e.target.value })
                }
                className="text-right"
                placeholder="مثل: 2,500 د.ل"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">تاريخ الشراء</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !assetData.purchaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {assetData.purchaseDate
                      ? format(assetData.purchaseDate, "yyyy-MM-dd")
                      : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={assetData.purchaseDate}
                    onSelect={(date) =>
                      setAssetData({ ...assetData, purchaseDate: date })
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty" className="text-right">
                فترة الضمان
              </Label>
              <Input
                id="warranty"
                value={assetData.warranty}
                onChange={(e) =>
                  setAssetData({ ...assetData, warranty: e.target.value })
                }
                className="text-right"
                placeholder="مثل: سنتان"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-right">
                المورد
              </Label>
              <Input
                id="supplier"
                value={assetData.supplier}
                onChange={(e) =>
                  setAssetData({ ...assetData, supplier: e.target.value })
                }
                className="text-right"
                placeholder="اسم الشركة الموردة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-right">
                الموقع
              </Label>
              <Input
                id="location"
                value={assetData.location}
                onChange={(e) =>
                  setAssetData({ ...assetData, location: e.target.value })
                }
                className="text-right"
                placeholder="مثل: الطابق التاني - منطقة الكارديو"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-right">
                الحالة
              </Label>
              <Select
                value={assetData.status}
                onValueChange={(value) =>
                  setAssetData({ ...assetData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                  <SelectItem value="جيد">جيد</SelectItem>
                  <SelectItem value="يحتاج صيانة">يحتاج صيانة</SelectItem>
                  <SelectItem value="تالف">تالف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              الوصف
            </Label>
            <Textarea
              id="description"
              value={assetData.description}
              onChange={(e) =>
                setAssetData({ ...assetData, description: e.target.value })
              }
              className="text-right"
              rows={3}
              placeholder="وصف تفصيلي للأصل..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              <Save className="w-4 h-4 ml-2" />
              حفظ الأصل
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetDialog
