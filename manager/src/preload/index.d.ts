import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    fileAPI: {
        isExist(path): Promise<boolean>
        readTextFile(path: string): Promise<string>
        writeTextFile(path: string, text: string): void
        deleteFile(path: string): void
    }

    processAPI: {
        exec(command: string, cwd?: string)
    }

    electron: ElectronAPI
    api: unknown
  }
}
