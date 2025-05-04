#!/usr/bin/env node

const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const git = simpleGit();

async function isGitRepo() {
  try {
    // Check if .git directory exists
    const gitDirExists = fs.existsSync(path.join(process.cwd(), '.git'));
    if (gitDirExists) {
      console.log('Your project is already a Git repository.');
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

async function initGitRepo() {
  try {
    // Check if it's already a git repo
    const alreadyRepo = await isGitRepo();
    
    if (!alreadyRepo) {
      console.log('Initializing Git repository...');
      await git.init();
      console.log('Git repository initialized.');
    }
  } catch (err) {
    console.error('Error initializing Git repository:', err);
    process.exit(1);
  }
}

async function commitAndPush(repoUrl) {
  try {
    // Add all files and commit
    console.log('Adding files...');
    await git.add('.');
    
    // Check if there are any changes to commit
    const status = await git.status();
    
    if (!status.isClean()) {
      await git.commit('Initial commit');
      console.log('Files committed.');
    } else {
      console.log('No changes to commit.');
    }

    // Check if remote already exists
    try {
      const remotes = await git.getRemotes();
      const originExists = remotes.some(remote => remote.name === 'origin');
      
      if (originExists) {
        console.log('Remote "origin" already exists, updating URL...');
        await git.removeRemote('origin');
      }
      
      // Set remote repository URL
      console.log('Setting up GitHub repository...');
      await git.addRemote('origin', repoUrl);
    } catch (err) {
      console.error('Error setting remote:', err);
    }

    // Check current branch name and handle GitHub's "main" vs local "master" issue
    const branchSummary = await git.branch();
    const currentBranch = branchSummary.current;
    
    // Extract the default branch name from GitHub URL (assuming it's main)
    const defaultGitHubBranch = 'main';
    
    if (currentBranch !== defaultGitHubBranch) {
      console.log(`Your local branch is "${currentBranch}" but GitHub likely uses "${defaultGitHubBranch}"`);
      console.log(`Renaming local branch to "${defaultGitHubBranch}"...`);
      
      try {
        // Rename the branch to match GitHub's default
        await git.branch(['-m', currentBranch, defaultGitHubBranch]);
        console.log(`Branch renamed to "${defaultGitHubBranch}"`);
        
        // Push to GitHub with the new branch name
        console.log(`Pushing to GitHub (branch: ${defaultGitHubBranch})...`);
        await git.push('origin', defaultGitHubBranch, ['--set-upstream']);
      } catch (err) {
        console.error('Error renaming branch:', err);
        console.log(`Attempting to push with current branch "${currentBranch}" instead...`);
        await git.push('origin', currentBranch, ['--set-upstream', '-f']);
      }
    } else {
      // Push to GitHub with current branch name
      console.log(`Pushing to GitHub (branch: ${currentBranch})...`);
      await git.push('origin', currentBranch, ['--set-upstream']);
    }
    
    console.log('Project pushed to GitHub successfully!');
  } catch (err) {
    console.error('Error committing and pushing:', err);
    process.exit(1);
  }
}

async function askGitHubRepoUrl() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'repoUrl',
      message: 'Enter your GitHub repository URL (e.g., https://github.com/username/repo.git):',
      validate: (input) => input ? true : 'GitHub repository URL is required!',
    },
  ]);
  return answers.repoUrl;
}

async function main() {
  try {
    const repoUrl = await askGitHubRepoUrl();
    await initGitRepo();
    await commitAndPush(repoUrl);
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    process.exit(1);
  }
}

main();