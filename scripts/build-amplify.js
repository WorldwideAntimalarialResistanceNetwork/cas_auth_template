const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const hostingDir = path.join(rootDir, '.amplify-hosting');
const computeDir = path.join(hostingDir, 'compute', 'default');
const staticDir = path.join(hostingDir, 'static');
const envFile = path.join(computeDir, '.env');

require('dotenv').config({ path: path.join(rootDir, '.env') });

const runtimeEnvNames = [
  'APP_BASE_PATH',
  'CAS_URL',
  'SERVICE_URL',
  'SESSION_SECRET',
  'IDDO_AWS_ACCESS_KEY_ID',
  'IDDO_AWS_SECRET_ACCESS_KEY',
  'IDDO_AWS_REGION',
  'S3_BUCKET_NAME'
];

function copyRequired(source, destination) {
  const from = path.join(rootDir, source);

  if (!fs.existsSync(from)) {
    throw new Error(`Required build input is missing: ${source}`);
  }

  fs.cpSync(from, destination, { recursive: true });
}

function copyOptional(source, destination) {
  const from = path.join(rootDir, source);

  if (fs.existsSync(from)) {
    fs.cpSync(from, destination, { recursive: true });
  }
}

function formatEnvValue(value) {
  return JSON.stringify(value);
}

function writeRuntimeEnv() {
  const lines = runtimeEnvNames
    .filter((name) => process.env[name])
    .map((name) => `${name}=${formatEnvValue(process.env[name])}`);

  fs.writeFileSync(envFile, `${lines.join('\n')}\n`);

  const missing = runtimeEnvNames.filter((name) => !process.env[name]);

  console.log(`Runtime env file written with ${lines.length} variable(s).`);

  if (missing.length > 0) {
    console.warn(`Runtime env variable(s) not set at build time: ${missing.join(', ')}`);
  }
}

const resolvedHostingDir = path.resolve(hostingDir);
const resolvedRootDir = path.resolve(rootDir);

if (!resolvedHostingDir.startsWith(`${resolvedRootDir}${path.sep}`)) {
  throw new Error(`Refusing to clean build output outside project root: ${resolvedHostingDir}`);
}

fs.rmSync(hostingDir, { recursive: true, force: true });
fs.mkdirSync(computeDir, { recursive: true });
fs.mkdirSync(staticDir, { recursive: true });

copyRequired('index.js', path.join(computeDir, 'index.js'));
copyRequired('package.json', path.join(computeDir, 'package.json'));
copyRequired('package-lock.json', path.join(computeDir, 'package-lock.json'));
copyRequired('node_modules', path.join(computeDir, 'node_modules'));
copyRequired('routes', path.join(computeDir, 'routes'));
copyRequired('views', path.join(computeDir, 'views'));

copyOptional('utils', path.join(computeDir, 'utils'));
copyOptional('public', staticDir);

writeRuntimeEnv();

copyRequired('deploy-manifest.json', path.join(hostingDir, 'deploy-manifest.json'));

console.log('Amplify Hosting bundle written to .amplify-hosting');
