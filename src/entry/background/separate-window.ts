import { sendTabsCallOutCommandKeyPressed, sendTabsSeparateWindowSetText } from "../../public/send";
import { getQueryString } from "../../public/translate/utils";
import { getLocalStorageAsync } from "../../public/utils";
import { DefaultOptions } from "../../types";

type PickedOptions = Pick<DefaultOptions, 'rememberStwSizeAndPosition' | 'stwSizeAndPosition'>;
const keys: (keyof PickedOptions)[] = ['rememberStwSizeAndPosition', 'stwSizeAndPosition'];

const initSize = { width: 286, height: 439, left: 550, top: 250 };

const swUrl = chrome.runtime.getURL('/separate.html');

const isSeparateWindowCreated = async (): Promise<null | { tabId: number, windowId: number }> => {
    return await new Promise((resolve) => {
        chrome.runtime.sendMessage('Are you separate window?', (data: { tabId: number, windowId: number }) => {
            chrome.runtime.lastError && resolve(null);

            resolve(data);
        });
    });
};

export const createSeparateWindow = async (text?: string) => {
    const separateWindowInfo = await isSeparateWindowCreated();

    if (separateWindowInfo) {
        const { tabId, windowId } = separateWindowInfo;

        chrome.windows.update(windowId, { focused: true });

        sendTabsCallOutCommandKeyPressed(tabId);

        text && sendTabsSeparateWindowSetText(tabId, text);
    }
    else {
        const { rememberStwSizeAndPosition, stwSizeAndPosition } = await getLocalStorageAsync<PickedOptions>(keys);

        const createData: chrome.windows.CreateData = {
            url: swUrl + ((text && getQueryString({ text })) ?? ''),
            type: 'popup',
            ...(rememberStwSizeAndPosition ? stwSizeAndPosition : initSize)
        };

        chrome.windows.create(createData);
    }
};