import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, Edit, Trash2, X, Upload, Layers, Monitor, ArrowLeft, Image, Video } from "lucide-react";
import { fileToBase64, isImageFile } from "../utils/upload";
import { EDCItem, EDCSetup, EDCItemCategory, Device } from "../types";
import { ModuleHeader } from "../components/ModuleHeader";
import { useAuth } from "../contexts/AuthContext";

const edcCategories: EDCItemCategory[] = ['Tool', 'Daily', 'Bag', 'Electronics', 'Perfume', 'Stationery'];

const edcCategoryLabels: Record<EDCItemCategory, string> = {
  'Tool': '工具',
  'Daily': '日用品',
  'Bag': '包具',
  'Electronics': '电子产品',
  'Perfume': '香水',
  'Stationery': '文具'
};

const EDC_ITEMS_KEY = "johns-cabin-edc-items";
const EDC_SETUPS_KEY = "johns-cabin-edc-setups";
const DEVICES_STORAGE_KEY = "johns-cabin-devices";

const defaultEDCItems: EDCItem[] = [];
const defaultEDCSetups: EDCSetup[] = [];

function loadItemsFromStorage(): EDCItem[] {
  try {
    const data = localStorage.getItem(EDC_ITEMS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return defaultEDCItems;
  } catch (e) {
    console.error("加载 EDC 物品失败:", e);
    return defaultEDCItems;
  }
}

function saveItemsToStorage(items: EDCItem[]): void {
  try {
    localStorage.setItem(EDC_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("保存 EDC 物品失败:", e);
  }
}

function loadSetupsFromStorage(): EDCSetup[] {
  try {
    const data = localStorage.getItem(EDC_SETUPS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return defaultEDCSetups;
  } catch (e) {
    console.error("加载 EDC 方案失败:", e);
    return defaultEDCSetups;
  }
}

function saveSetupsToStorage(setups: EDCSetup[]): void {
  try {
    localStorage.setItem(EDC_SETUPS_KEY, JSON.stringify(setups));
  } catch (e) {
    console.error("保存 EDC 方案失败:", e);
  }
}

function loadDevicesFromStorage(): Device[] {
  try {
    const data = localStorage.getItem(DEVICES_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("加载设备失败:", e);
  }
  return [];
}

function EDCItemCard({
  item,
  devices,
  onEdit,
  onDelete,
  onDeviceClick,
  onClick,
  isAuthenticated
}: {
  item: EDCItem;
  devices: Device[];
  onEdit: (item: EDCItem) => void;
  onDelete: (id: string) => void;
  onDeviceClick?: (deviceId: string) => void;
  onClick?: () => void;
  isAuthenticated: boolean;
}) {
  const linkedDevice = devices.find(d => d.id === item.linkedDeviceId);

  return (
    <div onClick={onClick} className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer">
      <div className="relative aspect-square overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-700/50 flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-blue-600/80 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {edcCategoryLabels[item.category]}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-1">{item.name}</h3>
        {item.brand && (
          <p className="text-sm text-slate-400 mb-2">{item.brand}</p>
        )}
        {item.linkedDeviceId && linkedDevice && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeviceClick?.(linkedDevice.id); }}
            className="mt-2 flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300"
          >
            <Monitor className="w-3 h-3" />
            <span>{linkedDevice.name}</span>
          </button>
        )}
        {isAuthenticated && (
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              编辑
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EDCSetupCard({
  setup,
  itemCount,
  onEdit,
  onDelete,
  onClick,
  isAuthenticated
}: {
  setup: EDCSetup;
  itemCount: number;
  onEdit: (setup: EDCSetup) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div onClick={onClick} className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        {setup.imageUrl ? (
          <img src={setup.imageUrl} alt={setup.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-700/50 flex items-center justify-center">
            <Layers className="w-12 h-12 text-slate-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded-md text-xs font-medium text-white">
          <Package className="w-3 h-3" />
          {itemCount} 个物品
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-1">{setup.name}</h3>
        {setup.description && (
          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{setup.description}</p>
        )}
        {isAuthenticated && (
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(setup); }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              编辑
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(setup.id); }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EDCItemDetail({ item, devices, onBack, onDeviceClick, onEdit, isAuthenticated }: { 
  item: EDCItem; 
  devices: Device[]; 
  onBack: () => void; 
  onDeviceClick?: (deviceId: string) => void;
  onEdit?: () => void;
  isAuthenticated: boolean;
}) {
  const linkedDevice = devices.find(d => d.id === item.linkedDeviceId);

  return (
    <div className="min-h-screen pb-20 relative">
      {/* 模糊封面背景 */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) saturate(150%)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="fixed inset-0 z-0 bg-slate-900/70" />
      
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <h1 className="text-xl font-bold text-white">EDC 物品详情</h1>
            </div>
            {isAuthenticated && onEdit && (
              <button onClick={onEdit} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <Edit className="w-5 h-5 text-slate-300" />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden mb-6">
          <div className="relative h-64 sm:h-80">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-md text-xs font-medium">
                  {edcCategoryLabels[item.category]}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{item.name}</h2>
              {item.brand && <p className="text-sm text-slate-400 mt-1">{item.brand}</p>}
              {linkedDevice && onDeviceClick && (
                <button
                  onClick={() => onDeviceClick(linkedDevice.id)}
                  className="mt-2 flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Monitor className="w-3 h-3" />
                  <span>查看关联设备: {linkedDevice.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {item.notes && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">备注</h3>
              <p className="text-slate-300 leading-relaxed">{item.notes}</p>
            </div>
          )}

          {item.review && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">我的评价</h3>
              <div className="text-slate-300 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: item.review }} />
            </div>
          )}

          {item.images && item.images.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">图片库</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group">
                    <img src={image} alt={`${item.name} ${index + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{index + 1} / {item.images.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.videos && item.videos.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">视频</h3>
              </div>
              <div className="space-y-4">
                {item.videos.map((video, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <video src={video} controls className="w-full h-48 bg-slate-900" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EDCSetupDetail({ setup, items, onBack, onEdit, isAuthenticated }: { 
  setup: EDCSetup; 
  items: EDCItem[]; 
  onBack: () => void; 
  onEdit?: () => void;
  isAuthenticated: boolean;
}) {
  const setupItems = items.filter(item => setup.itemIds.includes(item.id));

  return (
    <div className="min-h-screen pb-20 relative">
      {/* 模糊封面背景 */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: setup.imageUrl ? `url(${setup.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) saturate(150%)',
          transform: 'scale(1.1)',
          backgroundColor: setup.imageUrl ? 'transparent' : '#1e293b'
        }}
      />
      <div className="fixed inset-0 z-0 bg-slate-900/70" />
      
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <h1 className="text-xl font-bold text-white">EDC 方案详情</h1>
            </div>
            {isAuthenticated && onEdit && (
              <button onClick={onEdit} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <Edit className="w-5 h-5 text-slate-300" />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden mb-6">
          <div className="relative h-64 sm:h-80">
            {setup.imageUrl ? (
              <img src={setup.imageUrl} alt={setup.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-700/50 flex items-center justify-center">
                <Package className="w-16 h-16 text-slate-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{setup.name}</h2>
              {setup.description && <p className="text-sm text-slate-400 mt-1">{setup.description}</p>}
              <p className="text-xs text-slate-500 mt-1">包含 {setupItems.length} 个物品</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {setup.notes && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">备注</h3>
              <p className="text-slate-300 leading-relaxed">{setup.notes}</p>
            </div>
          )}

          {setup.review && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">我的评价</h3>
              <div className="text-slate-300 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: setup.review }} />
            </div>
          )}

          {setupItems.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">方案中的物品</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {setupItems.map(item => (
                  <div key={item.id} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-600/50 flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">{edcCategoryLabels[item.category]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {setup.images && setup.images.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">图片库</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {setup.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group">
                    <img src={image} alt={`${setup.name} ${index + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{index + 1} / {setup.images.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {setup.videos && setup.videos.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">视频</h3>
              </div>
              <div className="space-y-4">
                {setup.videos.map((video, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <video src={video} controls className="w-full h-48 bg-slate-900" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EDCItemModal({
  item,
  devices,
  onClose,
  onSave,
  onEditDetail
}: {
  item?: EDCItem | null;
  devices: Device[];
  onClose: () => void;
  onSave: (data: Omit<EDCItem, 'id'>) => void;
  onEditDetail?: () => void;
}) {
  const isEdit = !!item;
  const [formData, setFormData] = useState({
    name: item?.name || "",
    category: item?.category || "Tool" as EDCItemCategory,
    brand: item?.brand || "",
    imageUrl: item?.imageUrl || "",
    notes: item?.notes || "",
    images: item?.images || [],
    linkedDeviceId: item?.linkedDeviceId || ""
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isImageFile(file)) return;

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, imageUrl: base64 }));
    } catch (error) {
      console.error("上传图片失败:", error);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const data: Omit<EDCItem, 'id'> = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      imageUrl: formData.imageUrl,
      notes: formData.notes,
      images: formData.images,
      linkedDeviceId: formData.category === 'Electronics' ? formData.linkedDeviceId || undefined : undefined,
      review: item?.review || "",
      videos: item?.videos || []
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "编辑 EDC 物品" : "添加 EDC 物品"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">分类</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as EDCItemCategory })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
            >
              {edcCategories.map((cat) => (
                <option key={cat} value={cat}>{edcCategoryLabels[cat]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">品牌</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">封面图片</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="图片链接或下方上传"
                className="flex-1 px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
              />
              <label className="px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{uploading ? "上传中..." : "上传"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {formData.imageUrl && (
              <div className="flex items-center gap-2">
                <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                <span className="text-xs text-slate-400">图片预览</span>
              </div>
            )}
          </div>
          {formData.category === 'Electronics' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">关联设备</label>
              <select
                value={formData.linkedDeviceId || ""}
                onChange={(e) => setFormData({ ...formData, linkedDeviceId: e.target.value || undefined })}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">选择设备...</option>
                {devices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.category})
                  </option>
                ))}
              </select>
              {formData.linkedDeviceId && (
                <p className="text-xs text-slate-500 mt-1">
                  已关联：{devices.find(d => d.id === formData.linkedDeviceId)?.brand} {devices.find(d => d.id === formData.linkedDeviceId)?.model}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="添加备注..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>
          {isEdit && onEditDetail && (
            <button
              type="button"
              onClick={onEditDetail}
              className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Detail Content
            </button>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {isEdit ? "保存更改" : "添加物品"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EDCSetupModal({
  setup,
  items,
  onClose,
  onSave,
  onEditDetail
}: {
  setup?: EDCSetup | null;
  items: EDCItem[];
  onClose: () => void;
  onSave: (data: Omit<EDCSetup, 'id'>) => void;
  onEditDetail?: () => void;
}) {
  const isEdit = !!setup;
  const [formData, setFormData] = useState({
    name: setup?.name || "",
    description: setup?.description || "",
    imageUrl: setup?.imageUrl || "",
    itemIds: setup?.itemIds || [] as string[],
    notes: setup?.notes || "",
    images: setup?.images || []
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isImageFile(file)) return;

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, imageUrl: base64 }));
    } catch (error) {
      console.error("上传图片失败:", error);
    }
    setUploading(false);
  };

  const toggleItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      itemIds: prev.itemIds.includes(itemId)
        ? prev.itemIds.filter(id => id !== itemId)
        : [...prev.itemIds, itemId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const data: Omit<EDCSetup, 'id'> = {
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,
      itemIds: formData.itemIds,
      notes: formData.notes,
      images: formData.images,
      review: setup?.review || "",
      videos: setup?.videos || []
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "编辑 EDC 方案" : "添加 EDC 方案"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">方案名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="描述此方案..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">封面图片</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="图片链接或下方上传"
                className="flex-1 px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
              />
              <label className="px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{uploading ? "上传中..." : "上传"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {formData.imageUrl && (
              <div className="flex items-center gap-2">
                <img src={formData.imageUrl} alt="Preview" className="w-20 h-12 object-cover rounded-lg" />
                <span className="text-xs text-slate-400">封面预览</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">选择物品 ({formData.itemIds.length} 已选择)</label>
            <div className="max-h-48 overflow-y-auto bg-slate-700/30 rounded-lg p-3 space-y-2">
              {items.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">没有可用的物品。请先添加一些 EDC 物品。</p>
              ) : (
                items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.itemIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 rounded border-slate-500 text-blue-500 focus:ring-blue-500/50 bg-slate-700"
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">{edcCategoryLabels[item.category]}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="添加备注..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>
          {isEdit && onEditDetail && (
            <button
              type="button"
              onClick={onEditDetail}
              className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Detail Content
            </button>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {isEdit ? "保存更改" : "添加方案"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EDC() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'setups'>('items');
  const [items, setItems] = useState<EDCItem[]>([]);
  const [setups, setSetups] = useState<EDCSetup[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EDCItemCategory | 'All'>('All');
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EDCItem | null>(null);
  const [editingSetup, setEditingSetup] = useState<EDCSetup | null>(null);
  const [selectedItem, setSelectedItem] = useState<EDCItem | null>(null);
  const [selectedSetup, setSelectedSetup] = useState<EDCSetup | null>(null);

  useEffect(() => {
    setItems(loadItemsFromStorage());
    setSetups(loadSetupsFromStorage());
    setDevices(loadDevicesFromStorage());
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const filteredSetups = useMemo(() => {
    return setups.filter(setup => {
      return setup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        setup.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [setups, searchQuery]);

  const handleAddItem = (data: Omit<EDCItem, 'id'>) => {
    const newItem: EDCItem = {
      ...data,
      id: Date.now().toString()
    };
    setItems(prev => {
      const updated = [...prev, newItem];
      saveItemsToStorage(updated);
      return updated;
    });
  };

  const handleUpdateItem = (id: string, data: Omit<EDCItem, 'id'>) => {
    setItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...data } : item);
      saveItemsToStorage(updated);
      return updated;
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("确定要删除此物品吗？")) {
      setItems(prev => {
        const updated = prev.filter(item => item.id !== id);
        saveItemsToStorage(updated);
        return updated;
      });
    }
  };

  const handleAddSetup = (data: Omit<EDCSetup, 'id'>) => {
    const newSetup: EDCSetup = {
      ...data,
      id: Date.now().toString()
    };
    setSetups(prev => {
      const updated = [...prev, newSetup];
      saveSetupsToStorage(updated);
      return updated;
    });
  };

  const handleUpdateSetup = (id: string, data: Omit<EDCSetup, 'id'>) => {
    setSetups(prev => {
      const updated = prev.map(setup => setup.id === id ? { ...setup, ...data } : setup);
      saveSetupsToStorage(updated);
      return updated;
    });
  };

  const handleDeleteSetup = (id: string) => {
    if (confirm("确定要删除此方案吗？")) {
      setSetups(prev => {
        const updated = prev.filter(setup => setup.id !== id);
        saveSetupsToStorage(updated);
        return updated;
      });
    }
  };

  const handleEditItemDetail = () => {
    if (editingItem) {
      navigate(`/edc/items/edit/${editingItem.id}`);
    }
  };

  const handleEditSetupDetail = () => {
    if (editingSetup) {
      navigate(`/edc/setups/edit/${editingSetup.id}`);
    }
  };

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/devices?device=${deviceId}`);
  };

  const handleAddClick = () => {
    if (activeTab === 'items') {
      setEditingItem(null);
      setItemModalOpen(true);
    } else {
      setEditingSetup(null);
      setSetupModalOpen(true);
    }
  };

  if (selectedItem) {
    return (
      <EDCItemDetail 
        item={selectedItem} 
        devices={devices}
        onBack={() => setSelectedItem(null)} 
        onDeviceClick={handleDeviceClick}
        onEdit={() => navigate(`/edc/items/edit/${selectedItem.id}`)}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  if (selectedSetup) {
    return (
      <EDCSetupDetail 
        setup={selectedSetup} 
        items={items}
        onBack={() => setSelectedSetup(null)} 
        onEdit={() => navigate(`/edc/setups/edit/${selectedSetup.id}`)}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ModuleHeader
        title="John's EDC"
        subtitle="My Everyday Carry"
        onAdd={() => handleAddClick()}
        addLabel={activeTab === 'items' ? "添加物品" : "添加方案"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'items'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              物品
            </div>
          </button>
          <button
            onClick={() => setActiveTab('setups')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'setups'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Layers className="w-5 h-5" />
              方案
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'items' ? "搜索物品..." : "搜索方案..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Category Filter (Items only) */}
        {activeTab === 'items' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
              }`}
            >
              全部
            </button>
            {edcCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                {edcCategoryLabels[category]}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {activeTab === 'items' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">EDC 物品</h2>
              <p className="text-sm text-slate-400">{filteredItems.length} 个物品</p>
            </div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">未找到物品</h3>
                <p className="text-sm text-slate-500">创建您的第一个 EDC 物品！</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <EDCItemCard
                    key={item.id}
                    item={item}
                    devices={devices}
                    onEdit={(i) => {
                      setEditingItem(i);
                      setItemModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onDeviceClick={handleDeviceClick}
                    onClick={() => {
                      if (item.category === 'Electronics' && item.linkedDeviceId) {
                        handleDeviceClick(item.linkedDeviceId);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">EDC 方案</h2>
              <p className="text-sm text-slate-400">{filteredSetups.length} 个方案</p>
            </div>
            {filteredSetups.length === 0 ? (
              <div className="text-center py-12">
                <Layers className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">未找到方案</h3>
                <p className="text-sm text-slate-500">创建您的第一个 EDC 方案！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSetups.map((setup) => (
                  <EDCSetupCard
                    key={setup.id}
                    setup={setup}
                    itemCount={setup.itemIds.length}
                    onEdit={(s) => {
                      setEditingSetup(s);
                      setSetupModalOpen(true);
                    }}
                    onDelete={handleDeleteSetup}
                    onClick={() => setSelectedSetup(setup)}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {itemModalOpen && (
        <EDCItemModal
          item={editingItem}
          devices={devices}
          onClose={() => {
            setItemModalOpen(false);
            setEditingItem(null);
          }}
          onSave={(data) => {
            if (editingItem) {
              handleUpdateItem(editingItem.id, data);
            } else {
              handleAddItem(data);
            }
          }}
          onEditDetail={editingItem ? handleEditItemDetail : undefined}
        />
      )}

      {setupModalOpen && (
        <EDCSetupModal
          setup={editingSetup}
          items={items}
          onClose={() => {
            setSetupModalOpen(false);
            setEditingSetup(null);
          }}
          onSave={(data) => {
            if (editingSetup) {
              handleUpdateSetup(editingSetup.id, data);
            } else {
              handleAddSetup(data);
            }
          }}
          onEditDetail={editingSetup ? handleEditSetupDetail : undefined} 
        />
      )}
    </div>
  );
}
