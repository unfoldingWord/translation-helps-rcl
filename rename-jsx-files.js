const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const rename = promisify(fs.rename)

// Function to check if file contains JSX
async function containsJSX(filePath) {
  try {
    const content = await readFile(filePath, 'utf8')

    // Common patterns that indicate JSX usage
    const jsxPatterns = [
      /import\s+.*\s+from\s+['"]react['"]/, // React import
      /<[a-z]+.*>/, // JSX HTML element
      /\breturn\s*\(/, // return statement with parentheses (common in JSX)
      /className=/, // className attribute
      /props\./, // props usage
    ]

    return jsxPatterns.some(pattern => pattern.test(content))
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to walk through directory recursively
async function walk(dir) {
  const files = await fs.promises.readdir(dir)
  const results = []

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = await fs.promises.stat(filePath)

    if (
      stat.isDirectory() &&
      !file.includes('node_modules') &&
      !file.includes('.git')
    ) {
      results.push(...(await walk(filePath)))
    } else if (file.endsWith('.js')) {
      results.push(filePath)
    }
  }

  return results
}

// Main function
async function renameJsxFiles() {
  try {
    const files = await walk(process.cwd())
    let count = 0

    for (const file of files) {
      if (await containsJSX(file)) {
        const newPath = file.replace(/\.js$/, '.jsx')
        await rename(file, newPath)
        console.log(`Renamed: ${file} -> ${newPath}`)
        count++
      }
    }

    console.log(`\nCompleted! Renamed ${count} files to .jsx`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
renameJsxFiles('./src')
