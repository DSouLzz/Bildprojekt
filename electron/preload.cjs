const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api',{
  openai:{
    hasKey:()=>ipcRenderer.invoke('openai:get-key-state'),
    setKey:key=>ipcRenderer.invoke('openai:set-key',key),
    edit:payload=>ipcRenderer.invoke('openai:edit',payload)
  },
  updater:{
    onAvailable:cb=>ipcRenderer.on('update:available',cb),
    onDownloaded:cb=>ipcRenderer.on('update:downloaded',cb),
    onError:cb=>ipcRenderer.on('update:error',(_,msg)=>cb(msg))
  }
});
