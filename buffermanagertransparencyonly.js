import BufferManager from './buffermanager.js'

/*
 * A buffer manager that keeps track of only 2 buffers, one opaque and one with transparent data.
 * The buffers in this class use an additional buffer to store vertex-colors.
 * 
 */
export default class BufferManagerTransparencyOnly extends BufferManager {
	constructor(settings, renderer, bufferSetPool) {
		super(settings, renderer, bufferSetPool);
	}

	/*
	 * This implementation uses only the transparency for the key, since transparency is a boolean, there are only two slots.
	 */
	getKey(transparency, color, sizes) {
		return transparency;
	}
	
	shouldFlush(sizes, buffer) {
		if (super.shouldFlush(sizes, buffer)) {
			return true;
		}
		return sizes.colors + (buffer != null ? buffer.colorsIndex : 0) > this.MAX_BUFFER_SIZE * this.colorBufferFactor;
	}
	
	/* 
	 * In addition to a default buffer, also add a color buffer
	 */
	createBufferSet(transparency, color, sizes) {
		var buffer = super.createBuffer(transparency, color, sizes);
		buffer.colors = new Float32Array(sizes.colors);
		buffer.colorsIndex = 0;
		return buffer;
	}
	
	/*
	 * Additionally reset the color buffer
	 */
	resetBuffer(buffer) {
		super.resetBuffer(buffer);
		buffer.colorsIndex = 0;
	}
}