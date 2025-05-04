# upload-to-github-cli

A streamlined CLI tool that simplifies the process of initializing a Git repository and pushing your project to GitHub in one command.

## Features

- **One-command workflow** - Initialize, commit, and push to GitHub with a single command
- **Smart Git detection** - Checks if Git is already initialized and acts accordingly
- **Branch name compatibility** - Automatically handles the "master" vs "main" branch name differences
- **Interactive prompts** - Simple interface to enter your GitHub repository URL
- **Error handling** - Robust error management for a smooth user experience
- **Cross-platform compatibility** - Works on Windows, macOS, and Linux

## Prerequisites

- Node.js (version 12 or higher)
- Git installed and configured
- GitHub account with a repository created

## Installation

```bash
npm install -g upload-to-github-cli
```

## Usage

### Basic Usage

1. Create a new empty repository on GitHub (don't initialize it with README, license, or .gitignore)
2. Navigate to your project directory in the terminal
3. Run the command:

```bash
upload-to-github
```

4. When prompted, enter your GitHub repository URL (e.g., `https://github.com/username/repository.git`)
5. The tool will handle the rest!

### What Happens Behind the Scenes

When you run the command, the tool performs the following operations:

1. **Checks if Git is initialized** - Looks for a `.git` directory
2. **Initializes Git if needed** - Runs `git init` if no Git repository exists
3. **Stages all files** - Equivalent to `git add .`
4. **Creates an initial commit** - Only if there are changes to commit
5. **Sets up the remote** - Adds or updates the "origin" remote with your GitHub URL
6. **Handles branch naming** - Renames the branch to match GitHub's default if needed
7. **Pushes to GitHub** - Pushes your code to the GitHub repository with proper tracking

## Technical Details

### Dependencies

- **simple-git** - JavaScript wrapper around Git commands
- **inquirer** - Interactive command line user interface
- **fs/path** - Core Node.js modules for file system operations

### Code Structure

- **isGitRepo()** - Safely detects if a directory is a Git repository
- **initGitRepo()** - Initializes Git if not already initialized
- **commitAndPush(repoUrl)** - Handles staging, committing, and pushing to GitHub
- **askGitHubRepoUrl()** - Prompts the user for their GitHub repository URL
- **main()** - Orchestrates the workflow

## Common Issues and Solutions

### "fatal: not a git repository"

If you see this error in your terminal, it means your current directory isn't a Git repository. The tool should handle this automatically, but if it persists:

```bash
git init
```

### "remote origin already exists"

The tool will automatically update the remote if it exists, but if you encounter issues:

```bash
git remote remove origin
git remote add origin [your-repo-url]
```

### GitHub authentication issues

Make sure you have your GitHub credentials set up correctly:

```bash
# Set up GitHub credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# If using HTTPS, you might need a personal access token
# If using SSH, ensure your SSH keys are set up correctly
```

### Branch name conflicts

If you're experiencing issues with branch names:

```bash
# Check current branch name
git branch

# Rename your branch if needed
git branch -m master main
```

## Configuration

Currently, the tool works with default settings. Future versions may include configuration options to:

- Specify custom commit messages
- Choose which files to include/exclude
- Configure branch names
- Set up GitHub Actions workflows

## Advanced Usage

### Using with existing Git repositories

If your project is already a Git repository with commits:

1. Run `upload-to-github`
2. The tool will detect the existing repository
3. It will set up the remote and push your existing commits

### Using with GitHub Enterprise

The tool works with any Git remote URL, including GitHub Enterprise:

```bash
# When prompted, enter your enterprise URL
https://github.enterprise.com/username/repository.git
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [simple-git](https://github.com/steveukx/git-js) - For providing the Git functionality
- [inquirer](https://github.com/SBoudrias/Inquirer.js) - For the interactive prompts

## Future Plans

- Add optional configuration file
- Support for creating GitHub repository from the CLI
- Integration with GitHub Actions for CI/CD setup
- Support for GitLab and Bitbucket
- Custom templates for initial commit messages

## Support

If you encounter any issues or have questions about this tool, please open an issue on GitHub.
