# Deploying to AWS Amplify

This application is a Node.js Express server. To deploy it on AWS Amplify, follow these steps:

### 1. Amplify Hosting (Web Dynamic)
Amplify Hosting can deploy dynamic web apps. Since this is a standard Express app, it's best deployed using the **Amplify Gen 2** or by connecting the repository to **Amplify Hosting**.

### 2. Environment Variables
You MUST configure the following environment variables in the Amplify Console (**App Settings > Environment variables**):

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_PORT` | Optional local-only override. Do not use `PORT=8080` in Amplify; Amplify Compute expects port `3000`. | `3000` |
| `APP_BASE_PATH` | Base URL path | `/` or `/sdtmrule` |
| `CAS_URL` | Your CAS server URL | `https://login.wwarn.org/cas` |
| `SERVICE_URL` | Public URL of this app, without an internal port | `https://main.di5repg4hfjgu.amplifyapp.com` |
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
7. The build runs `npm run build`, which creates the `.amplify-hosting` bundle required by Amplify Hosting Compute.
8. After deployment, test the default Amplify URL without adding `:8080`, for example `https://main.di5repg4hfjgu.amplifyapp.com/`.

### 4. Note on Dynamic vs Static
AWS Amplify Hosting is traditionally for Static Site Generation (SSG) and Server-Side Rendering (SSR) frameworks like Next.js. For a pure Express app:
- If Amplify Hosting doesn't support your specific Express setup directly, consider using **AWS App Runner**, which is optimized for Express apps and integrates well with the AWS ecosystem.
- Alternatively, you can wrap this in a Next.js custom server or use Amplify Gen 2's Compute capabilities.
