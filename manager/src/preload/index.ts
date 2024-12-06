import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import path from 'path'
import { text } from 'stream/consumers'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("fileAPI", {
        isExist: (path: string)=>ipcRenderer.invoke("isExist", path),
        readTextFile: (path: string)=>ipcRenderer.invoke("readTextFile", path),
        writeTextFile: (path: string, text: string)=>ipcRenderer.invoke("writeTextFile", path, text),
        deleteFile: (path: string)=>ipcRenderer.invoke("deleteFile", path)
    });
    contextBridge.exposeInMainWorld("processAPI", {
        exec: (command: string, cwd?: string)=>ipcRenderer.invoke("exec", command, cwd)
    })
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
