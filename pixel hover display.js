/**
 * Sets up pixel value display on mouse hover
 * Shows (R,G,B,A) values and coordinates when hovering over canvas
 */
function setupPixelHoverDisplay() {
    const canvas = document.getElementById('originalCanvas');
    const pixelInfo = document.getElementById('pixelInfo');
    const pixelCoords = document.getElementById('pixelCoords');
    const pixelValues = document.getElementById('pixelValues');
    const colorSwatch = document.getElementById('colorSwatch');
    
    let imageData = null;
    
    // Get image data when image is loaded
    function updateImageData() {
        const ctx = canvas.getContext('2d');
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    // Mouse move event handler
    canvas.addEventListener('mousemove', function(event) {
        if (!imageData) {
            updateImageData();
        }
        
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;   // Handle CSS scaling
        const scaleY = canvas.height / rect.height;
        
        const x = Math.floor((event.clientX - rect.left) * scaleX);
        const y = Math.floor((event.clientY - rect.top) * scaleY);
        
        // Ensure coordinates are within canvas bounds
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            // Calculate pixel index in ImageData array
            const pixelIndex = (y * canvas.width + x) * 4;
            
            // Extract RGBA values
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            const a = imageData.data[pixelIndex + 3];
            
            // Update display
            pixelCoords.textContent = `X: ${x}, Y: ${y}`;
            pixelValues.textContent = `R: ${r}, G: ${g}, B: ${b}, A: ${a}`;
            
            // Update color swatch
            if (colorSwatch) {
                colorSwatch.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a/255})`;
            }
            
            // Show pixel info
            pixelInfo.style.display = 'block';
            
            // Position tooltip near cursor
            pixelInfo.style.left = (event.clientX + 15) + 'px';
            pixelInfo.style.top = (event.clientY - 50) + 'px';
        }
    });
    
    // Hide pixel info when mouse leaves canvas
    canvas.addEventListener('mouseleave', function() {
        pixelInfo.style.display = 'none';
        pixelCoords.textContent = 'X: -, Y: -';
        pixelValues.textContent = 'R: -, G: -, B: -, A: -';
        if (colorSwatch) {
            colorSwatch.style.backgroundColor = 'transparent';
        }
    });
    
    // Update imageData when image changes
    canvas.addEventListener('imageUpdated', updateImageData);
    
    return { updateImageData };
}
