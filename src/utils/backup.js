const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// const backupDir = path.join(__dirname, 'backups'); // Directory to save backups
const backupDir = path.join('/tmp', 'backups'); // For Vercel

// Ensure the backups directory exists
if (!fs.existsSync(backupDir)) {
  // fs.mkdirSync(backupDir);
   fs.mkdirSync(backupDir, { recursive: true });
  console.log('Backups directory created:', backupDir);
}

// Function to perform the backup using mongodump
function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Use timestamp for unique filenames
  const backupFileName = `db_backup_${timestamp}.archive`; // Backup file name with timestamp
  const backupPath = path.join(backupDir, backupFileName);

  // Command to run mongodump and compress the backup
  const command = `mongodump --uri="mongodb://greenfarm:greenfarm%402024@13.201.57.251:27017/retail?authSource=admin" --archive=${backupPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Backup created successfully: ${backupPath}`);
  });
}

module.exports = createBackup;
