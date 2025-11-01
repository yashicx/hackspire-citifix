import express from 'express';
import multer from 'multer';
import { createIssue, upvoteIssue, listIssues } from '../controllers/issuesController.js';

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// create, upvote, list
router.post('/create', upload.single('image'), createIssue);
router.post('/:id/upvote', upvoteIssue);
router.get('/', listIssues);

export default router;
