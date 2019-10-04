/**
 * Saratetra image cache class.
 */
class ImageCache {
    constructor(definitions) {
        this.images = [];
        this.totalImages = definitions.length;
        this.totalLoaded = 0;
        var cache = this; // this hack

        // Start loading
        for (var i = 0; i < definitions.length; i++) {
            definitions[i].onload = function(key, image) {
                // Update register of images
                cache.images[key] = image;
                cache.totalLoaded++;
            };
            definitions[i].load();
        }
    }
    isFullyLoaded() {
        return this.totalLoaded == this.totalImages;
    }
}

/**
 * Saratetra image definition for image cache.
 */
class ImageDefinition {
    constructor(key, src) {
        this.key = key;
        this.src = src;
        this.onload = null;
    }
    load() {
        this.image = new Image();
        var def = this; // this hack
        this.image.onload = function() {
            if (def.onload) {
                def.onload(def.key, def.image);
            }
        };

        // Load the image
        this.image.src = this.src;
    }
}

module.exports = {
    ImageCache: ImageCache,
    ImageDefinition: ImageDefinition
};