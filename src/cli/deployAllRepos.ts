import fs from "fs";
import { join } from "path";
import path from "path";
import { execSync } from "child_process";
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

const checkRepo = async (repoPath: string) => {
    try {
        const repositoryPackageJsonPath = join(repoPath, "package.json");
        if (!fs.existsSync(repositoryPackageJsonPath)) {
            console.log("repositoryPackageJsonPath does not exist");
            console.log({ repoPath });
            return;
        }
        const repositoryPackageJson = JSON.parse(
            fs.readFileSync(repositoryPackageJsonPath, "utf8")
        );
        if (!repositoryPackageJson.name) {
            console.log("repositoryPackageJson.name does not exist");
            console.log({ repoPath });
            return;
        }
        if (!repositoryPackageJson.scripts?.deploy) {
            console.log("deploy script does not exist, skipping....");
            console.log({ repoPath });
            return;
        }
        console.log(`Checking Repo: ${repositoryPackageJson.name} Started`);

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
            console.error("❌ Uncommitted changes detected:");
            console.log(`Repo: ${repoPath}`);
            process.exit(1);
        }

        console.log(`${repositoryPackageJson.name}: pulling ...`);

        await git.pull();
        console.log(`${repositoryPackageJson.name}: Checking status ...`);
        status = await git.status();

        // Check for new uncommitted changes after pulling
        if (status.files.length > 0) {
            console.error("❌ Uncommitted changes detected:");
            console.log(`Repo: ${repoPath}`);
            process.exit(1);
        } else {
            console.log(`${repositoryPackageJson.name}: pushing ...`);

            await git.push();
        }

        console.log(`${repositoryPackageJson.name}: fetching ...`);

        const branches = await git.branch(["-r"]);

        // Check if stable branch exists in remote
        if (!branches.all.includes("origin/stable")) {
            console.log("stable branch does not exist");
            console.log(`Repo: ${repoPath}`);
            process.exit(1);
        }

        console.log(`Checking Repo: ${repositoryPackageJson.name} Finished`);
    } catch (error: any) {
        console.error("Error while committing changes:", error.message);

        // Handle edge case where the repository might have conflicting changes
        if (error.message.includes("CONFLICT")) {
            console.error("Merge conflict detected. Please resolve conflicts manually.");
        }
    }
};

const runDeployCommand = async (repoPath: string) => {
    try {
        const repositoryPackageJsonPath = join(repoPath, "package.json");
        if (!fs.existsSync(repositoryPackageJsonPath)) {
            console.log("repositoryPackageJsonPath does not exist");
            console.log({ repoPath });
            return;
        }
        const repositoryPackageJson = JSON.parse(
            fs.readFileSync(repositoryPackageJsonPath, "utf8")
        );
        if (!repositoryPackageJson.name) {
            console.log("repositoryPackageJson.name does not exist");
            console.log({ repoPath });
            return;
        }
        if (!repositoryPackageJson.scripts?.deploy) {
            console.log("deploy script does not exist, skipping....");
            console.log({ repoPath });
            return;
        }
        execSync("npm run deploy", { cwd: repoPath, stdio: "inherit" });
    } catch (error) {
        console.error(`Deployment failed for ${repoPath}`, error);
    }
};

export const deployAllRepos = async () => {
    console.log("------------deployAll Started-------------");
    try {
        const allPaths = getAllPaths();
        console.log(allPaths);

        for (const repoPath of allPaths) {
            await checkRepo(repoPath);
        }
        for (const repoPath of allPaths) {
            await runDeployCommand(repoPath);
        }
    } catch (error) {
        console.log(error);
    }

    console.log("------------deployAll Ended-------------");
};

// if (isDeveloperAdarsh) {
//     deployAllRepos();
// } else {
//     console.log("This command can only be run by authorized developers.");
// }