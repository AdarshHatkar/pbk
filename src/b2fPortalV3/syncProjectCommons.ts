import fs from "node:fs";
import path from "path";

type TSyncFilesAndFoldersV2Params = {
    sourceDirPath: string;
    targetDirPath: string;
    fileNamePatterns?: string[];
    deleteExtraFilesInTarget?: boolean;
};

export function syncFilesAndFolders({
    sourceDirPath,
    targetDirPath,
    fileNamePatterns = [],
    deleteExtraFilesInTarget = true,
}: TSyncFilesAndFoldersV2Params) {
    if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
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
        fileDetails = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
        initialFileDetails = { ...fileDetails };
    } else {
        fs.writeFileSync(jsonFilePath, "{}");
    }

    type TFileDetailsEntry = {
        sourceFilePath: string;
        mtime: number;
        fileName: string;
    };
    function updateFileDetails({ fileName, sourceFilePath, mtime }:TFileDetailsEntry) {
        const stats = fs.statSync(sourceFilePath);
        fileDetails[fileName] = {
            sourceFilePath,
            mtime,
            localDate: new Date(mtime).toLocaleString(),
        };

        if (
            JSON.stringify(fileDetails) !== JSON.stringify(initialFileDetails)
        ) {
            fs.writeFileSync(
                jsonFilePath,
                JSON.stringify(fileDetails, null, 2)
            );
        }
    }

    // Traverse through source directory
    const filesInSource = fs.readdirSync(sourceDirPath);
    filesInSource.forEach((fileName) => {
        const sourcePath = path.join(sourceDirPath, fileName);
        const targetPath = path.join(targetDirPath, fileName);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            // Recursively sync directories
            syncFilesAndFolders({
                sourceDirPath: sourcePath,
                targetDirPath: targetPath,
                fileNamePatterns,
                deleteExtraFilesInTarget,
            });
        } else {
            // Function to check if a file matches any pattern in the array

            // Loop through files
            if (
                fileNamePatterns.length === 0 ||
                fileNamePatterns.some((pattern) => fileName.includes(pattern))
            ) {
                // if (fileName === 'gamesZod.ts') {
                //     console.log({
                //         existsSync: fs.existsSync(targetPath),
                //         stats: fs.statSync(sourcePath),
                //         mtime: fs.statSync(sourcePath).mtime,
                //         mtimeMs: fs.statSync(sourcePath).mtime.getTime(),
                //         name: path.basename(sourcePath),
                //         fileName,
                //         localDate: new Date(fs.statSync(sourcePath).mtime.getTime()).toLocaleString(),

                //     });
                // }

                const sourceFileModifiedTime = fs
                    .statSync(sourcePath)
                    .mtime.getTime();

                // Check if file exists in target and if it's modified or new
                if (
                    !fs.existsSync(targetPath) ||
                    !fileDetails[fileName] ||
                    fileDetails[fileName]?.mtime !== sourceFileModifiedTime
                ) {
                    // Copy or replace the file in the target directory

                    fs.copyFileSync(sourcePath, targetPath);
                    console.log(
                        `Copied file: ${path.relative(sourceDirPath, sourcePath)}`
                    );
                    // Update file details
                    updateFileDetails({
                        fileName,
                        sourceFilePath: sourcePath,
                        mtime: sourceFileModifiedTime,
                    });
                }
            }
        }
    });

    function cleanUpFilesAndDirs(fileDetails: TFileDetails, targetDir: string) {
        // Iterate over fileDetails to check if source paths exist
        for (const [fileName, detail] of Object.entries(fileDetails)) {
            const sourceFilePath = path.join(detail.sourceFilePath);
            const targetFilePath = path.join(targetDir, fileName);

            // Check if the source file exists
            if (!fs.existsSync(sourceFilePath)) {
                // console.log(`Source file not found: ${fullPath}, removing from target and fileDetails...`);

                // Delete the file from the target directory
                if (fs.existsSync(targetFilePath)) {
                    fs.unlinkSync(targetFilePath);
                    // console.log(`Deleted target file: ${targetFilePath}`);
                }

                // Delete the file entry from fileDetails
                delete fileDetails[fileName];
            }
        }

        if (
            JSON.stringify(fileDetails) !== JSON.stringify(initialFileDetails)
        ) {
            fs.writeFileSync(
                jsonFilePath,
                JSON.stringify(fileDetails, null, 2)
            );
        }
    }

    // Check for files in target directory that are not in source directory
    if (deleteExtraFilesInTarget) {
        cleanUpFilesAndDirs(fileDetails, targetDirPath);
    }
}
