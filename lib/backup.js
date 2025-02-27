const fetch = require('node-fetch');
const fs = require('fs');
const cron = require('node-cron');

// Variabel global yang perlu diperiksa
let GITHUB_USERNAME = global.username_gh;
let GITHUB_TOKEN = global.token_gh;
const REPO_NAME = 'data-user-ord';
const LOCAL_FILE_PATH = './lib/database/user.json';

// Headers untuk autentikasi GitHub
const headers = () => ({
    "Authorization": `token ${GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3+json",
});

// Function to get IP address
async function getIpAddress() {
    const response = await fetch('https://api64.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP address');
    const data = await response.json();
    return data.ip;
}

// Function to check if repository exists
async function repositoryExists() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`;
    const response = await fetch(url, { headers: headers() });
    return response.ok;
}

// Function to create repository
async function createRepository() {
    const url = `https://api.github.com/user/repos`;
    const response = await fetch(url, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
            name: REPO_NAME,
            private: true,
        }),
    });
    if (!response.ok) {
        throw new Error('Error creating GitHub repository');
    }
}

// Function to create initial file in repository
async function createInitialFile(ip) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/user-${ip}.json`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({
            message: 'Initial commit',
            content: Buffer.from('{}').toString('base64'),
        }),
    });
    if (!response.ok) {
        throw new Error('Error creating initial file on GitHub');
    }
}

// Function to read file from GitHub
async function readGithubFile(ip) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/user-${ip}.json`;
    const response = await fetch(url, { headers: headers() });
    if (response.ok) {
        const data = await response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return { content: JSON.parse(content), sha: data.sha };
    } else {
        throw new Error('Error fetching GitHub file');
    }
}

// Function to update file on GitHub
async function updateGithubFile(ip, newContent, sha) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/user-${ip}.json`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({
            message: 'Backup user.json',
            content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
            sha: sha,
        }),
    });
    if (!response.ok) {
        // throw new Error('Error updating GitHub file');
    }
}

// Function to read local file
function readLocalFile() {
    const data = fs.readFileSync(LOCAL_FILE_PATH, 'utf8');
    return JSON.parse(data);
}

// Function to compare and backup file
async function backupFile() {
    try {
        const ip = await getIpAddress();
        const localData = readLocalFile();
        let githubData, sha;

        try {
            ({ content: githubData, sha } = await readGithubFile(ip));
        } catch (error) {
            // If the file does not exist, create it
            await createInitialFile(ip);
            githubData = {};
            sha = null;
        }

        if (JSON.stringify(localData) !== JSON.stringify(githubData)) {
            await updateGithubFile(ip, localData, sha);
            console.log('Backup updated on GitHub');
        } else {
            // console.log('No changes detected');
        }
    } catch (error) {
        console.error('Error during backup:', error);
    }
}

// Main function to ensure repository and initial file
async function ensureRepositoryAndFile() {
    if (!await repositoryExists()) {
        await createRepository();
    }
}

// Function to check if GitHub credentials are set
function areCredentialsSet() {
    return GITHUB_USERNAME && GITHUB_TOKEN;
}

// Continuously check for GitHub credentials
function checkCredentials() {
    if (areCredentialsSet()) {
        // Ensure the repository and file exist, then start backup schedule
        ensureRepositoryAndFile().then(() => {
            cron.schedule('*/30 * * * * *', () => {
                backupFile();
            });
        }).catch(console.error);
    } else {
        // console.log('GitHub credentials not set. Checking again...');
        setTimeout(checkCredentials, 5000); // Check every 5 seconds
    }
}

// Start checking for credentials
checkCredentials();

module.exports = async (client, Func) => {
    try {
        // Start checking for credentials and scheduling backup
        checkCredentials();
    } catch (e) {
        console.error('Error:', e);
    }
};