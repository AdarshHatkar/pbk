import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "path";

type TSyncFilesAndFoldersV2Params = {
    sourceDirPath: string;
    targetDirPath: string;
    fileNamePatterns?: string[];
    deleteExtraFilesInTarget?: boolean;
};

export async function syncFilesAndFolders({
    sourceDirPath,
    targetDirPath,
    fileNamePatterns = [],
    deleteExtraFilesInTarget = true,
}: TSyncFilesAndFoldersV2Params) {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDirPath)) {
        await fsPromises.mkdir(targetDirPath, { recursive: true });
    }

    // Load or initialize JSON file to store file details
    const jsonFilePath = path.join(targetDirPath, "file_details.json");

    type TFileDetails = {
        [fileName: string]: {
            sourceFilePath: string;
            mtime: number;
            localDate: string;
        };
    };

    let fileDetails: TFileDetails = {};
    let initialFileDetails: TFileDetails = {};
    
    if (fs.existsSync(jsonFilePath)) {
        const fileContent = await fsPromises.readFile(jsonFilePath, "utf8");
        fileDetails = JSON.parse(fileContent);
        initialFileDetails = { ...fileDetails };
    } else {
        await fsPromises.writeFile(jsonFilePath, "{}");
    }

    type TFileDetailsEntry = {
        sourceFilePath: string;
        mtime: number;
        fileName: string;
    };
    
    async function updateFileDetails({ fileName, sourceFilePath, mtime }: TFileDetailsEntry) {
        // const stats = await fsPromises.stat(sourceFilePath);
        fileDetails[fileName] = {
            sourceFilePath,
            mtime,
            localDate: new Date(mtime).toLocaleString(),
        };

        if (
            JSON.stringify(fileDetails) !== JSON.stringify(initialFileDetails)
        ) {
            await fsPromises.writeFile(
                jsonFilePath,
                JSON.stringify(fileDetails, null, 2)
            );
        }
    }

    // Traverse through source directory
    const filesInSource = await fsPromises.readdir(sourceDirPath);
    
    for (const fileName of filesInSource) {
        const sourcePath = path.join(sourceDirPath, fileName);
        const targetPath = path.join(targetDirPath, fileName);

        const stats = await fsPromises.lstat(sourcePath);
        if (stats.isDirectory()) {
            // Recursively sync directories
            await syncFilesAndFolders({
                sourceDirPath: sourcePath,
                targetDirPath: targetPath,
                fileNamePatterns,
                deleteExtraFilesInTarget,
            });
        } else {
            // Check if file matches patterns
            if (
                fileNamePatterns.length === 0 ||
                fileNamePatterns.some((pattern) => fileName.includes(pattern))
            ) {
                // Get source file modified time
                const sourceStats = await fsPromises.stat(sourcePath);
                const sourceFileModifiedTime = sourceStats.mtime.getTime();

                // Check if file exists in target and if it's modified or new
                const targetExists = fs.existsSync(targetPath);
                
                if (
                    !targetExists ||
                    !fileDetails[fileName] ||
                    fileDetails[fileName]?.mtime !== sourceFileModifiedTime
                ) {
                    // Copy or replace the file in the target directory
                    await fsPromises.copyFile(sourcePath, targetPath);
                    console.log(
                        `Copied file: ${path.relative(sourceDirPath, sourcePath)}`
                    );
                    
                    // Update file details
                    await updateFileDetails({
                        fileName,
                        sourceFilePath: sourcePath,
                        mtime: sourceFileModifiedTime,
                    });
                }
            }
        }
    }

    async function cleanUpFilesAndDirs(fileDetails: TFileDetails, targetDir: string) {
        // Iterate over fileDetails to check if source paths exist
        for (const [fileName, detail] of Object.entries(fileDetails)) {
            const sourceFilePath = detail.sourceFilePath
            const targetFilePath = path.join(targetDir, fileName);

            // Check if the source file exists
            const sourceExists = fs.existsSync(sourceFilePath);
            if (!sourceExists) {
                // Delete the file from the target directory
                if (fs.existsSync(targetFilePath)) {
                    await fsPromises.unlink(targetFilePath);
                    // console.log(`Deleted target file: ${targetFilePath}`);
                }

                // Delete the file entry from fileDetails
                delete fileDetails[fileName];
            }
        }

        if (
            JSON.stringify(fileDetails) !== JSON.stringify(initialFileDetails)
        ) {
            await fsPromises.writeFile(
                jsonFilePath,
                JSON.stringify(fileDetails, null, 2)
            );
        }
    }

    // Check for files in target directory that are not in source directory
    if (deleteExtraFilesInTarget) {
        await cleanUpFilesAndDirs(fileDetails, targetDirPath);
    }
}
