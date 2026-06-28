import axios from 'axios';
import api from '../services/api';

export const uploadImageToMinio = async (file) => {
  try {
    // 1. Lấy Presigned URL từ backend
    const res = await api.get('/media/presigned-url', {
      params: { fileName: file.name, bucket: 'products' }
    });
    const { putUrl, minioKey, bucket } = res.data.data;

    // 2. Upload file trực tiếp lên MinIO
    await axios.put(putUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    });

    // 3. Confirm upload với backend
    await api.post('/media/confirm', { bucket, minioKey, fileName: file.name, contentType: file.type, fileSize: file.size });

    // 4. Trả về URL public redirect
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5011';
    return `${baseUrl}/api/media/redirect/${bucket}/${minioKey}`;
  } catch (error) {
    console.error("Lỗi upload ảnh MinIO:", error);
    throw error;
  }
};
