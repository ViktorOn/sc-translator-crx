import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../../components/Button';
import Draggable from '../../../components/Draggable';
import IconFont from '../../../components/IconFont';
import { getMessage } from '../../../public/i18n';
import { TextPreprocessingRegExp } from '../../../types';
import './style.css';

type RegExpListProps = {
    textPreprocessingRegExpList: TextPreprocessingRegExp[];
    onSave: (textPreprocessingRegExpList: TextPreprocessingRegExp[]) => void;
};

const RegExpList: React.FC<RegExpListProps> = ({ textPreprocessingRegExpList, onSave }) => {
    const [regExpList, setRegExpList] = useState<TextPreprocessingRegExp[]>([]);
    const [updated, setUpdated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [modifyMode, setModifyMode] = useState(false);

    const patternEleRef = useRef<HTMLInputElement>(null);
    const flagsEleRef = useRef<HTMLInputElement>(null);
    const replacementEleRef = useRef<HTMLInputElement>(null);

    const onDraggableChange = useCallback((values: TextPreprocessingRegExp[]) => {
        setRegExpList(values);
        setUpdated(true);
    }, []);

    useEffect(() => {
        setRegExpList(textPreprocessingRegExpList);
    }, [textPreprocessingRegExpList]);

    // only for unique key of "regExpList.map"
    const timestamp = new Date().getTime();

    return (
        <div className='regexp-list'>
            <div className='regexp-list__grid'>
                <span>{getMessage('optionsPattern')}</span>
                <span>{getMessage('optionsFlags')}</span>
                <span>{getMessage('optionsReplacement')}</span>
                <Button variant='contained' onClick={() => setModifyMode(true)} disabled={modifyMode}>{getMessage('optionsModify')}</Button>
            </div>
            <Draggable values={regExpList} onChange={onDraggableChange}>
                {regExpList.length > 0 ? regExpList.map((v, i) => (<div className='regexp-list__grid' key={i + timestamp} draggable-id={i + timestamp}>
                    <input type='text' disabled value={v.pattern} />
                    <input type='text' disabled value={v.flags} />
                    <input type='text' disabled value={v.replacement} />
                    {modifyMode && <span>
                        <Button
                            variant='icon'
                            onClick={() => {
                                setRegExpList(regExpList.filter(v1 => v1 !== v));
                                setUpdated(true);
                            }}
                        >
                            <IconFont iconName='#icon-MdDelete' />
                        </Button>
                        <IconFont iconName='#icon-move' className='draggable-move' />
                    </span>}
                </div>)) : <div className='item-description'>{getMessage('contentNoRecord')}</div>}
            </Draggable>
            {modifyMode && <div className='regexp-list__grid'>
                <input type='text' ref={patternEleRef} placeholder={getMessage('optionsPatternCanNotBeEmpty')}/>
                <input type='text' ref={flagsEleRef} />
                <input type='text' ref={replacementEleRef} />
                <div>
                    <Button
                        variant='icon'
                        onClick={() => {
                            if (!patternEleRef.current || !flagsEleRef.current || !replacementEleRef.current) { return; }

                            if (!patternEleRef.current.value) {
                                setErrorMessage(getMessage('optionsPatternCanNotBeEmpty'))
                                return;
                            }

                            const pattern = patternEleRef.current.value;
                            const flags = Object.keys(Array.from(flagsEleRef.current.value.replace(/[^gimsuy]/g, '')).reduce((t, c) => ({ ...t, [c]: c }), {})).join('');
                            const replacement = replacementEleRef.current.value;

                            try {
                                // Test this statement without error.
                                'test text'.replace(new RegExp(pattern, flags), replacement);

                                patternEleRef.current.value && setRegExpList((v) => ([...v, {
                                    pattern,
                                    flags,
                                    replacement
                                }]));

                                patternEleRef.current.value = '';
                                flagsEleRef.current.value = '';
                                replacementEleRef.current.value = '';

                                setUpdated(true);
                                setErrorMessage('');
                            }
                            catch (err) {
                                setErrorMessage(`Error: ${(err as Error).message}`);
                            }
                        }}
                    >
                        <IconFont iconName='#icon-MdAdd' />
                    </Button>
                </div>
            </div>}
            {errorMessage && <div>{errorMessage}</div>}
            {modifyMode && <div>
                <Button variant='contained' disabled={!updated} onClick={() => {
                    onSave(regExpList);
                    setUpdated(false);
                    setErrorMessage('');
                    setModifyMode(false);
                }}>
                    {getMessage('wordSave')}
                </Button>
                <Button variant='text' onClick={() => {
                    setUpdated(false);
                    setRegExpList(textPreprocessingRegExpList);
                    setErrorMessage('');
                    setModifyMode(false);
                }}>
                    {getMessage('wordCancel')}
                </Button>
            </div>}
        </div>
    );
};

export default RegExpList;