function Game(canvas, simulationFunc, drawFunc) {
	var context = canvas.getContext("2d");
	var lastTimestamp = -1;
	var running = false;

	function mainLoop(timestamp) {
		if (lastTimestamp === -1) {
			lastTimestamp = timestamp;
		}
		var timeDiff = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		simulationFunc(timeDiff);
		drawFunc(context);

		if (running) {
			window.requestAnimationFrame(mainLoop);
		}
	}

	this.start = function() {
		running = true;
		window.requestAnimationFrame(mainLoop);
	}

	this.stop = function() {
		running = false;
	}

	this.keys = {};

	this.mapKeys = function(keyMap) {
		var game = this;
		for (var kc in keyMap) {
			game.keys[keyMap[kc]] = false;
		}
		window.onkeydown = function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				game.keys[keyMap[event.keyCode]] = true;
			}
		}
		window.onkeyup = function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				game.keys[keyMap[event.keyCode]] = false;
			}
		}
	}
}

function Entity(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.vx = 0;
	this.vy = 0;
	this.lastx = 0;
	this.lasty = 0;
}
Entity.prototype.move = function(elapsedSec) {
	this.lastx = this.x;
	this.lasty = this.y;
	this.x += elapsedSec * this.vx;
	this.y += elapsedSec * this.vy;
}
Entity.prototype.overlapsHoriz = function(other) {
	return this.x + this.width > other.x && this.x < other.x + other.width;
}
Entity.prototype.overlapsVert = function(other) {
	return this.y + this.height > other.y && this.y < other.y + other.height;
}
Entity.prototype.collides = function(other) {
	return this.overlapsHoriz(other) && this.overlapsVert(other);
}

Entity.prototype.didOverlapHoriz = function(other) {
	return this.lastx + this.width > other.lastx && this.lastx < other.lastx + other.width;
}
Entity.prototype.didOverlapVert = function(other) {
	return this.lasty + this.height > other.lasty && this.lasty < other.lasty + other.height;
}
