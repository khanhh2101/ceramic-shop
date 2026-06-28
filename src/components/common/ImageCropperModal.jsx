import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FiCheck, FiX } from 'react-icons/fi';
import Modal from './Modal';

// Hàm tiện ích cắt ảnh từ react-easy-crop
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/jpeg');
  });
}

// ------------------------------------------

export default function ImageCropperModal({ imageSrc, onCropDone, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [aspectName, setAspectName] = useState('1:1 (Vuông)');

  const RATIOS = [
    { name: '1:1 (Vuông)', value: 1 },
    { name: '4:3 (Ngang)', value: 4/3 },
    { name: '3:4 (Dọc)', value: 3/4 },
    { name: '16:9', value: 16/9 }
  ];

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedImageBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onCancel}
      maxWidth="max-w-2xl"
      zIndex={10000}
      backdropClassName="bg-black/80 backdrop-blur-sm"
      contentClassName="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl flex flex-col relative animate-fade-in-up"
    >
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
        <h3 className="text-lg font-bold text-gray-900 font-display">
          Cắt ảnh sản phẩm - {aspectName}
        </h3>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors bg-gray-50 hover:bg-red-50">
          <FiX size={20} />
        </button>
      </div>
      
      {/* Cropper Container */}
      <div className="relative w-full bg-gray-900" style={{ height: '60vh', minHeight: '400px' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      {/* Controls */}
      <div className="p-4 bg-white flex flex-col gap-4">
        {/* Tỉ lệ ảnh */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-gray-100 pb-4">
          {RATIOS.map((ratio) => (
            <button
              key={ratio.name}
              onClick={() => {
                setAspectRatio(ratio.value);
                setAspectName(ratio.name);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aspectRatio === ratio.value ? 'bg-[#b5624a] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {ratio.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-1/2">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Phóng to</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(e.target.value);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#b5624a]"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleDone}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors shadow-lg shadow-[#b5624a]/30"
          >
            <FiCheck size={18} />
            Cắt ảnh
          </button>
        </div>
        </div>
      </div>
    </Modal>
  );
}
