import path from 'node:path'
import { copy } from './src/utils/copy'

copy(path.join(__dirname, './templates'), path.join(__dirname, './dist/template'))