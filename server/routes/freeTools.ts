import { Router } from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import OpenAI from 'openai';

const execAsync = promisify(exec);
const router = Router();
const upload = multer({ dest: tmpdir() });

// Initialize OpenAI client (uses OPENAI_API_KEY from environment)
const openai = new OpenAI();

// AI Chat endpoint
router.post('/ai/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Use gpt-4.1-mini for cost efficiency
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: messages,
      max_tokens: 500, // Limit tokens to control costs
    });

    const message = completion.choices[0]?.message?.content || 'No response';

    res.json({ message });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Image Generation endpoint
router.post('/ai/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    // Use DALL-E 3 for image generation
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned');
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Speech-to-Text endpoint
router.post('/ai/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioPath = req.file.path;

    try {
      // Use manus-speech-to-text utility
      const { stdout } = await execAsync(`manus-speech-to-text "${audioPath}"`);
      
      // Clean up uploaded file
      await unlink(audioPath);

      res.json({ text: stdout.trim() });
    } catch (error) {
      // Clean up on error
      await unlink(audioPath);
      throw error;
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// PDF Tools endpoint
router.post('/pdf/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { tool } = req.body;
    const inputPath = req.file.path;
    const outputPath = path.join(tmpdir(), `output-${Date.now()}.pdf`);

    try {
      if (tool === 'markdown-to-pdf') {
        // Use manus-md-to-pdf utility
        await execAsync(`manus-md-to-pdf "${inputPath}" "${outputPath}"`);
      } else if (tool === 'merge-pdf') {
        // For merge, we'd need multiple files - simplified for now
        return res.status(400).json({ error: 'Merge PDF not yet implemented' });
      } else {
        return res.status(400).json({ error: 'Invalid tool' });
      }

      // Send the PDF file
      res.download(outputPath, 'converted.pdf', async (err) => {
        // Clean up files after download
        await unlink(inputPath);
        await unlink(outputPath);
        
        if (err) {
          console.error('Download error:', err);
        }
      });
    } catch (error) {
      // Clean up on error
      await unlink(inputPath);
      throw error;
    }
  } catch (error) {
    console.error('PDF conversion error:', error);
    res.status(500).json({ error: 'Failed to convert file' });
  }
});

export default router;
