import fs from 'fs';
import path from 'path';

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv
  .map(arg => arg.match(/--name=(?<value>.+)/i))
  .filter(Boolean)[0];
const certificateName = certificateArg
  ? certificateArg.groups?.value
  : process.env.npm_package_name;

if (!certificateName) {
  console.error(
    'Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.',
  );
  process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync('.env.local')) {
  fs.writeFileSync(
    '.env.local',
    `SSL_CRT_FILE=${certFilePath}
SSL_KEY_FILE=${keyFilePath}`,
  );
} else {
  let lines = fs.readFileSync('.env.local').toString().split('\n');

  let hasCert,
    hasCertKey = false;
  for (const line of lines) {
    if (/SSL_CRT_FILE=.*/i.test(line)) {
      hasCert = true;
    }
    if (/SSL_KEY_FILE=.*/i.test(line)) {
      hasCertKey = true;
    }
  }
  if (!hasCert) {
    fs.appendFileSync('.env.local', `\nSSL_CRT_FILE=${certFilePath}`);
  }
  if (!hasCertKey) {
    fs.appendFileSync('.env.local', `\nSSL_KEY_FILE=${keyFilePath}`);
  }
}