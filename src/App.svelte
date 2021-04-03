<script lang="ts">
	import {onMount} from "svelte";
	import {audioCtx} from "./audioStores";

	let sampleRate
	let binCount;

	const setup = async () => {
		analyser = audioCtx.createAnalyser();
		analyser.fftSize = 	8192;
		binCount = analyser.frequencyBinCount
		fftData = new Uint8Array(binCount);
		waveformData = new Float32Array(binCount);

		const stream = await navigator.mediaDevices.getUserMedia({audio: true});
		const source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyser);

		if (audioCtx.state === "running") {
			setInterval(updateData, 20);
		}
	}


	let ready = false;
	let analyser
	let fftData: Uint8Array;
	let waveformData: Float32Array;
	let width, height;
	let freq: number;

	function indexOfMax(arr) {
		if (arr.length === 0) {
			return -1;
		}

		var max = arr[0];
		var maxIndex = 0;

		for (var i = 1; i < arr.length; i++) {
			if (arr[i] > max) {
				maxIndex = i;
				max = arr[i];
			}
		}

		return maxIndex;
	}

	const updateData = () => {
		if (audioCtx.state === "running") {
			analyser.getByteFrequencyData(fftData);
			analyser.getFloatTimeDomainData(waveformData);
			fftData = fftData;
			waveformData = waveformData;  // -1 to 1
			freqPoints = [...fftData].map(freqPointToXY).join(" ");
			wavPoints = [...waveformData].map(wavPointToXY).join(" ");

			sampleRate = audioCtx.sampleRate;
			// freq = samp
			// freq = Math.max(freqPoints)
			getPitch(fftData);
		}
	}

	const getPitch = (fftData) => {
		const bin = indexOfMax(fftData)
		freq = (22000 / binCount) * bin
		console.log("freq: ", freq)
	}


	onMount(async () => {
		setup()
		// return () => clearInterval(interval)
	})

	$ : {
		if (ready) setup();
	}


	let freqPoints: string;
	let wavPoints: string;

	const freqPointToXY = (value: number, index: number, arr: any) => {
		const xVal = (width / fftData.length) * index;
		return `${xVal},${height - value}`;
	}

	const wavPointToXY = (value: number, index: number, arr: any) => {
		const xVal = (width / waveformData.length) * index;
		const mid = (height / 2);
		const scaledVal = value  * mid
		return `${xVal},${(height / 2) - scaledVal}`
	}

	const playPause = () => {
		console.log("audio context state: ", audioCtx.state)
		if (audioCtx.state === "running") {
			audioCtx.suspend();
		}
		else {
			audioCtx.resume()
			.then(res => {
				console.log(res)
			})
		}
	}


</script>

<main>
	<div class="rawDataContainer">
		<p>{fftData}</p>
		<p>{waveformData}</p>
	</div>
	<button on:click={playPause}>Start</button>
	<div class="viewer"  bind:clientWidth={width} bind:clientHeight={height}>
		<svg width="100vw" height="100vw">
			<polyline stroke="white" points={freqPoints}/>
			<polyline stroke="yellow" points={wavPoints}/>
		</svg>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 0;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	svg {
		background: black;
	}

	.viewer {
		filter: blur(0.5px);

	}

	.rawDataContainer {
		height: 100px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>