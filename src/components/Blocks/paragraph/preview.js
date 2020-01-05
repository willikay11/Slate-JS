import React, { useEffect, useState, memo } from 'react'
import { Preview } from './style';

const TextBoxPreview = memo(({ title }) => {
    const [tickTock, setTickTock] = useState(false);
    useEffect(
        function subscribeToIntervalTick() {
            const interval = setInterval(() => setTickTock(!tickTock), 500);
            return () => clearInterval(interval)
        },
        [tickTock],
    );
    return (
        <Preview>
            <div style={{ flex: 1, flexDirection: 'column', display: 'flex'}}>
                <span>Icon</span>
            </div>
            <div style={{ flex: 1, flexDirection: 'column', display: 'flex'}}>
                <span>Text</span>
            </div>
        </Preview>
    )
});
export default TextBoxPreview