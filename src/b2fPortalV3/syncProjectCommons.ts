import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "path";
import crypto from "node:crypto"; // Added crypto for file hashing

type TSyncFilesAndFoldersV2Params = {
    sourceDirPath: string;
    targetDirPath: string;
    fileNamePatterns?: string[];
    deleteExtraFilesInTarget?: boolean;
};

// Utility function to calculate file hash
async function getFileHash(filePath: string): Promise<string> {
    const fileBuffer = await fsPromises.readFile(filePath);
    const hashSum = crypto.createHash('sha1');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

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
            hash?: string; // Added hash property to store file content hash
        };
    };

    let fileDetails: TFileDetails = {};
    let initialFileDetails: TFileDetails = {};
      if (fs.existsSync(jsonFilePath)) {
        try {
            const fileContent = await fsPromises.readFile(jsonFilePath, "utf8");
            // Handle empty file case
            if (fileContent.trim() === '') {
                fileDetails = {};
            } else {
                fileDetails = JSON.parse(fileContent);
            }
            initialFileDetails = { ...fileDetails };
        } catch (error) {
            console.error(`Error reading or parsing ${jsonFilePath}:`, error);
            // Reset file details if there's an error
            fileDetails = {};
            initialFileDetails = {};
            // Create a valid JSON file
            await fsPromises.writeFile(jsonFilePath, "{}");
        }
    } else {
        await fsPromises.writeFile(jsonFilePath, "{}");
    }

    type TFileDetailsEntry = {
        sourceFilePath: string;
        mtime: number;
        fileName: string;
        hash: string; // Include hash in the entry type
    };
    
    async function updateFileDetails({ fileName, sourceFilePath, mtime, hash }: TFileDetailsEntry) {
        // const stats = await fsPromises.stat(sourceFilePath);
        fileDetails[fileName] = {
            sourceFilePath,
            mtime,
            localDate: new Date(mtime).toLocaleString(),
            hash, // Store the hash in file details
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
                // Get source file hash and modified time
                const sourceStats = await fsPromises.stat(sourcePath);
                const sourceFileModifiedTime = sourceStats.mtime.getTime();
                const sourceFileHash = await getFileHash(sourcePath);

                // Check if file exists in target and if it's modified or new
                const targetExists = fs.existsSync(targetPath);
                
                if (
                    !targetExists ||
                    !fileDetails[fileName] ||
                    !fileDetails[fileName]?.hash || // If hash doesn't exist (backwards compatibility)
                    fileDetails[fileName]?.hash !== sourceFileHash // Primary check: compare file hashes
                ) {
                    // Copy or replace the file in the target directory
                    await fsPromises.copyFile(sourcePath, targetPath);
                    console.log(
                        `Copied file: ${path.relative(sourceDirPath, sourcePath)}`
                    );
                    
                    // Update file details with hash included
                    await updateFileDetails({
                        fileName,
                        sourceFilePath: sourcePath,
                        mtime: sourceFileModifiedTime,
                        hash: sourceFileHash,
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
