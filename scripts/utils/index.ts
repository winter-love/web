import fs from 'fs'
import path from 'path'

export const getPackage = (cwd: string): Record<string, any> => {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')).toString())
  } catch {
    return {}
  }
}
