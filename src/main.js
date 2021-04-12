import App from './App.svelte';
// import wasm from "./audio-utils/Cargo.toml";
// import {greet} from "./audio-utils"
// import {say_hi}
// import * as wasm from "audio-utils";
// import wasmInstantiate from "./audio-utils/src/lib.rs"
// import wasm from "./audio-utils/src/lib.rs"
// import wasmModule from "./audio-utils/src/lib.rs";

// const instance = new WebAssembly.Instance(wasmModule);


const init = async () => {
	// const module = await WebAssembly.compile(wasmCode);
	// const instance = new WebAssembly.Instance(module);
	// const add = instance.exports.add;
	// console.log(add())

	const app = new App({
		target: document.body,
		props: {
		}
	});
}


init();


// export default app;