# Deploying to AWS Amplify

This application is a Node.js Express server. To deploy it on AWS Amplify, follow these steps:

### 1. Amplify Hosting (Web Dynamic)
Amplify Hosting can deploy dynamic web apps. Since this is a standard Express app, it's best deployed using the **Amplify Gen 2** or by connecting the repository to **Amplify Hosting**.

### 2. Environment Variables
You MUST configure the following environment variables in the Amplify Console (**App Settings > Environment variables**):

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | The port the app listens on | `8080` (Amplify usually uses 8080 for dynamic apps) |
| `APP_BASE_PATH` | Base URL path | `/sdtmrule` |
| `CAS_URL` | Your CAS server URL | `https://login.wwarn.org/cas` |
| `SERVICE_URL` | Public URL of this app | `https://your-app.amplifyapp.com` |
| `SESSION_SECRET` | Secret for sessions | `your-random-secret` |
| `IDDO_AWS_ACCESS_KEY_ID` | AWS Access Key | (If not using IAM roles) |
| `IDDO_AWS_SECRET_ACCESS_KEY` | AWS Secret Key | (If not using IAM roles) |
| `IDDO_AWS_REGION` | AWS Region | `eu-west-2` |
| `S3_BUCKET_NAME` | S3 Bucket name | `iddo-rules-sdtm` |

### 3. Deployment Steps
1. Push this code to your GitHub repository.
2. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home).
3. Click **New app** > **Host web app**.
4. Select **GitHub** and authorize.
5. Select the `cas_auth_template` repository and the branch.
6. Amplify should automatically detect the `amplify.yml` file.
7. **Important**: If you are using Amplify Gen 1 or Gen 2 for dynamic hosting, ensure the "Build settings" reflect that this is a dynamic application.

### 4. Note on Dynamic vs Static
AWS Amplify Hosting is traditionally for Static Site Generation (SSG) and Server-Side Rendering (SSR) frameworks like Next.js. For a pure Express app:
- If Amplify Hosting doesn't support your specific Express setup directly, consider using **AWS App Runner**, which is optimized for Express apps and integrates well with the AWS ecosystem.
- Alternatively, you can wrap this in a Next.js custom server or use Amplify Gen 2's Compute capabilities.
