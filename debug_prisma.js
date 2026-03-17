const { execSync } = require('child_process');
const fs = require('fs');

try {
    execSync('npx prisma db push', {
        env: { ...process.env, DATABASE_URL: "file:./dev.db" },
        encoding: 'utf-8'
    });
    console.log('Success');
} catch (error) {
    fs.writeFileSync('prisma_error.log', error.stdout + '\n' + error.stderr);
    console.log('Error captured to prisma_error.log');
}
