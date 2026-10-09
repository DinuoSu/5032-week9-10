import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'

const args = ['emulators:start', '--project', 'demo-fit5032', '--only', 'auth,firestore,functions', '--export-on-exit=.emulator-data']
if (existsSync('.emulator-data/firebase-export-metadata.json')) args.push('--import=.emulator-data')
const child = spawn('firebase', args, { stdio: 'inherit' })
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('exit', (code) => process.exit(code ?? 0))
