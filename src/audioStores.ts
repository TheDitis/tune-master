import {writable, readable, derived} from "svelte/store";


export const audioCtx = new window.AudioContext();


export const fftData = writable(new Uint8Array);

export const waveformData = writable(new Float32Array)