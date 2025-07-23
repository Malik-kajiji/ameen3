import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as THead,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Plus, Wrench, AlertTriangle, Calendar, Settings } from 'lucide-react';
import AssetMaintenanceDialog from './AssetMaintenanceDialog';
import AddAssetDialog from './AddAssetDialog';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, type: "spring" } }
};

const cardFade = {
  hidden: { opacity: 0, scale: 0.97, y: 30 },
  show: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.05 + 0.14, duration: 0.34, type: "spring" }
  })
};

const tableRowAnim = {
  hidden: { opacity: 0, y: 16 },
  show: i => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.04, duration: 0.35 }
  })
};

const AssetsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);

  const [assets, setAssets] = useState([
    {
      id: 'AST-001',
      name: 'جهاز الجري #1',
      category: 'أجهزة كارديو',
      status: 'جيد',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      value: '2,500 د.ل'
    },
    {
      id: 'AST-002',
      name: 'جهاز الضغط',
      category: 'أجهزة القوة',
      status: 'يحتاج صيانة',
      lastMaintenance: '2023-11-15',
      nextMaintenance: '2024-02-15',
      value: '1,800 د.ل'
    },
    {
      id: 'AST-003',
      name: 'مجموعة الأثقال',
      category: 'أوزان حرة',
      status: 'ممتاز',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-07-05',
      value: '800 د.ل'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ممتاز':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'جيد':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'يحتاج صيانة':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'تالف':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleMaintenance = (asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceDialogOpen(true);
  };

  const handleSaveMaintenance = (maintenance) => {
    console.log('تم جدولة الصيانة:', maintenance);
    setIsMaintenanceDialogOpen(false);
  };

  const handleAddAsset = (newAsset) => {
    setAssets([...assets, newAsset]);
    console.log('تم إضافة أصل جديد:', newAsset);
  };

  const getStatusCounts = () => {
    return {
      total: assets.length,
      excellent: assets.filter(a => a.status === 'ممتاز').length,
      good: assets.filter(a => a.status === 'جيد').length,
      needsMaintenance: assets.filter(a => a.status === 'يحتاج صيانة').length,
      damaged: assets.filter(a => a.status === 'تالف').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="space-y-6 rtl"
      >
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="flex justify-between items-center"
        >
          <div className="text-right">
            <h2 className="text-3xl font-bold tracking-tight">
              <motion.span initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>إدارة الأصول</motion.span>
            </h2>
            <p className="text-muted-foreground">
              <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>إدارة معدات الصالة والصيانة</motion.span>
            </p>
          </div>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.22 }}>
            <Button
              className="btn-gradient"
              onClick={() => setIsAddAssetDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة أصل جديد
            </Button>
          </motion.div>
        </motion.div>

        <motion.div className="grid gap-4 md:grid-cols-4">
          {[
            {
              value: statusCounts.total,
              label: "إجمالي الأصول",
              color: "text-primary"
            },
            {
              value: statusCounts.excellent + statusCounts.good,
              label: "حالة جيدة",
              color: "text-green-500"
            },
            {
              value: statusCounts.needsMaintenance,
              label: "تحتاج صيانة",
              color: "text-yellow-500"
            },
            {
              value: statusCounts.damaged,
              label: "تالفة",
              color: "text-red-500"
            }
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={cardFade} custom={i} initial="hidden" animate="show" className="w-full">
              <Card className="card-gradient shadow-lg shadow-black/10">
                <CardContent className={`p-6 text-right`}>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="show">
          <Card className="card-gradient shadow-md shadow-black/5">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle className="text-right">
                  جرد المعدات ({filteredAssets.length})
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="البحث في الأصول..."
                      className="w-full pr-10 pl-4 py-2 border border-input rounded-md bg-background text-right"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <THead>
                    <TableRow>
                      <TableHead className="text-right">رقم الأصل</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">آخر صيانة</TableHead>
                      <TableHead className="text-right">الصيانة التالية</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </THead>
                  <TableBody>
                    <AnimatePresence>
                      {filteredAssets.map((asset, i) => (
                        <motion.tr
                          key={asset.id}
                          variants={tableRowAnim}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          custom={i}
                          className="bg-transparent"
                        >
                          <TableCell className="font-medium text-right">{asset.id}</TableCell>
                          <TableCell className="text-right">{asset.name}</TableCell>
                          <TableCell className="text-right">{asset.category}</TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                              {asset.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{asset.lastMaintenance}</TableCell>
                          <TableCell className="text-right">{asset.nextMaintenance}</TableCell>
                          <TableCell className="text-right">{asset.value}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleScheduleMaintenance(asset)}
                                title="جدولة صيانة"
                              >
                                <Calendar className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="صيانة">
                                <Wrench className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="إعدادات">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AssetMaintenanceDialog
          asset={selectedAsset}
          isOpen={isMaintenanceDialogOpen}
          onClose={() => {
            setIsMaintenanceDialogOpen(false);
            setSelectedAsset(null);
          }}
          onSave={handleSaveMaintenance}
        />

        <AddAssetDialog
          isOpen={isAddAssetDialogOpen}
          onClose={() => setIsAddAssetDialogOpen(false)}
          onSave={handleAddAsset}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetsManagement;
