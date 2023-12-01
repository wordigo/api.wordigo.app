import sharp from "sharp";

const ImageCompress = async (base64: string, quality: number = 0.8): Promise<string> => {
  try {
    // Base64 string'in başındaki 'data:image/[format];base64,' kısmını kaldır
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

    // Base64 string'i Buffer'a dönüştür
    const buffer = Buffer.from(base64Data, 'base64');

    // Sharp ile görüntüyü işle ve sıkıştır
    const output = await sharp(buffer)
      .jpeg({ quality: quality * 100 }) // Kaliteyi % olarak ayarla
      .toBuffer();

    // Sonucu base64 olarak dönüştür ve döndür
    return `data:image/jpeg;base64,${output.toString('base64')}`;
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
};

export default ImageCompress;
