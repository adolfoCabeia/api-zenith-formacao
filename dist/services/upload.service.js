import cloudinary from '../config/cloudinary.js';
export class UploadService {
    /**
     * Faz upload de um ficheiro para o Cloudinary
     * @param file
     * @param folder
     * @returns
     */
    static async uploadFile(file, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: `centro-formacao/${folder}`,
                resource_type: 'auto',
                allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
                transformation: [
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' },
                ],
            }, (error, result) => {
                if (error) {
                    console.error('[Cloudinary] Erro no upload:', error);
                    reject(new Error(`Falha no upload: ${error.message}`));
                }
                else if (result) {
                    console.log('[Cloudinary] Upload sucesso:', result.secure_url);
                    resolve(result.secure_url);
                }
                else {
                    reject(new Error('Upload falhou sem resultado'));
                }
            });
            uploadStream.end(file.buffer);
        });
    }
    /**
     * Remove um ficheiro do Cloudinary pela URL
     * @param url
     */
    static async deleteFile(url) {
        try {
            const publicId = this.extractPublicId(url);
            if (!publicId) {
                console.warn('[Cloudinary] Não foi possível extrair public_id da URL:', url);
                return;
            }
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('[Cloudinary] Ficheiro removido:', publicId, result);
        }
        catch (error) {
            console.error('[Cloudinary] Erro ao remover ficheiro:', error);
            // Não lança erro para não bloquear operações
        }
    }
    static extractPublicId(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            // Encontrar o índice após 'upload' (pode ter versão v123456)
            const uploadIndex = pathParts.findIndex(part => part === 'upload');
            if (uploadIndex === -1)
                return null;
            // Pegar tudo após 'upload', ignorando versão se existir
            const relevantParts = pathParts.slice(uploadIndex + 1);
            if (relevantParts[0]?.startsWith('v')) {
                relevantParts.shift(); // Remove versão
            }
            // Remove extensão do último segmento
            const lastPart = relevantParts[relevantParts.length - 1];
            relevantParts[relevantParts.length - 1] = lastPart.replace(/\.[^/.]+$/, '');
            return relevantParts.join('/');
        }
        catch {
            return null;
        }
    }
}
//# sourceMappingURL=upload.service.js.map