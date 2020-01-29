import React, { ChangeEvent, ReactElement, memo, useCallback, useEffect, useState } from 'react';
import fileClick1 from './assets/audio/click1.wav';
import fileClick2 from './assets/audio/click2.wav';
import './Metronome.css';

const CLICK1 = new Audio(fileClick1);
const CLICK2 = new Audio(fileClick2);
const BEATS_PER_MEASURE = 4;

let timer: any;

const Metronome = (): ReactElement => {
    const [bpm, setBpm] = useState<number>(100);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);

    const playClick = useCallback((): void => {
        // The first beat will have a different sound than the others
        if (count % BEATS_PER_MEASURE === 0) {
            CLICK2.play();
        } else {
            CLICK1.play();
        }

        // Keep track of which beat we're on
        setCount(prevCount => (prevCount + 1) % BEATS_PER_MEASURE);
    }, [count]);

    const handleBpmChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        try {
            const bpm = Number(event.target.value);
            setBpm(bpm);
        } catch (e) {
            throw new Error('BPM is not a number.');
        }
    }, []);

    const startStop = useCallback(async (): Promise<void> => {
        if (isPlaying) {
            setIsPlaying(false);
            return;
        }

        await setCount(0);
        await setIsPlaying(true);
        playClick();
    }, [isPlaying, playClick]);

    useEffect(() => {
        if (isPlaying) {
            // Start a timer with the current BPM
            clearInterval(timer);
            timer = setInterval(playClick, (60 / bpm) * 1000);
        } else {
            // Stop the timer
            clearInterval(timer);
        }

        return (): void => clearInterval(timer);
    }, [isPlaying, playClick]);

    useEffect(() => {
        if (isPlaying) {
            clearInterval(timer);
            timer = setInterval(playClick, (60 / bpm) * 1000);

            // Reset counter
            setCount(0);
        }
    }, [bpm]);

    return (
        <div className='metronome'>
            <div className='bpm-slider'>
                <div>{ bpm } BPM</div>
                <input
                    type='range'
                    min='60'
                    max='240'
                    value={ bpm }
                    onChange={ handleBpmChange }
                />
            </div>
            <button onClick={ startStop }>
                { isPlaying ? 'Stop' : 'Start' }
            </button>
        </div>
    );
};

export default memo(Metronome);