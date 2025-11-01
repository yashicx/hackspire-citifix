import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  description: { type: String, required: true },
  imagePath: { type: String, required: true }, // relative path e.g. /uploads/1234.jpg
  upvotes: { type: Number, default: 0 },
  twitterPosted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  city: { type: String } // optional: city for tagging correct handles
});

export default mongoose.model('Issue', IssueSchema);
