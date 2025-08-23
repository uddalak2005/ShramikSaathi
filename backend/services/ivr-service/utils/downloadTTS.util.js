import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read prompts.json file
const promptsPath = path.join(__dirname, 'prompts.json');
const prompts = JSON.parse(readFileSync(promptsPath, 'utf8'));

// API Configuration
const API_CONFIG = {
  baseURL: 'https://revapi.reverieinc.com/',
  headers: {
    'REV-API-KEY': "a04cab9cb76f51dde6e0dea87681787f4fe1b599",
    'REV-APP-ID': "dev.lowycuty",
    'REV-APPNAME': 'tts',
    'Content-Type': 'application/json'
  }
};

// Language to speaker mapping
const LANGUAGE_SPEAKERS = {
  'en-IN': 'en_female',
  'hi-IN': 'hi_female',
  'bn-IN': 'bn_female',
  'te-IN': 'te_female'
};

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path to create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Download TTS audio for a single text
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code (e.g., 'hi-IN')
 * @param {string} outputPath - Output file path
 * @returns {Promise<boolean>} - Success status
 */
async function downloadTTSAudio(text, language, outputPath) {
  try {
    const speaker = LANGUAGE_SPEAKERS[language];
    if (!speaker) {
      console.error(`No speaker found for language: ${language}`);
      return false;
    }

    const response = await axios.post(API_CONFIG.baseURL, {
      text: text
    }, {
      headers: {
        ...API_CONFIG.headers,
        'speaker': speaker
      },
      responseType: 'arraybuffer'
    });

    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    ensureDirectoryExists(dir);

    // Write the audio file
    fs.writeFileSync(outputPath, response.data);
    console.log(`✅ Downloaded: ${outputPath}`);
    return true;

  } catch (error) {
    console.error(`❌ Failed to download ${outputPath}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data.toString());
    }
    return false;
  }
}

/**
 * Download all TTS audio files based on prompts.json
 */
async function downloadAllTTSFiles() {
  console.log('🚀 Starting TTS audio download...');

  // Get the project root directory (two levels up from utils)
  const projectRoot = path.resolve(__dirname, '..');
  const audioBasePath = path.join(projectRoot, 'public', 'audio');

  let successCount = 0;
  let totalCount = 0;

  for (const prompt of prompts) {
    const { filename, texts } = prompt;

    for (const [language, text] of Object.entries(texts)) {
      totalCount++;

      // Create language-specific directory
      const languageDir = path.join(audioBasePath, language);
      const outputPath = path.join(languageDir, `${filename}.wav`);

      const success = await downloadTTSAudio(text, language, outputPath);
      if (success) {
        successCount++;
      }

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);

  if (successCount === totalCount) {
    console.log('🎉 All TTS files downloaded successfully!');
  } else {
    console.log('⚠️  Some files failed to download. Check the errors above.');
  }
}

/**
 * Download TTS audio for a specific prompt and language
 * @param {string} filename - Prompt filename
 * @param {string} language - Language code
 */
async function downloadSpecificTTS(filename, language) {
  const prompt = prompts.find(p => p.filename === filename);
  if (!prompt) {
    console.error(`❌ Prompt not found: ${filename}`);
    return;
  }

  const text = prompt.texts[language];
  if (!text) {
    console.error(`❌ Text not found for ${filename} in language ${language}`);
    return;
  }

  const projectRoot = path.resolve(__dirname, '..');
  const audioBasePath = path.join(projectRoot, 'public', 'audio');
  const languageDir = path.join(audioBasePath, language);
  const outputPath = path.join(languageDir, `${filename}.wav`);

  const success = await downloadTTSAudio(text, language, outputPath);
  if (success) {
    console.log(`✅ Successfully downloaded ${filename} for ${language}`);
  }
}

// Export functions for use in other modules
export {
  downloadAllTTSFiles,
  downloadSpecificTTS,
  downloadTTSAudio
};

// If this file is run directly, download all TTS files
if (process.argv[1] === __filename) {
  downloadAllTTSFiles().catch(console.error);
}
