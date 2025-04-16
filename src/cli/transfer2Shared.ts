import fs from "fs";
import path from "path";
import { join } from "path";
import { clientRootDirPath, clientSrcDirPath } from "../utils/path.js";
import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { isDeveloperAdarsh } from "../configs/environment.js";
;
import { deleteAndCopy } from "./deleteAndCopy.js";
import { loadConfig } from "../utils/loadConfig.js";
import { TPbkProject } from "../types.js";

export const transfer2Shared = async () => {
    // Load projects from the configuration file
const config = loadConfig();

// Export projects for use in CLI tools
 let b2fPortalProjects: TPbkProject[] = config.projects;
    console.log("------------transfer2Shared Started-------------");

    try {
        const myGit: SimpleGit = simpleGit();
        const status = await myGit.status();

        // Save the current branch name
        const currentBranch = status.current;

        // console.log(currentBranch);

        if (currentBranch !== "main") {
            throw new Error(`Current branch is ${currentBranch}, but it should be main.`);
        }
        if (status.files.length > 0) {
            console.error("❌ Uncommitted changes detected:");
            console.log("Commit or stash your changes before proceeding.");
            process.exit(1);
        }

        // Pull the latest changes
        await myGit.pull();

        const repositoryPackageJsonPath = join(clientRootDirPath, "package.json");
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

        for (const project of b2fPortalProjects) {
            const serverB2fPath = join(clientSrcDirPath, "serverB2f");
            // console.log('serverB2fPath', serverB2fPath);
            if (!fs.existsSync(serverB2fPath)) {
                console.log("serverB2fPath does not exist");
                console.log({ serverB2fPath });

                return;
            }

            const projectSrcPath = join(clientSrcDirPath, project.projectBaseDirPath);
            // console.log("projectSrcpath", projectSrcPath);
            if (!fs.existsSync(projectSrcPath)) {
                console.log("projectSrcPath does not exist");
                console.log({ projectSrcPath });

                return;
            }

            if (project.sharedBackendPath) {
                const sharedBackendPath = join(clientRootDirPath, project.sharedBackendPath);
                // console.log("sharedBackendPath", sharedBackendPath);
                if (!fs.existsSync(sharedBackendPath)) {
                    console.log("sharedBackendPath does not exist");
                    console.log({ sharedBackendPath });

                    return;
                }

                const options: Partial<SimpleGitOptions> = {
                    baseDir: path.resolve(sharedBackendPath),
                    binary: "git",
                    maxConcurrentProcesses: 6,
                };

                const sharedBackendGit: SimpleGit = simpleGit(options);

                let sharedBackendGitStatus = await sharedBackendGit.status();

                // Save the current branch name
                const currentBranch = sharedBackendGitStatus.current;

                // console.log(currentBranch);

                if (currentBranch !== "main") {
                    throw new Error(
                        ` Shared backend branch is ${currentBranch}, but it should be main.`
                    );
                }

                await sharedBackendGit.pull();

                const sharedProjectSrcPath = join(
                    sharedBackendPath,
                    "src",
                    project.projectBaseDirPath
                );
                // console.log("sharedProjectSrcPath", sharedProjectSrcPath);
                if (!fs.existsSync(sharedProjectSrcPath)) {
                    console.log("sharedProjectSrcPath does not exist");
                    console.log({ sharedProjectSrcPath });

                    continue;
                }

                await deleteAndCopy(projectSrcPath, sharedProjectSrcPath);

                sharedBackendGitStatus = await sharedBackendGit.status();

                const sharedBackendChanges = sharedBackendGitStatus.files.some((file: { path: string }) =>
                    file.path.startsWith(`src/${project.projectBaseDirPath}/`)
                );

                if (!sharedBackendChanges) {
                    console.log(
                        `No changes detected in the sharedBackend directory. Skipping commit.`
                    );
                    return;
                }
                const repositoryCommitJsonPath = join(sharedBackendPath, "commit.json");

                if (!fs.existsSync(repositoryCommitJsonPath)) {
                    console.log("repositoryCommitJsonPath does not exist");
                    console.log({ sharedBackendPath });
                    return;
                }

                const repositoryCommitJson = JSON.parse(
                    fs.readFileSync(repositoryCommitJsonPath, "utf8")
                );

                if (!repositoryCommitJson.last_commit) {
                    console.log("repositoryCommitJson.last_commit does not exist");
                    console.log({ clientRootDirPath });
                }
                const currentDate = new Date().toLocaleString();
                // Update last_commit
                repositoryCommitJson.last_commit = currentDate;

                // Write the updated JSON back to the file
                fs.writeFileSync(
                    repositoryCommitJsonPath,
                    JSON.stringify(repositoryCommitJson, null, 4),
                    "utf8"
                );
                await sharedBackendGit.add(`commit.json`);

                // Add only the b2fPortal folder
                await sharedBackendGit.add(`src/${project.projectBaseDirPath}/*`);

                // Commit with the current date and time

                const commitMessage = `${currentDate} transfer2Shared from ${repositoryPackageJson.name}`;
                await sharedBackendGit.commit(commitMessage);

                // Push the commit to the main branch
                await sharedBackendGit.push("origin", "main");

                console.log("Changes committed and pushed successfully");
            } else {
                console.error("sharedBackendPath is not defined");
                process.exit(1);
            }

            if (project.sections.length === 0) {
                console.log("no sections in " + project.projectName);
                return;
            }
        }
    } catch (error: any) {
        console.error("Error while committing changes:", error.message);

        // Handle edge case where the repository might have conflicting changes
        if (error.message.includes("CONFLICT")) {
            console.error("Merge conflict detected. Please resolve conflicts manually.");
        }
    }

    console.log("------------transfer2Shared finished-------------");
};

// if (isDeveloperAdarsh) {
//     transfer2Shared();
// } else {
//     console.log("This command can only be run by authorized developers.");
// }
