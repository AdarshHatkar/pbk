import * as fs from 'fs';
import * as path from 'path';

/**
 * Deletes all files in the target directory and copies all files from source directory
 * @param sourcePath - Source directory path
 * @param targetPath - Target directory path
 */
export async function deleteAndCopy(sourcePath: string, targetPath: string): Promise<void> {
    try {
        // Ensure target directory exists
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        } else {
            // Delete existing files and directories in target
            const items = fs.readdirSync(targetPath);
            for (const item of items) {
                const itemPath = path.join(targetPath, item);
                if (fs.lstatSync(itemPath).isDirectory()) {
                    fs.rmSync(itemPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(itemPath);
                }
            }
        }

        // Copy all files from source to target
        copyDirectoryRecursive(sourcePath, targetPath);
        console.log(`Successfully copied all files from ${sourcePath} to ${targetPath}`);
    } catch (error) {
        console.error(`Error during deleteAndCopy operation:`, error);
        throw error;
    }
}

/**
 * Copies directory contents recursively
 * @param source - Source directory
 * @param target - Target directory
 */
function copyDirectoryRecursive(source: string, target: string): void {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    
    // Get all files and directories in the source
    const items = fs.readdirSync(source);
    
    for (const item of items) {
        const sourcePath = path.join(source, item);
        const targetPath = path.join(target, item);
        
        if (fs.lstatSync(sourcePath).isDirectory()) {
            // Recursively copy subdirectories
            copyDirectoryRecursive(sourcePath, targetPath);
        } else {
            // Copy files
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
}