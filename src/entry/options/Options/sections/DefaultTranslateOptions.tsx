import React from 'react';
import { GenericOptionsProps } from '..';
import SourceSelect from '../../../../components/SourceSelect';
import { googleLangCode, langCode, mtLangCode, preferredLangCode, userLangs } from '../../../../constants/langCode';
import { GOOGLE_COM, translateSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { switchTranslateSource } from '../../../../public/switch-translate-source';
import { DefaultOptions } from '../../../../types';
import BetaIcon from '../../BetaIcon';
import CustomTranslateSourceDisplay from '../../CustomTranslateSourceDisplay';
import DefaultSelect from '../../DefaultSelect';
import MultipleSourcesDisplay from '../../MultipleSourcesDisplay';
import OptionToggle from '../../OptionToggle';

type DefaultTranslateOptionsProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'multipleTranslateMode' |
    'userLanguage' |
    'preferredLanguage' |
    'secondPreferredLanguage' |
    'multipleTranslateSourceList' |
    'multipleTranslateFrom' |
    'multipleTranslateTo' |
    'defaultTranslateSource' |
    'defaultTranslateFrom' |
    'defaultTranslateTo' |
    'useDotCn' |
    'customTranslateSourceList'
>>;

const DefaultTranslateOptions: React.FC<DefaultTranslateOptionsProps> = ({
    updateStorage,
    multipleTranslateMode,
    userLanguage,
    preferredLanguage,
    secondPreferredLanguage,
    multipleTranslateSourceList,
    multipleTranslateFrom,
    multipleTranslateTo,
    defaultTranslateSource,
    defaultTranslateFrom,
    defaultTranslateTo,
    useDotCn,
    customTranslateSourceList
}) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='use-dot-cn'
                    message='optionsUseDotCn'
                    checked={useDotCn}
                    onClick={() => updateStorage('useDotCn', !useDotCn)}
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsLanguage'
                    value={userLanguage}
                    onChange={value => updateStorage('userLanguage', value)}
                    options={userLangs}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsPreferredLanguage'
                    value={preferredLanguage}
                    onChange={value => updateStorage('preferredLanguage', value)}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsSecondPreferredLanguage'
                    value={secondPreferredLanguage}
                    onChange={value => updateStorage('secondPreferredLanguage', value)}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
                <div className='item-description'>{getMessage('optionsPreferredLanguageDescription')}</div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsCustomTranslateSource')}<BetaIcon />
                <div className='item-description'>
                    {getMessage('optionsCustomTranslateSourceDescription')}
                    <a
                        target='_blank'
                        href='https://github.com/chunibyocola/sc-translator-crx/discussions/31'
                        rel='noreferrer'
                    >
                        {getMessage('optionsCustomTranslateSourceLearn')}
                    </a>
                </div>
                <div className='mt10-ml30'>
                    <CustomTranslateSourceDisplay
                        customTranslateSources={customTranslateSourceList}
                        onChange={(value) => {
                            // If user delete the using custom sources, remove them from options(multipleTranslateSourceList/defaultTranslateSource).
                            const availableSources = translateSource.concat(value).map(v => v.source);
                            updateStorage('multipleTranslateSourceList', multipleTranslateSourceList.filter(v => availableSources.includes(v)));
                            updateStorage('defaultTranslateSource', availableSources.includes(defaultTranslateSource) ? defaultTranslateSource : GOOGLE_COM);

                            updateStorage('customTranslateSourceList', value)
                        }}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='multiple-translate-mode'
                    message='optionsMultipleTranslateMode'
                    checked={multipleTranslateMode}
                    onClick={() => updateStorage('multipleTranslateMode', !multipleTranslateMode)}
                />
            </div>
            {multipleTranslateMode ? <>
                <div className='opt-section-row'>
                    {getMessage('optionsSourceList')}
                    <div className='item-description'>{getMessage('optionsMultipleTranslateSourceListDescription')}</div>
                    <div className='mt10-ml30'>
                        <MultipleSourcesDisplay
                            enabledSources={multipleTranslateSourceList}
                            sources={translateSource.concat(customTranslateSourceList)}
                            onChange={value => updateStorage('multipleTranslateSourceList', value)}
                        />
                    </div>
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsFrom'
                        value={multipleTranslateFrom}
                        onChange={value => updateStorage('multipleTranslateFrom', value)}
                        options={mtLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsTo'
                        value={multipleTranslateTo}
                        onChange={value => updateStorage('multipleTranslateTo', value)}
                        options={mtLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
            </> : <>
                <div className='opt-section-row'>
                    {getMessage('optionsSource')}
                    <SourceSelect
                        className='border-bottom-select opt-source-select'
                        sourceList={translateSource.concat(customTranslateSourceList)}
                        source={defaultTranslateSource}
                        onChange={value => {
                            const { source, from, to } = switchTranslateSource(value, {
                                source: defaultTranslateSource,
                                from: defaultTranslateFrom,
                                to: defaultTranslateTo
                            });
                            updateStorage('defaultTranslateSource', source);
                            updateStorage('defaultTranslateFrom', from);
                            updateStorage('defaultTranslateTo', to);
                        }}
                    />
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsFrom'
                        value={defaultTranslateFrom}
                        onChange={value => updateStorage('defaultTranslateFrom', value)}
                        options={(langCode[defaultTranslateSource] ?? googleLangCode)[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsTo'
                        value={defaultTranslateTo}
                        onChange={value => updateStorage('defaultTranslateTo', value)}
                        options={(langCode[defaultTranslateSource] ?? googleLangCode)[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
            </>}
        </div>
    );
};

export default DefaultTranslateOptions;