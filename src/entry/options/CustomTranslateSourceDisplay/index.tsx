import React, { useCallback, useEffect, useRef, useState } from 'react';
import IconFont from '../../../components/IconFont';
import defaultOptions from '../../../constants/defaultOptions';
import { getMessage } from '../../../public/i18n';
import { getOptions, initOptions } from '../../../public/options';
import { checkResultFromCustomSource } from '../../../public/translate/custom/check-result';
import { CustomTranslateSource } from '../../../types';
import './style.css';

type CustomTranslateSourceDisplayProps = {
    customTranslateSources: CustomTranslateSource[];
    onChange: (customTranslateSources: CustomTranslateSource[]) => void;
};

const CustomTranslateSourceDisplay: React.FC<CustomTranslateSourceDisplayProps> = ({ customTranslateSources, onChange }) => {
    const [modifying, setModifying] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [customSources, setCustomSources] = useState<CustomTranslateSource[]>([]);
    const [message, setMessage] = useState('');

    const urlInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const testDataRef = useRef({ id: 0, url: '' });

    useEffect(() => {
        setCustomSources([...customTranslateSources]);
    }, [customTranslateSources]);

    const onAddBtnClick = useCallback(() => {
        if (!urlInputRef.current || !nameInputRef.current) { return; }
        const url = urlInputRef.current.value ?? '';
        const name = nameInputRef.current.value.substring(0, 20) || 'Custom source';

        if (testDataRef.current.url === url) { return; }

        try {
            new URL(url);

            ++testDataRef.current.id;

            urlInputRef.current.disabled = true;
            nameInputRef.current.disabled = true;

            setMessage(`URL: ${url} ${getMessage('wordRequesting')}`);

            const id = testDataRef.current.id;

            testCustomSource(url).then(() => {
                if (!urlInputRef.current || !nameInputRef.current || testDataRef.current.id !== id) { return; }

                setCustomSources(customSources.concat({
                    url,
                    name,
                    source: window.btoa(Number(new Date()).toString() + Math.floor(Math.random() * 10000).toString())
                }));

                setUpdated(true);
                setMessage('');

                urlInputRef.current.value = '';
                nameInputRef.current.value = '';
            }).catch((err) => {
                if (testDataRef.current.id !== id) { return; }

                setMessage((err as Error).message);
            }).finally(() => {
                if (!urlInputRef.current || !nameInputRef.current || testDataRef.current.id !== id) { return; }

                urlInputRef.current.disabled = false;
                nameInputRef.current.disabled = false;

                testDataRef.current.url = '';
            });
        }
        catch (err) {
            setMessage(`Error: ${(err as Error).message}`);
        }
    }, [customSources]);

    const onSaveBtnClick = useCallback(() => {
        onChange(customSources);
        initOptions({ ...defaultOptions, customTranslateSourceList: customSources });

        setModifying(false);
        setUpdated(false);
        setMessage('');
        testDataRef.current = { id: testDataRef.current.id + 1, url: '' };
    }, [onChange, customSources]);

    const onCancelBtnClick = useCallback(() => {
        setUpdated(false);
        setModifying(false);
        setMessage('');
        setCustomSources(customTranslateSources);
        testDataRef.current = { id: testDataRef.current.id + 1, url: '' };
    }, [customTranslateSources]);

    return (
        <div className='custom-translate-source'>
            <div className='custom-translate-source__content'>
                <div className='custom-translate-source__item'>
                    <div>URL</div>
                    <div>{getMessage('wordName')}</div>
                    <button disabled={modifying} onClick={() => setModifying(true)}>{getMessage('optionsModify')}</button>
                </div>
                {customSources.length > 0 ? customSources.map(({ url, name, source }, i) => (<div className='custom-translate-source__item' key={source}>
                    <input value={url} disabled type='text' />
                    <input value={name} disabled type='text' />
                    {modifying && <div>
                        <IconFont
                            iconName='#icon-MdDelete'
                            className='button'
                            onClick={() => {
                                setCustomSources(customSources.filter((value, j) => (i !== j)));
                                setUpdated(true);
                            }}
                        />
                    </div>}
                </div>)) : <div className='item-description'>{getMessage('contentNoRecord')}</div>}
                {modifying && <div className='custom-translate-source__item'>
                    <input ref={urlInputRef} placeholder={getMessage('optionsURLCanNotBeEmpty')} />
                    <input ref={nameInputRef} placeholder='Custom source' />
                    <IconFont iconName='#icon-MdAdd' className='button' onClick={onAddBtnClick} />
                </div>}
                {message && <div>{message}</div>}
                {modifying && <div>
                    <button disabled={!updated} onClick={onSaveBtnClick}>{getMessage('wordSave')}</button>
                    <button onClick={onCancelBtnClick}>{getMessage('wordCancel')}</button>
                </div>}
            </div>
        </div>
    );
};

const testCustomSource = async (url: string) => {
    const fetchJSON = {
        text: 'test',
        from: 'auto',
        to: 'en',
        userLang: navigator.language,
        preferred: [getOptions().preferredLanguage, getOptions().secondPreferredLanguage]
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchJSON)
    }).catch(() => { throw new Error('Error: Connection timed out.'); });

    if (!res.ok) { throw new Error(`Error: Bad request(http code: ${res.status}).`); }

    const data = await res.json();

    checkResultFromCustomSource(data);
};

export default CustomTranslateSourceDisplay;