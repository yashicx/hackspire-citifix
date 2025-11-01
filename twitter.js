import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
dotenv.config();

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Wrapper to post image + text. Accepts local image path.
export const postToTwitter = async (imagePath, text) => {
  try {
    // Upload media (v1.1 endpoint)
    const mediaId = await client.v1.uploadMedia(imagePath);

    // Create tweet with media (v2)
    const tweet = await client.v2.tweet({
      text,
      media: { media_ids: [mediaId] }
    });

    return tweet;
  } catch (err) {
    console.error('Error posting to Twitter:', err);
    throw err;
  }
};
