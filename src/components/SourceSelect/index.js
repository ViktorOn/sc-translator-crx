import React, { useCallback, useState } from 'react';
import IconFont from '../IconFont';
import SelectOptions from '../SelectOptions';
import SourceFavicon from '../SourceFavicon';
import './style.css';

const SourceSelect = ({ onChange, sourceList, source, className, disabled }) => {
    const [showOptions, setShowOptions] = useState(false);

    const optionClick = useCallback((value) => {
        if (value === source) { return; }

        onChange(value);

        setShowOptions(false);
    }, [source, onChange]);

    return (
        <div
            tabIndex="-1"
            className={`ts-source-select${className ? ' ' + className : ''}${disabled ? ' ts-source-select-disabled' : ''}`}
            onClick={() => !disabled && setShowOptions(!showOptions)}
            onMouseLeave={() => !disabled && setShowOptions(false)}
            onMouseDown={e => disabled && e.preventDefault()}
        >
            <span className='ts-source-select-value'>
                <SourceFavicon source={source} />
            </span>
            <IconFont iconName='#icon-GoChevronDown' style={{position: 'absolute', right: '2px'}} />
            <SelectOptions
                className='ts-source-select-options ts-scrollbar'
                maxHeight={150}
                maxWidth={150}
                show={showOptions}
            >
                {sourceList.map((v) => (<div
                    className='ts-source-select-option'
                    key={v.source}
                    onClick={() => optionClick(v.source)}
                >
                    <SourceFavicon source={v.source} />
                </div>))}
            </SelectOptions>
        </div>
    );
};

export default SourceSelect;