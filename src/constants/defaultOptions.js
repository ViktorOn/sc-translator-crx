import { GOOGLE_COM, BING_COM } from './translateSource';
import { LANG_EN } from './langCode';
import { styleVarsList } from './defaultStyleVars';

const defaultOptions = {
    userLanguage: LANG_EN,
    enableContextMenus: true,
    defaultTranslateSource: GOOGLE_COM,
    defaultTranslateFrom: '',
    defaultTranslateTo: '',
    translateDirectly: false,
    translateBlackListMode: true,
    translateHostList: [],
    historyBlackListMode: false,
    historyHostList: [],
    showButtonAfterSelect: true,
    defaultAudioSource: GOOGLE_COM,
    translateWithKeyPress: false,
    useDotCn: false,
    multipleTranslateMode: false,
    multipleTranslateSourceList: [GOOGLE_COM, BING_COM],
    multipleTranslateFrom: '',
    multipleTranslateTo: '',
    enablePdfViewer: false,
    preferredLanguage: LANG_EN,
    secondPreferredLanguage: LANG_EN,
    styleVarsList: styleVarsList,
    styleVarsIndex: 0,
    btnPosition: { x: 5, y: 5 },
    audioVolume: 100,
    audioPlaybackRate: 1,
    hideButtonAfterFixedTime: false,
    hideButtonFixedTime: 1000,
    respondToSeparateWindow: false,
    // 'stw' means 'Separate translate Window'
    rememberStwSizeAndPosition: false,
    stwSizeAndPosition: { width: 286, height: 439, left: 550, top: 250 },
    pinThePanelWhileOpeningIt: false
};

export default defaultOptions;