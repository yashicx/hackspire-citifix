import Issue from '../models/Issue.js';
import { postToTwitter } from '../utils/twitter.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPVOTE_THRESHOLD = Number(process.env.UPVOTE_THRESHOLD || 20);

// helper: return absolute path for uploads file
const absolutePath = (relativePath) => {
  // relativePath expected like 'uploads/123.jpg' or '/uploads/123.jpg'
  const p = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return path.join(__dirname, '..', p);
};

export const createIssue = async (req, res) => {
  try {
    const { description, city } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const imageRel = '/uploads/' + req.file.filename;

    const issue = new Issue({
      description,
      imagePath: imageRel,
      city
    });

    await issue.save();

    return res.json({ message: 'Issue created', issue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    issue.upvotes = (issue.upvotes || 0) + 1;

    // If threshold reached and not posted yet
    if (issue.upvotes >= UPVOTE_THRESHOLD && !issue.twitterPosted) {
      // Prepare caption and tags based on city (simple mapping)
      const city = (issue.city || '').toLowerCase();
      let tags = '@PMOIndia @mygovindia'; // default tags
      if (city.includes('kolkata') || city.includes('kol')) {
        tags = '@KolkataPolice @kmc_kolkata';
      } else if (city.includes('mumbai')) {
        tags = '@MumbaiPolice';
      } // extend mapping as needed

      const caption = `Citizen Report: ${issue.description}\nPlease take action. ${tags}`;

      try {
        const imageAbs = absolutePath(issue.imagePath);
        await postToTwitter(imageAbs, caption);
        issue.twitterPosted = true;
      } catch (err) {
        console.error('Failed to post to Twitter, continuing:', err.message || err);
        // do not fail the request - only log
      }
    }

    await issue.save();

    return res.json({ message: 'Upvoted', issue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const listIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ issues });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
