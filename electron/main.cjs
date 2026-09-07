const { app, BrowserWindow, ipcMain, safeStorage, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

const isDev = !app.isPackaged;
const STORE = path.join(app.getPath('userData'), 'openai-key.bin');
const REPO = 'DSouLzz/Bildprojekt';

function readKey(){
  try { if(!fs.existsSync(STORE)) return ''; const b=fs.readFileSync(STORE); return safeStorage.isEncryptionAvailable()?safeStorage.decryptString(b):b.toString(); }
  catch { return ''; }
}
function writeKey(key){
  const data=safeStorage.isEncryptionAvailable()?safeStorage.encryptString(key):Buffer.from(key);
  fs.writeFileSync(STORE,data);
}

async function aiEdit({imageDataUrl,prompt}){
  const key=readKey();
  if(!key) throw new Error('OpenAI API-nyckel saknas. Lägg in den i Inställningar först.');
  const body={
    model:'gpt-5.6-luna',
    input:[{role:'user',content:[
      {type:'input_text',text:prompt},
      {type:'input_image',image_url:imageDataUrl,detail:'high'}
    ]}],
    tools:[{type:'image_generation',action:'edit',output_format:'png',quality:'auto',size:'auto'}]
  };
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  const d=await r.json();
  const call=(d.output||[]).find(x=>x.type==='image_generation_call' && x.result);
  if(!call) throw new Error('OpenAI returnerade ingen redigerad bild.');
  return `data:image/png;base64,${call.result}`;
}

function createWindow(){
  const win=new BrowserWindow({width:1440,height:900,minWidth:1050,minHeight:700,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false}});
  if(isDev) win.loadURL('http://localhost:5173'); else win.loadFile(path.join(__dirname,'../dist/index.html'));
  win.webContents.setWindowOpenHandler(({url})=>{require('electron').shell.openExternal(url);return {action:'deny'};});
  return win;
}

app.whenReady().then(()=>{
  const win=createWindow();
  ipcMain.handle('openai:get-key-state',()=>!!readKey());
  ipcMain.handle('openai:set-key',(_,key)=>{writeKey(String(key||'').trim());return true;});
  ipcMain.handle('openai:edit',(_,payload)=>aiEdit(payload));
  if(!isDev){
    autoUpdater.autoDownload=true;
    autoUpdater.autoInstallOnAppQuit=true;
    autoUpdater.checkForUpdates().catch(()=>{});
    autoUpdater.on('update-available',()=>win.webContents.send('update:available'));
    autoUpdater.on('update-downloaded',()=>win.webContents.send('update:downloaded'));
    autoUpdater.on('error',e=>win.webContents.send('update:error',String(e.message||e)));
  }
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
