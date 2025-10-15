import { Router, Request, Response } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

const router = Router();

const uploadsDir = join(process.cwd(), 'public', 'uploads');

router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const [, ext, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filename = `${nanoid()}.${ext}`;
    const filepath = join(uploadsDir, filename);
    
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filepath, buffer);
    
    const url = `/uploads/${filename}`;
    res.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.post('/upload-multiple', async (req: Request, res: Response) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const urls: string[] = [];
    await mkdir(uploadsDir, { recursive: true });

    for (const image of images) {
      const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        continue;
      }

      const [, ext, base64Data] = matches;
      const buffer = Buffer.from(base64Data, 'base64');
      
      const filename = `${nanoid()}.${ext}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    res.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

export default router;
