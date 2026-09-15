import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
/* contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
}) */

contextBridge.exposeInMainWorld("api", {
  expenses: {
    create: (expense: any) => ipcRenderer.invoke("expenses:create", expense),
    createDetail: (detail: any) =>
      ipcRenderer.invoke("expenses:create-detail", detail),
    getAll: () => ipcRenderer.invoke("expenses:get-all"),
    getAllByPeriod: (year: number, month: number) =>
      ipcRenderer.invoke("expenses:get-all-by-period", year, month),
    getOne: (id: number) => ipcRenderer.invoke("expenses:get-one", id),
    remove: (id: number) => ipcRenderer.invoke("expenses:remove", id),
    removeDetail: (id: number) =>
      ipcRenderer.invoke("expenses:remove-detail", id),
    loadMock: () => ipcRenderer.invoke("expenses:load-mock"),
    getSummaryByCategories: (year: number, month: number) =>
      ipcRenderer.invoke("expenses:summary-categories", year, month),
  },
  categories: {
    getAll: () => ipcRenderer.invoke("categories:get-all"),
    create: (category: any) =>
      ipcRenderer.invoke("categories:create", category),
    remove: (categoryId: number) =>
      ipcRenderer.invoke("categories:remove", categoryId),
  },
});
