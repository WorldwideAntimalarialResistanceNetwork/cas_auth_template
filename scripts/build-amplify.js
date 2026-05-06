const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const hostingDir = path.join(rootDir, '.amplify-hosting');
const computeDir = path.join(hostingDir, 'compute', 'default');
const staticDir = path.join(hostingDir, 'static');

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

copyRequired('deploy-manifest.json', path.join(hostingDir, 'deploy-manifest.json'));

console.log('Amplify Hosting bundle written to .amplify-hosting');
