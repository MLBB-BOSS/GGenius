/**
 * 🖼️ IMAGE PROCESSOR WORKER - Advanced Image Optimization
 * High-performance image processing without blocking UI
 */

'use strict';

class ImageProcessor {
    constructor() {
        this.canvas = new OffscreenCanvas(1, 1);
        this.ctx = this.canvas.getContext('2d');
        this.isReady = false;
        this.init();
    }

    init() {
        console.log('🖼️ Image Processor Worker initialized');
        this.isReady = true;
    }

    async processImage(data) {
        const { action, imageData, options = {} } = data;
        
        switch (action) {
            case 'optimize':
                return this.optimizeImage(imageData, options);
            case 'resize':
                return this.resizeImage(imageData, options);
            case 'compress':
                return this.compressImage(imageData, options);
            case 'enhance':
                return this.enhanceImage(imageData, options);
            case 'filter':
                return this.applyFilter(imageData, options);
            default:
                throw new Error(`Unknown image action: ${action}`);
        }
    }

    async optimizeImage(imageData, options) {
        const {
            quality = 0.8,
            maxWidth = 1920,
            maxHeight = 1080,
            format = 'webp'
        } = options;

        try {
            // Create image from data
            const img = await this.createImageFromData(imageData);
            
            // Calculate optimal dimensions
            const { width, height } = this.calculateOptimalSize(
                img.width, img.height, maxWidth, maxHeight
            );

            // Resize canvas
            this.canvas.width = width;
            this.canvas.height = height;

            // Draw and optimize
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            this.ctx.drawImage(img, 0, 0, width, height);

            // Convert to optimized format
            const blob = await this.canvas.convertToBlob({
                type: `image/${format}`,
                quality
            });

            return {
                success: true,
                data: {
                    blob,
                    originalSize: imageData.size || 0,
                    optimizedSize: blob.size,
                    compressionRatio: blob.size / (imageData.size || blob.size),
                    dimensions: { width, height },
                    format
                },
                processingTime: performance.now()
            };

        } catch (error) {
            throw new Error(`Image optimization failed: ${error.message}`);
        }
    }

    async resizeImage(imageData, options) {
        const { width, height, maintainAspectRatio = true } = options;

        try {
            const img = await this.createImageFromData(imageData);
            
            let newWidth = width;
            let newHeight = height;

            if (maintainAspectRatio) {
                const aspectRatio = img.width / img.height;
                if (width && !height) {
                    newHeight = width / aspectRatio;
                } else if (height && !width) {
                    newWidth = height * aspectRatio;
                }
            }

            this.canvas.width = newWidth;
            this.canvas.height = newHeight;

            this.ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const blob = await this.canvas.convertToBlob();

            return {
                success: true,
                data: {
                    blob,
                    dimensions: { width: newWidth, height: newHeight }
                },
                processingTime: performance.now()
            };

        } catch (error) {
            throw new Error(`Image resize failed: ${error.message}`);
        }
    }

    async compressImage(imageData, options) {
        const { quality = 0.7, format = 'jpeg' } = options;

        try {
            const img = await this.createImageFromData(imageData);
            
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            
            this.ctx.drawImage(img, 0, 0);

            const blob = await this.canvas.convertToBlob({
                type: `image/${format}`,
                quality
            });

            return {
                success: true,
                data: {
                    blob,
                    originalSize: imageData.size || 0,
                    compressedSize: blob.size,
                    compressionRatio: blob.size / (imageData.size || blob.size)
                },
                processingTime: performance.now()
            };

        } catch (error) {
            throw new Error(`Image compression failed: ${error.message}`);
        }
    }

    async enhanceImage(imageData, options) {
        const {
            brightness = 1,
            contrast = 1,
            saturation = 1,
            sharpen = false
        } = options;

        try {
            const img = await this.createImageFromData(imageData);
            
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            
            // Apply filters
            this.ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
            this.ctx.drawImage(img, 0, 0);

            if (sharpen) {
                await this.applySharpenFilter();
            }

            const blob = await this.canvas.convertToBlob();

            return {
                success: true,
                data: { blob },
                processingTime: performance.now()
            };

        } catch (error) {
            throw new Error(`Image enhancement failed: ${error.message}`);
        }
    }

    async applyFilter(imageData, options) {
        const { filterType = 'none', intensity = 1 } = options;

        try {
            const img = await this.createImageFromData(imageData);
            
            this.canvas.width = img.width;
            this.canvas.height = img.height;

            let filter = 'none';
            
            switch (filterType) {
                case 'grayscale':
                    filter = `grayscale(${intensity})`;
                    break;
                case 'sepia':
                    filter = `sepia(${intensity})`;
                    break;
                case 'blur':
                    filter = `blur(${intensity}px)`;
                    break;
                case 'vintage':
                    filter = `sepia(0.5) contrast(1.2) brightness(1.1)`;
                    break;
                default:
                    filter = 'none';
            }

            this.ctx.filter = filter;
            this.ctx.drawImage(img, 0, 0);

            const blob = await this.canvas.convertToBlob();

            return {
                success: true,
                data: { blob, filter: filterType },
                processingTime: performance.now()
            };

        } catch (error) {
            throw new Error(`Filter application failed: ${error.message}`);
        }
    }

    // Helper methods
    async createImageFromData(imageData) {
        const blob = imageData instanceof Blob ? imageData : new Blob([imageData]);
        const imageBitmap = await createImageBitmap(blob);
        return imageBitmap;
    }

    calculateOptimalSize(originalWidth, originalHeight, maxWidth, maxHeight) {
        const aspectRatio = originalWidth / originalHeight;
        
        let width = originalWidth;
        let height = originalHeight;

        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        return { width: Math.floor(width), height: Math.floor(height) };
    }

    async applySharpenFilter() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Simple sharpening kernel
        const weights = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ];

        const newData = new Uint8ClampedArray(data);
        const width = this.canvas.width;
        const height = this.canvas.height;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += data[idx] * weights[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
                    const idx = (y * width + x) * 4 + c;
                    newData[idx] = Math.max(0, Math.min(255, sum));
                }
            }
        }

        const newImageData = new ImageData(newData, width, height);
        this.ctx.putImageData(newImageData, 0, 0);
    }
}

// Worker message handler
const processor = new ImageProcessor();

self.addEventListener('message', async (event) => {
    const { taskId, type, data, options } = event.data;
    
    try {
        if (!processor.isReady) {
            throw new Error('Image Processor not ready');
        }

        let result;
        
        switch (type) {
            case 'image-processor':
                result = await processor.processImage(data);
                break;
            default:
                throw new Error(`Unknown task type: ${type}`);
        }

        self.postMessage({
            taskId,
            type,
            result,
            success: true
        });

    } catch (error) {
        self.postMessage({
            taskId,
            type,
            error: error.message,
            success: false
        });
    }
});

console.log('🖼️ Image Processor Worker ready');
