class ImageHelper {
    constructor(path) {
      if (path) {
        const img = new Image();
        img.src = path;
  
        return img
      }else{
        log.console.error("ImageHelper empty path ");
      }
    }
  }