import { execaCommand } from 'execa';

execaCommand('yarn dev-base', { stdio: 'inherit' });

await new Promise((resolve) => { setTimeout(() => resolve(), 1000); });

execaCommand('local-ssl-proxy --source 8080 --target 3000', { stdio: 'inherit' });
