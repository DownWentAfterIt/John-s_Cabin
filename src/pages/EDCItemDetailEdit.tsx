import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Image, Video, Upload, ArrowLeft, Save, Check } from "lucide-react";
import { fileToBase64, isImageFile, isVideoFile } from "../utils/upload";
import { RichTextEditor } from "../components/RichTextEditor";
import { EDCItem } from "../types";

const STORAGE_KEY = "johns-cabin-edc-items";

const loadItemsFromStorage = (): EDCItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveItemsToStorage = (items: EDCItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export default function EDCItemDetailEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<EDCItem | null>(null);

  const [review, setReview] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  useEffect(() => {
    const items = loadItemsFromStorage();
    const foundItem = items.find((i) => i.id === id);
    if (foundItem) {
      setItem(foundItem);
      setReview(foundItem.review || "");
      setImages(foundItem.images || []);
      setVideos(foundItem.videos || []);
    }
    setLoading(false);
  }, [id]);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      setVideos((prev) => [...prev, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isImageFile(file)) return;

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setImages((prev) => [...prev, base64]);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isVideoFile(file)) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("Video file is too large (max 50MB)");
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setVideos((prev) => [...prev, base64]);
    } catch (error) {
      console.error("Failed to upload video:", error);
    }
    setUploading(false);
    e.target.value = "";
  };

  // 自动保存函数
  const autoSave = () => {
    if (!id || !hasChangesRef.current) return;
    
    setSaveStatus('saving');
    const items = loadItemsFromStorage();
    const updatedItems = items.map((i) =>
      i.id === id ? { ...i, review, images, videos } : i
    );
    saveItemsToStorage(updatedItems);
    hasChangesRef.current = false;
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // 监听数据变化，自动保存
  useEffect(() => {
    if (!loading && item) {
      hasChangesRef.current = true;
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(autoSave, 2000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [review, images, videos, loading, item]);

  const handleSave = () => {
    if (!id) return;

    const items = loadItemsFromStorage();
    const updatedItems = items.map((i) =>
      i.id === id ? { ...i, review, images, videos } : i
    );
    saveItemsToStorage(updatedItems);
    navigate("/edc");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-slate-400 text-lg">EDC Item not found</div>
        <button
          onClick={() => navigate("/edc")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Back to EDC
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/edc")}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Edit EDC Item Detail</h1>
                <p className="text-sm text-slate-400">{item.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 自动保存状态 */}
              {saveStatus !== 'idle' && (
                <div className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                  saveStatus === 'saving' 
                    ? 'bg-slate-700/50 text-slate-400' 
                    : 'bg-green-600/20 text-green-400'
                }`}>
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>已保存</span>
                    </>
                  )}
                </div>
              )}
              <button
                onClick={() => navigate("/edc")}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white rounded-lg transition-opacity flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Review</h2>
          <RichTextEditor
            value={review}
            onChange={setReview}
            placeholder="Write a detailed review about the EDC item..."
          />
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Gallery Images</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Image URL"
              onKeyDown={(e) => e.key === "Enter" && handleAddImage()}
              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              URL
            </button>
            <label className="px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Videos</h2>
            <span className="text-xs text-slate-500">(max 50MB)</span>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Video URL"
              onKeyDown={(e) => e.key === "Enter" && handleAddVideo()}
              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              URL
            </button>
            <label className="px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload"}</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
          {videos.length > 0 && (
            <div className="space-y-2">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-2"
                >
                  <Video className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="flex-1 text-xs text-slate-300 truncate">
                    {video.startsWith("data:")
                      ? `Local video ${index + 1}`
                      : video.substring(0, 40)}
                    ...
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
