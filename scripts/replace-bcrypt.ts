import fs from "fs"
import path from "path"

function findAndReplace(dir: string, findRegex: RegExp, replace: string) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Recursively search directories
      findAndReplace(filePath, findRegex, replace)
    } else if (stat.isFile() && (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js"))) {
      // Process TypeScript and JavaScript files
      const content = fs.readFileSync(filePath, "utf8")

      if (findRegex.test(content)) {
        console.log(`Replacing in ${filePath}`)
        const newContent = content.replace(findRegex, replace)
        fs.writeFileSync(filePath, newContent, "utf8")
      }
    }
  }
}

// Replace all imports of bcrypt with bcryptjs
findAndReplace(".", /import\s+(\w+|\{[^}]*\})\s+from\s+['"]bcrypt['"]/g, 'import $1 from "bcryptjs"')
findAndReplace(".", /require$$['"]bcrypt['"]$$/g, 'require("bcryptjs")')

console.log("Replacement complete")
