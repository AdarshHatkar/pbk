import fs from "fs";
import { join } from "path";
import path from "path";
import readline from "node:readline";
import { clientRootDirPath } from "../utils/path.js";
import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { isDeveloperAdarsh } from "../configs/environment.js";
import { b2fPortalProjects } from "../b2fPortalV3Config.js";

const getAllPaths = () => {
    try {
        const allPaths = [];
        allPaths.push(clientRootDirPath);
        for (const project of b2fPortalProjects) {
            if (project.sharedBackendPath) {
                const sharedBackendPath = join(clientRootDirPath, project.sharedBackendPath);
                if (!fs.existsSync(sharedBackendPath)) {
                    console.log("sharedBackendPath does not exist");
                    console.log({ sharedBackendPath });
                    return [];
                }
                allPaths.push(sharedBackendPath);
            }
            for (const section of project.sections) {
                if (section.repository.path) {
                    const repositoryPath = join(clientRootDirPath, section.repository.path);
                    if (!fs.existsSync(repositoryPath)) {
                        console.log("repositoryPath does not exist");
                        console.log({ repositoryPath });
                        return [];
                    }
                    allPaths.push(repositoryPath);
                }
            }
        }
        return allPaths;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const runAcpCommands = async (repoPath: string, message: string) => {
    try {
        const repositoryPackageJsonPath = join(repoPath, "package.json");
        if (!fs.existsSync(repositoryPackageJsonPath)) {
            console.log("repositoryPackageJsonPath does not exist");
            console.log({ repositoryPackageJsonPath });
            return;
        }
        const repositoryPackageJson = JSON.parse(
            fs.readFileSync(repositoryPackageJsonPath, "utf8")
        );
        if (!repositoryPackageJson.name) {
            console.log("repositoryPackageJson.name does not exist");
            console.log({ repositoryPackageJson });
            return;
        }
        console.log(`Running ACP In ${repositoryPackageJson.name} Started`);

        const options: Partial<SimpleGitOptions> = {
            baseDir: path.resolve(repoPath),
            binary: "git",
            maxConcurrentProcesses: 6,
        };
        const git: SimpleGit = simpleGit(options);
        console.log(`${repositoryPackageJson.name}: fetching ...`);

        await git.fetch();
        console.log(`${repositoryPackageJson.name}: Checking status ...`);

        let status = await git.status();

        // Save the current branch name
        const currentBranch = status.current;

        // console.log(currentBranch);

        if (currentBranch !== "main") {
            console.error(`Current branch is ${currentBranch}, but it should be main.`);
            console.log(`Repo: ${repoPath}`);

            process.exit(1);
        }
        if (status.files.length > 0) {
            await git.add(".");
            await git.commit(message);
        }

        console.log(`${repositoryPackageJson.name}: pulling ...`);

        await git.pull();
        console.log(`${repositoryPackageJson.name}: Checking status ...`);

        status = await git.status();

        // Check for new uncommitted changes after pulling
        if (status.files.length > 0) {
            await git.add(".");
            await git.commit(message);
        }
        console.log(`${repositoryPackageJson.name}: pushing ...`);

        await git.push();

        console.log(`Running ACP In ${repositoryPackageJson.name} Finished`);
    } catch (error: any) {
        console.error("Error while committing changes:", error.message);

        // Handle edge case where the repository might have conflicting changes
        if (error.message.includes("CONFLICT")) {
            console.error("Merge conflict detected. Please resolve conflicts manually.");
        }
    }
};

export const gitAcpAllRepos = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    function askQuestion(query: string): Promise<string> {
        return new Promise((resolve) => {
            rl.question(query, (answer) => {
                resolve(answer);
            });
        });
    }

    try {
        let commitMessage = await askQuestion("Enter Commit Message: ");
        rl.close();
        if (commitMessage.trim() === "") {
            commitMessage = "Git Acp All Repos";
        }

        console.log("------------gitAcpAllRepos Started-------------");

        const allPaths = getAllPaths();
        console.log(allPaths);

        for (const repoPath of allPaths) {
            await runAcpCommands(repoPath, `${new Date().toLocaleString()} : ${commitMessage}`);
        }
        console.log("------------gitAcpAllRepos Ended-------------");
    } catch (error) {
        console.log(error);
    }
};

// if (isDeveloperAdarsh) {
//     gitAcpAllRepos();
// } else {
//     console.log("This command can only be run by authorized developers.");
// }