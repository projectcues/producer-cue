import fs from 'node:fs'
import path from 'node:path'

function walk(dir) {
  let files = []
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      files = files.concat(walk(fullPath))
    } else if (fullPath.endsWith('.js') && !fullPath.endsWith('.test.js')) {
      files.push(fullPath)
    }
  }
  return files
}

const vendorDir = path.resolve('vendor/@nordcraft')
const jsFiles = walk(vendorDir)
console.log(`Found ${jsFiles.length} JavaScript files in vendor/@nordcraft`)

let modifiedCount = 0

for (const file of jsFiles) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false

  // 1. Fix @nordcraft subpath imports without .js
  content = content.replace(/(from\s+['"])(@nordcraft\/[^'"]+)(['"])/g, (match, p1, p2, p3) => {
    if (p2.endsWith('.js') || p2.endsWith('.css') || p2.endsWith('.json')) {
      return match
    }
    if (p2.includes('/dist/')) {
      changed = true
      return `${p1}${p2}.js${p3}`
    }
    return match
  })

  // 2. Fix relative imports without extension
  content = content.replace(/(from\s+['"])(\.\.?\/[^'"]+)(['"])/g, (match, p1, relPath, p3) => {
    if (relPath.endsWith('.js') || relPath.endsWith('.css') || relPath.endsWith('.json')) {
      return match
    }
    const dir = path.dirname(file)
    const targetJs = path.resolve(dir, `${relPath}.js`)
    const targetIndex = path.resolve(dir, relPath, 'index.js')
    
    if (fs.existsSync(targetJs)) {
      changed = true
      return `${p1}${relPath}.js${p3}`
    } else if (fs.existsSync(targetIndex)) {
      changed = true
      return `${p1}${relPath}/index.js${p3}`
    }
    return match
  })

  // 3. Fix dynamic imports import('...')
  content = content.replace(/(import\s*\(\s*['"])(\.\.?\/[^'"]+|@nordcraft\/[^'"]+)(['"]\s*\))/g, (match, p1, spec, p3) => {
    if (spec.endsWith('.js') || spec.endsWith('.css') || spec.endsWith('.json')) {
      return match
    }
    if (spec.startsWith('@nordcraft/') && spec.includes('/dist/')) {
      changed = true
      return `${p1}${spec}.js${p3}`
    }
    if (spec.startsWith('.')) {
      const dir = path.dirname(file)
      const targetJs = path.resolve(dir, `${spec}.js`)
      const targetIndex = path.resolve(dir, spec, 'index.js')
      if (fs.existsSync(targetJs)) {
        changed = true
        return `${p1}${spec}.js${p3}`
      } else if (fs.existsSync(targetIndex)) {
        changed = true
        return `${p1}${spec}/index.js${p3}`
      }
    }
    return match
  })

  // 4. Fix export ... from './...'
  content = content.replace(/(export\s+(?:[^;]+)\s+from\s+['"])(\.\.?\/[^'"]+|@nordcraft\/[^'"]+)(['"])/g, (match, p1, spec, p3) => {
    if (spec.endsWith('.js') || spec.endsWith('.css') || spec.endsWith('.json')) {
      return match
    }
    if (spec.startsWith('@nordcraft/') && spec.includes('/dist/')) {
      changed = true
      return `${p1}${spec}.js${p3}`
    }
    if (spec.startsWith('.')) {
      const dir = path.dirname(file)
      const targetJs = path.resolve(dir, `${spec}.js`)
      const targetIndex = path.resolve(dir, spec, 'index.js')
      if (fs.existsSync(targetJs)) {
        changed = true
        return `${p1}${spec}.js${p3}`
      } else if (fs.existsSync(targetIndex)) {
        changed = true
        return `${p1}${spec}/index.js${p3}`
      }
    }
    return match
  })

  if (changed) {
    fs.writeFileSync(file, content, 'utf8')
    modifiedCount++
  }
}

console.log(`Successfully normalized ${modifiedCount} files with explicit ESM extensions!`)
