const setStorage = async (key: string) => {
    await chrome.storage.session.set({ [key]: "world!" });
};

setStorage("testKey");