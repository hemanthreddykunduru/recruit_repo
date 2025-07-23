/**
 * Applies a smoothing filter with variable kernel size
 * @param {ImageData} imageData - The image data to process
 * @param {number} kernelSize - Size of the smoothing kernel (3, 5, 7, 9, etc.)
 * @returns {ImageData} - New image data with smoothing applied
 */
function applySmoothingFilter(imageData, kernelSize = 3) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Create output array
    const output = new Uint8ClampedArray(data.length);
    
    const halfKernel = Math.floor(kernelSize / 2); // For 3x3: halfKernel = 1
    const kernelArea = kernelSize * kernelSize;    // Total pixels in kernel
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
            let pixelCount = 0;
            
            // Iterate through the NxN neighborhood
            for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    
                    // Handle border pixels (clamp to edges)
                    const clampedX = Math.max(0, Math.min(width - 1, nx));
                    const clampedY = Math.max(0, Math.min(height - 1, ny));
                    
                    const neighborIndex = (clampedY * width + clampedX) * 4;
                    
                    sumR += data[neighborIndex];
                    sumG += data[neighborIndex + 1];
                    sumB += data[neighborIndex + 2];
                    sumA += data[neighborIndex + 3];
                    pixelCount++;
                }
            }
            
            // Calculate average and set output pixel
            const currentIndex = (y * width + x) * 4;
            output[currentIndex] = Math.round(sumR / pixelCount);
            output[currentIndex + 1] = Math.round(sumG / pixelCount);
            output[currentIndex + 2] = Math.round(sumB / pixelCount);
            output[currentIndex + 3] = Math.round(sumA / pixelCount);
        }
    }
    
    // Return new ImageData with smoothed pixels
    return new ImageData(output, width, height);
}
