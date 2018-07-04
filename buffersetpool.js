export default class BufferSetPool {
	constructor(maxPoolSize, useObjectColors) {
		this.maxPoolSize = maxPoolSize;
		this.useObjectColors = useObjectColors;
		
		this.currentPoolSize = 0;
		
		this.available = new Set();
		this.used = new Set();
		
		window.buffersetpool = this;
	}
	
	lease(bufferManager, hasTransparency, color, sizes) {
		if (this.currentPoolSize >= this.maxPoolSize) {
			throw "Maximum pool size exceeded";
		}
		
		if (this.available.size > 0) {
			var bufferSet = this.available.keys().next().value;
			this.used.add(bufferSet);
			this.available.delete(bufferSet);
			return bufferSet;
		}
		var newBufferSet = bufferManager.createBufferSet(hasTransparency, color, sizes);
		this.currentPoolSize++;
		this.used.add(newBufferSet);
		return newBufferSet;
	}
	
	release(bufferSet) {
		this.used.delete(bufferSet);
		this.available.add(bufferSet);
		
		bufferSet.positionsIndex = 0;
		bufferSet.normalsIndex = 0;
		bufferSet.indicesIndex = 0;
		bufferSet.nrIndices = 0;
		bufferSet.colorsIndex = 0;
	}
	
	cleanup() {
		this.available.clear();
		this.used.clear();
	}
}