import cloudinary from '../config/cloudinary.js';
export const uploadToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: 'uploads' }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        })
            .end(fileBuffer);
    });
};
//# sourceMappingURL=upload.service.js.map