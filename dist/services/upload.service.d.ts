interface UploadFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}
export declare class UploadService {
    /**
     * Faz upload de um ficheiro para o Cloudinary
     * @param file
     * @param folder
     * @returns
     */
    static uploadFile(file: UploadFile, folder: string): Promise<string>;
    /**
     * Remove um ficheiro do Cloudinary pela URL
     * @param url
     */
    static deleteFile(url: string): Promise<void>;
    private static extractPublicId;
}
export {};
//# sourceMappingURL=upload.service.d.ts.map