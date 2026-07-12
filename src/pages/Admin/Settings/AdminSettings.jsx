import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiPlus, FiTrash2, FiEdit3, FiRefreshCw, FiUpload, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminSettingsApi } from './api/adminSettingsApi';
import { mediaService } from '@/services/index';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('store'); // store, home, timeline, email
  const [loading, setLoading] = useState(false);

  // --- States for Tabs ---
  const [siteSettings, setSiteSettings] = useState([]);
  const [homeBlocks, setHomeBlocks] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [emails, setEmails] = useState([]);

  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ year: '', title: '', description: '', imageUrl: '' });
  const [uploadingField, setUploadingField] = useState(null); // Để track field đang upload
  const [previewImage, setPreviewImage] = useState(null); // Lightbox preview
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'store') {
        const res = await adminSettingsApi.getSiteSettings();
        setSiteSettings(Array.isArray(res) ? res : (res?.data || res?.items || []));
      } else if (tab === 'home' || tab === 'about') {
        const res = await adminSettingsApi.getHomeBlocks();
        setHomeBlocks(Array.isArray(res) ? res : (res?.data || res?.items || []));
      } else if (tab === 'timeline') {
        const res = await adminSettingsApi.getTimeline();
        setTimeline(Array.isArray(res) ? res : (res?.data || res?.items || []));
      } else if (tab === 'email') {
        const res = await adminSettingsApi.getEmailTemplates();
        setEmails(Array.isArray(res) ? res : (res?.data || res?.items || []));
      }
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers: Site Settings ──
  const handleSiteSettingChange = (key, value) => {
    setSiteSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSiteSettings = async () => {
    try {
      const payload = siteSettings.map(s => ({ key: s.key, value: s.value }));
      await adminSettingsApi.saveSiteSettings(payload);
      toast.success('Lưu cài đặt thành công!');
    } catch (err) {
      toast.error('Lỗi khi lưu cài đặt');
    }
  };

  // ── Handlers: Home Content ──
  const handleHomeBlockChange = (blockKey, field, value) => {
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === blockKey) {
        if (field === 'isVisible') return { ...b, isVisible: value };
        const data = JSON.parse(b.dataJson || '{}');
        data[field] = value;
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const handleHomeBlockToggleVisibility = async (block) => {
    const updatedBlock = { ...block, isVisible: !block.isVisible };
    setHomeBlocks(prev => prev.map(b => b.blockKey === block.blockKey ? updatedBlock : b));
    try {
      await adminSettingsApi.saveHomeBlock(updatedBlock.blockKey, {
        dataJson: updatedBlock.dataJson,
        isVisible: updatedBlock.isVisible
      });
      toast.success(`Đã cập nhật trạng thái hiển thị của block ${block.displayName}`);
    } catch (err) {
      toast.error(`Lỗi khi cập nhật trạng thái hiển thị`);
      // Revert state on error
      setHomeBlocks(prev => prev.map(b => b.blockKey === block.blockKey ? block : b));
    }
  };

  const handleHeroSlideChange = (index, field, value) => {
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === 'hero') {
        const data = JSON.parse(b.dataJson || '{"slides":[]}');
        if (!data.slides) data.slides = [];
        data.slides[index] = { ...data.slides[index], [field]: value };
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const handleArrayChange = (blockKey, arrayField, index, field, value) => {
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === blockKey) {
        const data = JSON.parse(b.dataJson || '{}');
        if (!data[arrayField]) data[arrayField] = [];
        if (field === null) {
            // For primitive arrays (like images)
            data[arrayField][index] = value;
        } else {
            // For object arrays
            const currentItem = typeof data[arrayField][index] === 'string' ? { image: data[arrayField][index] } : data[arrayField][index];
            data[arrayField][index] = { ...currentItem, [field]: value };
        }
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const addArrayItem = (blockKey, arrayField, defaultItem) => {
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === blockKey) {
        const data = JSON.parse(b.dataJson || '{}');
        if (!data[arrayField]) data[arrayField] = [];
        data[arrayField].push(defaultItem);
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const removeArrayItem = (blockKey, arrayField, index) => {
    if (!window.confirm('Bạn có chắc muốn xoá mục này?')) return;
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === blockKey) {
        const data = JSON.parse(b.dataJson || '{}');
        if (!data[arrayField]) return b;
        data[arrayField].splice(index, 1);
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const addHeroSlide = (e) => {
    if (e) e.preventDefault();
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === 'hero') {
        const data = JSON.parse(b.dataJson || '{"slides":[]}');
        if (!data.slides) data.slides = [];
        data.slides.push({ image: '', title: 'Tiêu đề mới', subtitle: 'Phụ đề', buttonText: 'Khám phá', buttonLink: '/shop' });
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const removeHeroSlide = (e, index) => {
    if (e) e.preventDefault();
    if (!window.confirm('Bạn có chắc muốn xoá slide này?')) return;
    setHomeBlocks(prev => prev.map(b => {
      if (b.blockKey === 'hero') {
        const data = JSON.parse(b.dataJson || '{"slides":[]}');
        if (!data.slides) return b;
        data.slides.splice(index, 1);
        return { ...b, dataJson: JSON.stringify(data, null, 2) };
      }
      return b;
    }));
  };

  const saveHomeBlock = async (block) => {
    try {
      await adminSettingsApi.saveHomeBlock(block.blockKey, {
        dataJson: block.dataJson,
        isVisible: block.isVisible
      });
      toast.success(`Lưu block ${block.displayName} thành công!`);
    } catch (err) {
      toast.error(`Lỗi khi lưu block ${block.displayName}`);
    }
  };

  // ── Handlers: Email Templates ──
  const handleEmailChange = (slug, field, value) => {
    setEmails(prev => prev.map(e => e.slug === slug ? { ...e, [field]: value } : e));
  };

  const saveEmailTemplate = async (template) => {
    try {
      await adminSettingsApi.saveEmailTemplate(template.slug, {
        subject: template.subject,
        body: template.body
      });
      toast.success(`Lưu mẫu ${template.displayName} thành công!`);
    } catch (err) {
      toast.error(`Lỗi khi lưu mẫu ${template.displayName}`);
    }
  };

  // ── Handlers: Timeline ──
  const deleteTimeline = async (id) => {
    if(!window.confirm('Xoá mốc thời gian này?')) return;
    try {
      await adminSettingsApi.deleteTimeline(id);
      toast.success('Xoá thành công');
      fetchData('timeline');
    } catch (err) {
      toast.error('Lỗi khi xoá');
    }
  };
  const saveTimelineEntry = async () => {
    if (!newTimeline.year || !newTimeline.title) {
      toast.error('Vui lòng nhập Năm và Tiêu đề');
      return;
    }
    try {
      await adminSettingsApi.addTimeline(newTimeline);
      toast.success('Thêm mốc thời gian thành công!');
      setShowTimelineForm(false);
      setNewTimeline({ year: '', title: '', description: '', imageUrl: '' });
      fetchData('timeline');
    } catch (err) {
      toast.error('Lỗi khi thêm mốc thời gian');
    }
  };

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ upload file hình ảnh');
      return;
    }

    try {
      const res = await mediaService.upload(file, 'banners', 'AdminSettings');
      toast.success('Upload ảnh thành công!');
      if (res?.data?.url) {
         callback(res.url);
      }
    } catch (err) {
      toast.error('Lỗi khi upload ảnh');
    } finally {
      setUploadingField(null);
      if (e.target) e.target.value = '';
    }
  };

  const isImageField = (key) => {
    const lowerKey = key.toLowerCase();
    return lowerKey.includes('image') || lowerKey.includes('icon') || lowerKey.includes('logo') || lowerKey.includes('avatar');
  };

  // ── Render Tabs ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Cài đặt hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý cấu hình website, trang chủ và email.</p>
      </div>

      {/* ── Cửa hàng Tab ── */}
      {activeTab === 'shop' && (
        <div className="space-y-6 animate-fade-in">
          {homeBlocks
            .filter(b => b.blockKey.startsWith('shop_'))
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(block => {
              const data = JSON.parse(block.dataJson || '{}');
              return (
                <div key={block.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{block.displayName}</h3>
                        <span className="text-xs text-gray-500 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                          {block.blockKey}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Trạng thái:</span>
                          <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ease-in-out ${block.isVisible ? 'bg-green-500' : ''}`}>
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${block.isVisible ? 'translate-x-4' : ''}`}
                              onClick={(e) => { e.preventDefault(); handleHomeBlockToggleVisibility(block); }}
                            ></div>
                          </div>
                        </label>
                        <button
                          onClick={() => saveHomeBlock(block)}
                          className="flex items-center gap-1 text-sm bg-[#1a1a1a] text-white px-3 py-1.5 rounded-md hover:bg-[#b5624a] transition-colors"
                        >
                          <FiSave size={14} /> Lưu Block
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['title', 'subtitle', 'description'].map(key => data[key] !== undefined && (
                          <div key={key} className={key === 'description' ? 'md:col-span-2' : ''}>
                            <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key === 'subtitle' ? 'Phụ đề' : key === 'description' ? 'Mô tả' : 'Tiêu đề'}</label>
                            {key === 'description' ? (
                              <textarea value={data[key] || ''} onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                            ) : (
                              <input type="text" value={data[key] || ''} onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                            )}
                          </div>
                      ))}
                      
                      {/* Image Upload for shop_hero */}
                      {data.image !== undefined && (
                        <div className="md:col-span-2 mt-4 pt-4 border-t">
                           <label className="block text-xs font-medium text-gray-700 mb-2">Hình ảnh Banner</label>
                           <div className="flex gap-4 items-start">
                             <div className="w-40 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 cursor-pointer relative group"
                                  onClick={() => data.image && setPreviewImage(data.image)}>
                               {data.image ? (
                                 <>
                                   <img src={data.image} alt="Banner" className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <FiImage className="text-white w-6 h-6" />
                                   </div>
                                 </>
                               ) : (
                                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                   <FiImage size={24} className="mb-1" />
                                   <span className="text-[10px]">Chưa có ảnh</span>
                                 </div>
                               )}
                             </div>
                             <div className="flex-1 space-y-3">
                               <input 
                                 type="text" 
                                 value={data.image || ''} 
                                 onChange={(e) => handleHomeBlockChange(block.blockKey, 'image', e.target.value)} 
                                 className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" 
                                 placeholder="Nhập URL ảnh hoặc upload" 
                               />
                               <div className="relative inline-block">
                                 <button type="button" className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-colors ${uploadingField === `${block.blockKey}_image` ? 'bg-gray-100 text-gray-500 cursor-wait' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}>
                                   {uploadingField === `${block.blockKey}_image` ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span> : <FiUpload />}
                                   Tải ảnh lên
                                 </button>
                                 <input 
                                   type="file" 
                                   accept="image/*" 
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                                   disabled={!!uploadingField}
                                   onChange={(e) => {
                                     setUploadingField(`${block.blockKey}_image`);
                                     handleFileUpload(e, (url) => handleHomeBlockChange(block.blockKey, 'image', url));
                                   }} 
                                 />
                               </div>
                             </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ── Liên hệ Tab ── */}
      {activeTab === 'contact' && (
        <div className="space-y-6 animate-fade-in">
          {homeBlocks
            .filter(b => b.blockKey.startsWith('contact_'))
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(block => {
              const data = JSON.parse(block.dataJson || '{}');
              return (
                <div key={block.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{block.displayName}</h3>
                        <span className="text-xs text-gray-500 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                          {block.blockKey}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Trạng thái:</span>
                          <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ease-in-out ${block.isVisible ? 'bg-green-500' : ''}`}>
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${block.isVisible ? 'translate-x-4' : ''}`}
                              onClick={(e) => { e.preventDefault(); handleHomeBlockToggleVisibility(block); }}
                            ></div>
                          </div>
                        </label>
                        <button
                          onClick={() => saveHomeBlock(block)}
                          className="flex items-center gap-1 text-sm bg-[#1a1a1a] text-white px-3 py-1.5 rounded-md hover:bg-[#b5624a] transition-colors"
                        >
                          <FiSave size={14} /> Lưu Block
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['title', 'description'].map(key => data[key] !== undefined && (
                          <div key={key} className={key === 'description' ? 'md:col-span-2' : ''}>
                            <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key === 'description' ? 'Mô tả' : 'Tiêu đề'}</label>
                            {key === 'description' ? (
                              <textarea value={data[key] || ''} onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                            ) : (
                              <input type="text" value={data[key] || ''} onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                            )}
                          </div>
                      ))}
                      
                      {/* Image Upload for contact_hero */}
                      {data.image !== undefined && (
                        <div className="md:col-span-2 mt-4 pt-4 border-t">
                           <label className="block text-xs font-medium text-gray-700 mb-2">Hình ảnh Banner</label>
                           <div className="flex gap-4 items-start">
                             <div className="w-40 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 cursor-pointer relative group"
                                  onClick={() => data.image && setPreviewImage(data.image)}>
                               {data.image ? (
                                 <>
                                   <img src={data.image} alt="Banner" className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <FiImage className="text-white w-6 h-6" />
                                   </div>
                                 </>
                               ) : (
                                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                   <FiImage size={24} className="mb-1" />
                                   <span className="text-[10px]">Chưa có ảnh</span>
                                 </div>
                               )}
                             </div>
                             <div className="flex-1 space-y-3">
                               <input 
                                 type="text" 
                                 value={data.image || ''} 
                                 onChange={(e) => handleHomeBlockChange(block.blockKey, 'image', e.target.value)} 
                                 className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" 
                                 placeholder="Nhập URL ảnh hoặc upload" 
                               />
                               <div className="relative inline-block">
                                 <button type="button" className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-colors ${uploadingField === `${block.blockKey}_image` ? 'bg-gray-100 text-gray-500 cursor-wait' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}>
                                   {uploadingField === `${block.blockKey}_image` ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span> : <FiUpload />}
                                   Tải ảnh lên
                                 </button>
                                 <input 
                                   type="file" 
                                   accept="image/*" 
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                                   disabled={!!uploadingField}
                                   onChange={(e) => {
                                     setUploadingField(`${block.blockKey}_image`);
                                     handleFileUpload(e, (url) => handleHomeBlockChange(block.blockKey, 'image', url));
                                   }} 
                                 />
                               </div>
                             </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {['home', 'about', 'shop', 'contact', 'emails', 'general'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab 
                  ? 'border-[#b5624a] text-[#b5624a]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'home' ? 'Trang chủ' : 
               tab === 'about' ? 'Giới thiệu' :
               tab === 'shop' ? 'Cửa hàng' :
               tab === 'contact' ? 'Liên hệ' :
               tab === 'emails' ? 'Mẫu Email' : 'Cấu hình chung'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b5624a]"></div>
          </div>
        ) : (
          <>
            {/* ── TAB: CẤU HÌNH CHUNG ── */}
            {activeTab === 'store' && (
              <div className="space-y-8 max-w-4xl">
                {/* Group By 'Group' property */}
                {[...new Set(siteSettings.map(s => s.group))].map(group => {
                  const groupSettings = siteSettings.filter(s => s.group === group);
                  if (groupSettings.length === 0) return null;
                  
                  return (
                    <div key={group} className="border border-gray-200 rounded-lg p-5">
                      <h3 className="text-lg font-medium text-gray-900 capitalize mb-4 border-b pb-2">
                        {group} Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupSettings.map(setting => {
                          const isJsonOrTextarea = setting.dataType === 'json' || setting.key.includes('description') || setting.key.includes('about') || setting.key.includes('map');
                          const isImage = setting.dataType === 'image' || isImageField(setting.key);

                          return (
                            <div key={setting.key} className={isJsonOrTextarea ? 'md:col-span-2' : ''}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {setting.description || setting.displayName} <span className="text-gray-400 font-normal">({setting.key})</span>
                              </label>
                              
                              {isImage ? (
                                <div className="flex gap-2 items-start">
                                  <div className="flex-1 space-y-2">
                                    <input
                                      type="text"
                                      value={setting.value || ''}
                                      onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
                                      placeholder="URL ảnh"
                                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                    />
                                    <label className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${uploadingField === setting.key ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                      <FiUpload /> {uploadingField === setting.key ? 'Đang tải lên...' : 'Tải ảnh lên'}
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                          setUploadingField(setting.key);
                                          handleFileUpload(e, (url) => handleSiteSettingChange(setting.key, url));
                                        }}
                                      />
                                    </label>
                                  </div>
                                  {setting.value && (
                                    <img 
                                      src={setting.value} 
                                      alt="Preview" 
                                      className="w-16 h-16 object-cover rounded border bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity" 
                                      onClick={() => setPreviewImage(setting.value)}
                                    />
                                  )}
                                </div>
                              ) : isJsonOrTextarea ? (
                                <textarea
                                  value={setting.value || ''}
                                  onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={setting.value || ''}
                                  onChange={(e) => handleSiteSettingChange(setting.key, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={saveSiteSettings}
                    className="flex items-center gap-2 bg-[#b5624a] text-white px-6 py-2 rounded-lg hover:bg-[#8e4a36] transition-colors"
                  >
                    <FiSave /> Lưu cấu hình
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: TRANG CHỦ & GIỚI THIỆU ── */}
            {(activeTab === 'home' || activeTab === 'about') && (
              <div className="space-y-6">
                {homeBlocks.filter(b => activeTab === 'home' ? (!b.blockKey.startsWith('about_') && b.blockKey !== 'brand_story') : (b.blockKey.startsWith('about_') || b.blockKey === 'brand_story')).map(block => {
                  const data = JSON.parse(block.dataJson || '{}');
                  return (
                    <div key={block.blockKey} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-medium text-gray-900">{block.displayName}</h3>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm text-gray-600">Hiển thị:</span>
                            <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ease-in-out ${block.isVisible ? 'bg-green-500' : ''}`}>
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${block.isVisible ? 'translate-x-4' : ''}`}
                                onClick={(e) => { e.preventDefault(); handleHomeBlockToggleVisibility(block); }}
                              ></div>
                            </div>
                          </label>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); saveHomeBlock(block); }}
                            className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 flex items-center gap-2"
                          >
                            <FiSave size={14}/> Lưu Block
                          </button>
                        </div>
                      </div>

                      {block.blockKey === 'hero' ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border">
                            <span className="text-sm font-medium text-gray-700">Danh sách Slide ({data.slides?.length || 0})</span>
                            <button type="button" onClick={addHeroSlide} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-100">
                              <FiPlus size={14} /> Thêm Slide
                            </button>
                          </div>
                          {data.slides && data.slides.map((slide, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                              <div className="absolute top-4 right-4 flex gap-2">
                                <button type="button" onClick={(e) => removeHeroSlide(e, index)} className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm" title="Xoá slide">
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                              <h4 className="font-medium text-sm mb-4 border-b pb-2">Slide {index + 1}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 flex gap-4 items-start">
                                  <div className="flex-1 space-y-2">
                                    <label className="block text-xs font-medium text-gray-700">Hình ảnh</label>
                                    <input
                                      type="text"
                                      value={slide.image || ''}
                                      onChange={(e) => handleHeroSlideChange(index, 'image', e.target.value)}
                                      placeholder="URL ảnh"
                                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                    />
                                    <label className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${uploadingField === `hero-slide-${index}` ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                      <FiUpload /> {uploadingField === `hero-slide-${index}` ? 'Đang tải lên...' : 'Tải ảnh lên'}
                                      <input 
                                        type="file" className="hidden" accept="image/*" 
                                        onChange={(e) => {
                                          setUploadingField(`hero-slide-${index}`);
                                          handleFileUpload(e, (url) => handleHeroSlideChange(index, 'image', url));
                                        }}
                                      />
                                    </label>
                                  </div>
                                  {slide.image && (
                                    <div className="shrink-0 mt-6">
                                      <img 
                                        src={slide.image} 
                                        alt="Preview" 
                                        className="w-24 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                                        onClick={() => setPreviewImage(slide.image)}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Tiêu đề</label>
                                  <input
                                    type="text" value={slide.title || ''}
                                    onChange={(e) => handleHeroSlideChange(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả (Subtitle)</label>
                                  <input
                                    type="text" value={slide.subtitle || ''}
                                    onChange={(e) => handleHeroSlideChange(index, 'subtitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Chữ nút bấm</label>
                                  <input
                                    type="text" value={slide.buttonText || ''}
                                    onChange={(e) => handleHeroSlideChange(index, 'buttonText', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Link nút bấm</label>
                                  <input
                                    type="text" value={slide.buttonLink || ''}
                                    onChange={(e) => handleHeroSlideChange(index, 'buttonLink', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (block.blockKey === 'brand_story' || block.blockKey === 'about_gallery') ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(block.blockKey === 'brand_story' ? ['subtitle', 'title', 'content'] : ['title', 'subtitle', 'instagramLink', 'instagramText']).map(key => (
                                <div key={key} className={key === 'content' ? 'md:col-span-2' : ''}>
                                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key === 'subtitle' ? 'Phụ đề (Subtitle)' : key}</label>
                                  {key === 'content' ? (
                                    <textarea value={data[key] || ''} onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                  ) : (
                                    <input type="text" value={data[key] || ''} onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                  )}
                                </div>
                            ))}
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm font-medium text-gray-700">Danh sách Hình ảnh</span>
                              <button type="button" onClick={() => addArrayItem(block.blockKey, 'images', { image: '', link: '' })} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-100">
                                <FiPlus size={14} /> Thêm ảnh
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {data.images?.map((img, idx) => {
                                const imgSrc = typeof img === 'string' ? img : img.image;
                                const imgLink = typeof img === 'string' ? '' : (img.link || '');
                                return (
                                <div key={idx} className="flex flex-col gap-2 border p-3 rounded bg-gray-50 relative">
                                  <button type="button" onClick={() => removeArrayItem(block.blockKey, 'images', idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"><FiTrash2 /></button>
                                  <div className="flex gap-4 items-start mt-2">
                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                                        <input type="text" value={imgSrc || ''} onChange={(e) => handleArrayChange(block.blockKey, 'images', idx, 'image', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" placeholder="https://..." />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Link chuyển hướng (Tuỳ chọn)</label>
                                        <input type="text" value={imgLink || ''} onChange={(e) => handleArrayChange(block.blockKey, 'images', idx, 'link', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" placeholder="VD: /shop hoặc https://..." />
                                      </div>
                                    </div>
                                    {imgSrc && <img src={imgSrc} alt="preview" className="w-20 h-20 object-cover rounded shadow-sm cursor-pointer border" onClick={() => setPreviewImage(imgSrc)} />}
                                  </div>
                                </div>
                              )})}
                            </div>
                          </div>
                        </div>
                      ) : (block.blockKey === 'about_stats') ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                              <span className="text-sm font-medium text-gray-700">Thống Kê</span>
                              <button type="button" onClick={() => addArrayItem(block.blockKey, 'stats', {number:'', label:''})} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-100">
                                <FiPlus size={14} /> Thêm Thống Kê
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {data.stats?.map((stat, idx) => (
                                <div key={idx} className="flex gap-2 items-start border p-3 rounded bg-gray-50 relative">
                                  <button type="button" onClick={() => removeArrayItem(block.blockKey, 'stats', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FiTrash2 /></button>
                                  <div className="flex-1 space-y-2">
                                    <input type="text" value={stat.number} onChange={(e) => handleArrayChange(block.blockKey, 'stats', idx, 'number', e.target.value)} placeholder="Số (VD: 5+)" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                    <input type="text" value={stat.label} onChange={(e) => handleArrayChange(block.blockKey, 'stats', idx, 'label', e.target.value)} placeholder="Nhãn (VD: Năm Thành Lập)" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                  </div>
                                </div>
                              ))}
                            </div>
                        </div>
                      ) : (block.blockKey === 'about_values') ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div><label className="text-xs font-medium text-gray-700">Tiêu đề</label><input type="text" value={data.title||''} onChange={(e) => handleHomeBlockChange(block.blockKey, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" /></div>
                                <div><label className="text-xs font-medium text-gray-700">Mô tả</label><textarea value={data.description||''} onChange={(e) => handleHomeBlockChange(block.blockKey, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" /></div>
                            </div>
                            <div className="flex justify-between items-center mb-4 border-b pt-4 pb-2">
                              <span className="text-sm font-medium text-gray-700">Danh sách Giá Trị</span>
                              <button type="button" onClick={() => addArrayItem(block.blockKey, 'values', {image:'', title:'', description:'', icon:''})} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-600 px-3 py-1.5 rounded-md hover:bg-primary-100">
                                <FiPlus size={14} /> Thêm
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {data.values?.map((val, idx) => (
                                <div key={idx} className="flex gap-4 items-start border p-4 rounded bg-gray-50 relative">
                                  <button type="button" onClick={() => removeArrayItem(block.blockKey, 'values', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FiTrash2 /></button>
                                  <div className="flex-1 space-y-3">
                                    <input type="text" value={val.image} onChange={(e) => handleArrayChange(block.blockKey, 'values', idx, 'image', e.target.value)} placeholder="URL Hình Nền" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                    <input type="text" value={val.title} onChange={(e) => handleArrayChange(block.blockKey, 'values', idx, 'title', e.target.value)} placeholder="Tiêu đề" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                    <textarea value={val.description} onChange={(e) => handleArrayChange(block.blockKey, 'values', idx, 'description', e.target.value)} placeholder="Mô tả" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm" />
                                  </div>
                                </div>
                              ))}
                            </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.keys(data).filter(key => typeof data[key] !== 'object').map(key => (
                            <div key={key} className={key === 'content' || key === 'description' ? 'md:col-span-2' : ''}>
                              <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key}</label>
                              {key === 'content' || key === 'description' ? (
                                <textarea
                                  value={data[key]}
                                  onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                />
                              ) : isImageField(key) ? (
                                <div className="flex gap-2 items-start">
                                  <div className="flex-1 space-y-2">
                                    <input
                                      type="text"
                                      value={data[key]}
                                      onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)}
                                      placeholder="Hoặc dán URL ảnh vào đây"
                                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                    />
                                    <label className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${uploadingField === `${block.blockKey}-${key}` ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                      <FiUpload /> {uploadingField === `${block.blockKey}-${key}` ? 'Đang tải lên...' : 'Tải ảnh lên'}
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                          setUploadingField(`${block.blockKey}-${key}`);
                                          handleFileUpload(e, (url) => handleHomeBlockChange(block.blockKey, key, url));
                                        }}
                                      />
                                    </label>
                                  </div>
                                  {data[key] && (
                                    <img 
                                      src={data[key]} 
                                      alt="Preview" 
                                      className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                                      onClick={() => setPreviewImage(data[key])}
                                    />
                                  )}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={data[key]}
                                  onChange={(e) => handleHomeBlockChange(block.blockKey, key, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB: DẤU ẤN LỊCH SỬ (TIMELINE) ── */}
            {activeTab === 'timeline' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-900">Mốc thời gian</h3>
                  <button 
                    onClick={() => setShowTimelineForm(!showTimelineForm)}
                    className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <FiPlus /> Thêm mốc mới
                  </button>
                </div>
                
                {showTimelineForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                    <h4 className="text-md font-medium mb-4">Thêm mốc lịch sử</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Năm</label>
                        <input
                          type="number"
                          value={newTimeline.year}
                          onChange={(e) => setNewTimeline({...newTimeline, year: parseInt(e.target.value) || ''})}
                          placeholder="VD: 2024"
                          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#b5624a]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tiêu đề</label>
                        <input
                          type="text"
                          value={newTimeline.title}
                          onChange={(e) => setNewTimeline({...newTimeline, title: e.target.value})}
                          placeholder="VD: Khai trương cửa hàng đầu tiên"
                          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#b5624a]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                          value={newTimeline.description}
                          onChange={(e) => setNewTimeline({...newTimeline, description: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#b5624a]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Hình ảnh minh hoạ</label>
                        <div className="flex gap-4 items-center">
                          {newTimeline.imageUrl ? (
                            <img 
                              src={newTimeline.imageUrl} 
                              alt="preview" 
                              className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                              onClick={() => setPreviewImage(newTimeline.imageUrl)}
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded border flex items-center justify-center text-gray-400">
                              <FiImage size={24} />
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={newTimeline.imageUrl}
                              onChange={(e) => setNewTimeline({...newTimeline, imageUrl: e.target.value})}
                              placeholder="Dán URL ảnh hoặc tải lên"
                              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#b5624a]"
                            />
                            <label className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${uploadingField === 'timeline-new' ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                              <FiUpload /> {uploadingField === 'timeline-new' ? 'Đang tải lên...' : 'Tải ảnh lên'}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => {
                                  setUploadingField('timeline-new');
                                  handleFileUpload(e, (url) => setNewTimeline({...newTimeline, imageUrl: url}));
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowTimelineForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Huỷ</button>
                      <button onClick={saveTimelineEntry} className="px-4 py-2 text-sm font-medium text-white bg-[#b5624a] hover:bg-[#8e4a36] rounded-lg flex items-center gap-2">
                        <FiSave /> Lưu mốc lịch sử
                      </button>
                    </div>
                  </div>
                )}
                {timeline.map(entry => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className="text-2xl font-display font-bold text-[#b5624a]">{entry.year}</div>
                      <img src={entry.imageUrl || 'https://via.placeholder.com/150'} alt={entry.title} className="mt-2 w-full h-24 object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{entry.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{entry.description}</p>
                      <button onClick={() => deleteTimeline(entry.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                        <FiTrash2 size={14} /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && <p className="text-gray-500 text-center py-4">Chưa có mốc thời gian nào.</p>}
              </div>
            )}

            {/* ── TAB: EMAIL TEMPLATES ── */}
            {activeTab === 'email' && (
              <div className="space-y-6 max-w-4xl">
                <p className="text-sm text-gray-500 mb-6">Chỉnh sửa nội dung các mẫu email tự động được gửi từ hệ thống.</p>
                {emails.map(email => (
                  <div key={email.slug} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="text-lg font-medium text-gray-900">{email.displayName}</h3>
                      <button
                        onClick={() => saveEmailTemplate(email)}
                        className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 flex items-center gap-2"
                      >
                        <FiSave size={14}/> Lưu Template
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tiêu đề Email (Subject)</label>
                        <input
                          type="text"
                          value={email.subject}
                          onChange={(e) => handleEmailChange(email.slug, 'subject', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 flex justify-between">
                          <span>Nội dung HTML (Body)</span>
                          <span className="text-gray-400 font-normal">Biến có sẵn: {email.availablePlaceholders}</span>
                        </label>
                        <textarea
                          value={email.body}
                          onChange={(e) => handleEmailChange(email.slug, 'body', e.target.value)}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#b5624a] text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox Preview Modal ── */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setPreviewImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={previewImage} alt="Preview Zoom" className="max-h-[80vh] object-contain rounded shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
