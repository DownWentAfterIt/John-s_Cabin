import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, Search, Edit, Trash2, X, Upload, Plus, ArrowLeft, Star, Image, Video } from "lucide-react";
import { fileToBase64, isImageFile } from "../utils/upload";
import { Device, DeviceCategory } from "../types";
import { ModuleHeader } from "../components/ModuleHeader";
import { useAuth } from "../contexts/AuthContext";

const deviceCategories: DeviceCategory[] = [
  'Desktop', 'Host', 'Desktop Parts', 'Laptop', 'Monitor', 'Mouse', 'Keyboard',
  'Gaming Headset', 'Daily Headset', 'Mousepad', 'Controller',
  'Handheld', 'External Sound Card', 'Misc'
];

const deviceCategoryLabels: Record<DeviceCategory, string> = {
  'Desktop': '台式机',
  'Host': '主机',
  'Desktop Parts': '台式配件',
  'Laptop': '笔记本',
  'Monitor': '显示器',
  'Mouse': '鼠标',
  'Keyboard': '键盘',
  'Gaming Headset': '游戏耳机',
  'Daily Headset': '日常耳机',
  'Mousepad': '鼠标垫',
  'Controller': '手柄',
  'Handheld': '掌机',
  'External Sound Card': '外置声卡',
  'Misc': '其它'
};

const STORAGE_KEY = "johns-cabin-devices";

const defaultDevices: Device[] = [];

function loadDevicesFromStorage(): Device[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(d => ({
          ...d,
          images: d.images || []
        }));
      }
    }
    return defaultDevices;
  } catch (e) {
    console.error("Failed to load devices:", e);
    return defaultDevices;
  }
}

function saveDevicesToStorage(devices: Device[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  } catch (e) {
    console.error("Failed to save devices:", e);
  }
}

