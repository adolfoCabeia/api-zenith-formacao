import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const uploadPDF = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'raw',
    folder: 'extratos'
  });

  return result.secure_url;
};

export default uploadPDF