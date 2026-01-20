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

// AI Arena - 3 AIs debate to consensus
router.post('/ai/arena', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Invalid question' });
    }

    // Get responses from 3 different models
    const models = [
      { name: 'GPT-4.1', model: 'gpt-4.1-mini', color: 'green', icon: '🤖' },
      { name: 'Gemini', model: 'gemini-2.5-flash', color: 'cyan', icon: '💎' },
      { name: 'GPT-4.1 Nano', model: 'gpt-4.1-nano', color: 'purple', icon: '⚡' },
    ];

    const responses = await Promise.all(
      models.map(async (model) => {
        const completion = await openai.chat.completions.create({
          model: model.model,
          messages: [{ role: 'user', content: question }],
          max_tokens: 300,
        });

        return {
          model: model.name,
          response: completion.choices[0]?.message?.content || 'No response',
          color: model.color,
          icon: model.icon,
        };
      })
    );

    // Generate consensus using all responses
    const consensusPrompt = `Based on these three AI responses to the question "${question}":\n\n${responses.map((r, i) => `${i + 1}. ${r.model}: ${r.response}`).join('\n\n')}\n\nProvide a consensus answer that synthesizes the best insights from all three responses in 2-3 sentences.`;

    const consensusCompletion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: consensusPrompt }],
      max_tokens: 200,
    });

    const consensus = consensusCompletion.choices[0]?.message?.content || 'Unable to reach consensus';

    res.json({ responses, consensus });
  } catch (error) {
    console.error('AI Arena error:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

// Image Generation using Manus capabilities
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    // Use DALL-E 3 for image generation (Nano Banana)
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

// Document Converter
router.post('/convert-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { from, to } = req.body;
    const inputPath = req.file.path;
    const outputPath = path.join(tmpdir(), `converted-${Date.now()}.${to.toLowerCase()}`);

    try {
      // Handle different conversion types
      if (from === 'Markdown' && to === 'PDF') {
        await execAsync(`manus-md-to-pdf "${inputPath}" "${outputPath}"`);
      } else if (from === 'PDF' && to === 'Word') {
        // Use pdf2docx or similar (simplified for now)
        await execAsync(`pandoc "${inputPath}" -o "${outputPath}"`);
      } else if (from === 'Word' && to === 'PDF') {
        await execAsync(`pandoc "${inputPath}" -o "${outputPath}"`);
      } else if (from === 'HTML' && to === 'PDF') {
        await execAsync(`weasyprint "${inputPath}" "${outputPath}"`);
      } else {
        // Generic conversion using pandoc
        await execAsync(`pandoc "${inputPath}" -o "${outputPath}"`);
      }

      // Send the converted file
      res.download(outputPath, `converted.${to.toLowerCase()}`, async (err) => {
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
    console.error('Document conversion error:', error);
    res.status(500).json({ error: 'Failed to convert document' });
  }
});

export default router;
