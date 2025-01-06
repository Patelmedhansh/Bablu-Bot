const axios = require('axios');

async function setupGithubWebhook(repositoryOwner, repositoryName, webhookUrl) {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/hooks`,
      {
        name: 'web',
        active: true,
        events: ['push', 'pull_request'],
        config: {
          url: webhookUrl,
          content_type: 'json'
        }
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error setting up GitHub webhook:', error);
    throw error;
  }
}

module.exports = { setupGithubWebhook };