function DeviceCard({ device, onEdit, onDelete, onClick, isAuthenticated }: { device: Device; onEdit: (device: Device) => void; onDelete: (id: string) => void; onClick: () => void; isAuthenticated: boolean }) {
  return (
    <div onClick={onClick} className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {device.imageUrl ? (
          <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Monitor className="w-12 h-12 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-blue-600/80 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {deviceCategoryLabels[device.category]}
          </span>
        </div>
        {isAuthenticated && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(device); }}
              className="p-1.5 bg-slate-900/70 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(device.id); }}
              className="p-1.5 bg-slate-900/70 hover:bg-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-1">{device.name}</h3>
        <p className="text-sm text-slate-400 mb-2">{device.brand}</p>
        {device.model && (
          <p className="text-xs text-slate-500 mb-2">{device.model}</p>
        )}
        <div className="flex items-center justify-between text-xs text-slate-500">
          {device.purchaseDate && (
            <span>购买日期: {device.purchaseDate}</span>
          )}
          {device.price > 0 && (
            <span className="text-green-400 font-medium">¥{device.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function DeviceDetail({ device, onBack, onEdit, isAuthenticated }: { device: Device; onBack: () => void; onEdit?: () => void; isAuthenticated: boolean }) {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* 模糊封面背景 */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${device.imageUrl})`,
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
              <h1 className="text-xl font-bold text-white">设备详情</h1>
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
            <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-xs font-medium">
                  {deviceCategoryLabels[device.category]}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{device.name}</h2>
              {device.brand && <p className="text-sm text-slate-400 mt-1">{device.brand}</p>}
              {device.model && <p className="text-sm text-slate-400">{device.model}</p>}
              <div className="flex items-center gap-4 mt-2">
                {device.purchaseDate && <span className="text-xs text-slate-500">购买日期: {device.purchaseDate}</span>}
                {device.price > 0 && <span className="text-xs text-green-400">¥{device.price}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {device.notes && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">简评</h3>
              <p className="text-slate-300 leading-relaxed">{device.notes}</p>
            </div>
          )}

          {device.review && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">我的评价</h3>
              <div className="text-slate-300 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: device.review }} />
            </div>
          )}

          {device.images && device.images.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Gallery</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {device.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group">
                    <img src={image} alt={`${device.name} ${index + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{index + 1} / {device.images.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {device.videos && device.videos.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">视频</h3>
              </div>
              <div className="space-y-4">
                {device.videos.map((video, index) => (
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

function DeviceModal({ device, onClose, onEditDetail }: { device?: Device | null; onClose: () => void; onEditDetail?: () => void }) {
  const isEdit = !!device;
  const [formData, setFormData] = useState({
    name: device?.name || "",
    category: device?.category || deviceCategories[0],
    brand: device?.brand || "",
    model: device?.model || "",
    purchaseDate: device?.purchaseDate || "",
    price: device?.price || 0,
    imageUrl: device?.imageUrl || "",
    notes: device?.notes || ""
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
      console.error("Failed to upload image:", error);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onClose();
    if (isEdit && device) {
      window.dispatchEvent(new CustomEvent("update-device", { detail: { id: device.id, data: formData } }));
    } else {
      window.dispatchEvent(new CustomEvent("add-device", { detail: { ...formData, images: [], review: "", videos: [] } }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "编辑设备" : "添加新设备"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">设备名称</label>
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value as DeviceCategory })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
            >
              {deviceCategories.map((category) => (
                <option key={category} value={category}>{deviceCategoryLabels[category]}</option>
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
              placeholder="例如：罗技、雷蛇、索尼"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">型号</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              placeholder="e.g. G Pro X Superlight"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">购买日期</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">价格 (¥)</label>
            <input
              type="number"
              value={formData.price || ""}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">图片</label>
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
                <img src={formData.imageUrl} alt="Device preview" className="w-20 h-12 object-cover rounded-lg" />
                <span className="text-xs text-slate-400">Image preview</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="写下关于这个设备的一些备注..."
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
              {isEdit ? "保存更改" : "添加设备"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Devices() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const loaded = loadDevicesFromStorage();
    setDevices(loaded);
  }, []);

  useEffect(() => {
    const handleAddDevice = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const newDevice: Device = {
        ...detail,
        id: Date.now().toString(),
        images: detail.images || [],
        review: detail.review || "",
        videos: detail.videos || []
      };
      setDevices(prev => {
        const updated = [...prev, newDevice];
        saveDevicesToStorage(updated);
        return updated;
      });
    };

    const handleUpdateDevice = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setDevices(prev => {
        const updated = prev.map(d => d.id === detail.id ? { ...d, ...detail.data } : d);
        saveDevicesToStorage(updated);
        return updated;
      });
    };

    window.addEventListener("add-device", handleAddDevice);
    window.addEventListener("update-device", handleUpdateDevice);

    return () => {
      window.removeEventListener("add-device", handleAddDevice);
      window.removeEventListener("update-device", handleUpdateDevice);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const deviceId = searchParams.get("device");
    if (deviceId && devices.length > 0) {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        setSelectedDevice(device);
      }
    }
  }, [location.search, devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || device.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [devices, searchQuery, selectedCategory]);

  const handleDeleteDevice = (id: string) => {
    if (confirm("确定要删除这个设备吗？")) {
      setDevices(prev => {
        const updated = prev.filter(d => d.id !== id);
        saveDevicesToStorage(updated);
        return updated;
      });
    }
  };

  const handleEditDetail = () => {
    if (editingDevice) {
      navigate(`/devices/edit/${editingDevice.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {selectedDevice ? (
        <DeviceDetail 
          device={selectedDevice} 
          onBack={() => setSelectedDevice(null)} 
          onEdit={() => navigate(`/devices/edit/${selectedDevice.id}`)} 
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <>
          <ModuleHeader 
            title="John's Devices" 
            subtitle="Manage my electronic devices" 
            onAdd={() => { setEditingDevice(null); setModalOpen(true); }} 
            addLabel="添加设备" 
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索设备..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "All"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50"
                  }`}
                >
                  全部
                </button>
                {deviceCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50"
                    }`}
                  >
                    {deviceCategoryLabels[category]}
                  </button>
                ))}
              </div>
            </div>

            {/* Device Count */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">我的设备</h2>
              <p className="text-sm text-slate-400">{filteredDevices.length} 个设备</p>
            </div>

            {/* Device Grid */}
            {filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">未找到设备</h3>
                <p className="text-sm text-slate-500">创建您的第一个设备！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDevices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onEdit={(d) => { setEditingDevice(d); setModalOpen(true); }}
                    onDelete={handleDeleteDevice}
                    onClick={() => setSelectedDevice(device)}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Modal */}
          {modalOpen && (
            <DeviceModal
              device={editingDevice}
              onClose={() => { setModalOpen(false); setEditingDevice(null); }}
              onEditDetail={editingDevice ? handleEditDetail : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}
