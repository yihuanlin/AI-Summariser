const browser = globalThis.browser || globalThis.chrome
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === "updateTab") {
        try {
            await browser.tabs.update(sender.tab.id, { url: message.url });
            return { success: true };
        } catch (error) {
            console.error("Error updating tab:", error);
            return { error: error.toString() };
        }
    } else if (message.action === "openTab") {
        try {
            const tab = await browser.tabs.create({ url: message.url });
            return { tabId: tab.id };
        } catch (error) {
            console.error("Error opening tab:", error);
            return { error: error.toString() };
        }
    } else if (message.action === "executeScript") {
        try {
            await browser.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: [message.script]
            });
            return { success: true };
        } catch (error) {
            console.error("Error executing script:", error);
            return { error: error.toString() };
        }
    } else {
        return false;
    }
});

browser.action.onClicked.addListener(async tab => {
    await browser.tabs.sendMessage(tab.id, { action: "togglePanel" });
    return true;
});