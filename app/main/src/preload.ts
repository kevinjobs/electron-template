import { contextBridge, ipcRenderer } from 'electron';
import CHANNELS from '../../const/channels.mjs';

export type IPC = {
  sendMsg(msg: string): Promise<string>;
  receiveMsg(): Promise<string>;
}

declare global {
  interface Window {
    ipc: IPC;
  }
}

const IPC_API: IPC = {
  sendMsg,
  receiveMsg
}

contextBridge.exposeInMainWorld("ipc", IPC_API);

// ipc handles
async function sendMsg(msg: string) {
  return await ipcRenderer.invoke(CHANNELS.sendMsg, msg);
}

async function receiveMsg():Promise<string> {
  return new Promise((res, rej) => {
    ipcRenderer.on(CHANNELS.replyMsg, (evt, msg: string) => {
      res(msg);
    })
  })
}