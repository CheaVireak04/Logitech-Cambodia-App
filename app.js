/**
 * BRICK STORE - Configuration File
 * Isolates global settings for easy maintenance and scaling.
 */

const STORE_CONFIG = {
    // Number of items to display per category on the home screen
    maxNewArrivals: 4,    
    maxTrending: 4,       
    maxBestDeals: 4,      
    maxBestSelling: 4
    
    // Note: minPrice and maxPrice are calculated dynamically in app.js 
    // based on the actual product catalog to ensure accuracy.
};
