# 🚀 Deploying HealthVault to Vercel

This guide provides step-by-step instructions for deploying your HealthVault application to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A [GitHub](https://github.com) account (recommended)
- Access to your [Supabase](https://supabase.com) project
- A [Google Gemini API key](https://ai.google.dev/)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. If your repository isn't listed, you may need to configure Vercel's GitHub integration

### 3. Configure Project Settings

1. **Project Name**: Enter a name for your project (e.g., "healthvault")
2. **Framework Preset**: Next.js (should be automatically detected)
3. **Root Directory**: Leave as `.` (default)
4. **Build and Output Settings**: Use the default settings

### 4. Set Environment Variables

Click "Environment Variables" and add the following:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key |

> ⚠️ **Important**: Never commit actual API keys or secrets to your repository.
> Always use environment variables for sensitive information.

### 5. Deploy

Click "Deploy" and wait for the build process to complete.

### 6. Verify Deployment

1. Once deployed, Vercel will provide a URL to your application
2. Visit the URL to ensure everything is working correctly
3. Test core functionality like:
   - User authentication
   - Appointment booking
   - Medical records access
   - AI chat functionality

### 7. Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions to configure DNS settings

### 8. Continuous Deployment

By default, Vercel will automatically redeploy your application when you push changes to your repository.

To disable automatic deployments:

1. Go to "Settings" > "Git"
2. Under "Deploy Hooks", you can configure when deployments occur

## Troubleshooting

### Database Connection Issues

If your application cannot connect to Supabase after deployment:

1. Check that your environment variables are correctly set in Vercel
2. Verify that your Supabase project's Row Level Security (RLS) policies allow the necessary operations
3. Ensure your Supabase project allows requests from your Vercel deployment URL

### AI Chat Not Working

If the Gemini AI chat functionality isn't working:

1. Verify your Gemini API key is correctly set in Vercel environment variables
2. Check that your API key has the necessary permissions and quotas
3. Look for any error messages in the browser console or server logs

### General Deployment Issues

If you encounter other deployment issues:

1. Check Vercel's build logs for specific error messages
2. Ensure your local development environment works correctly
3. Verify that all dependencies are correctly specified in `package.json`

## Updating Environment Variables

If you need to update environment variables after deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Update the values as needed
4. Redeploy your application for changes to take effect

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment)
3. Search for solutions in the [Vercel community forums](https://github.com/vercel/next.js/discussions)
4. Contact HealthVault support
