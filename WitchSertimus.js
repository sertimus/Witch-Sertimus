 /* @source: http://sertimus.xyz/js/WitchSertimus.js
	@licstart  The following is the entire license notice for the 
    JavaScript code in this page.
    
	Witch Sertimus - Watch them fly around the page!
	Copyright (C) 2014-2024  gameaddict30/SertimusTheChao

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
	
    @licend  The above is the entire license notice
    for the JavaScript code in this page. */

class WitchSertimus {
	#active = false;
	#dirPrefix = null;

	#img = null;
	#srcElement = null;
	#x = 0;
	#y = 0;
	#offsetY = 0;
	#speed = 0;
	#width = 116;
	#height = 116;
	#mX = 0;
	#mY = 0;
	
	#aTNow = 0;
	#aTThen = 0;
	#aTElapsed = 0;
	#fps = 60;
	#fpsInterval = 0;
	#aOffsetTimer = 0;

	#sparkleList = [];
	#sparkleTimer = 0;

	constructor(targetElement, appPath) {
		this.#dirPrefix = appPath;

		this.#img= this.#dirPrefix + "./img/witchsert200pctransparent.png";
		
		this.#srcElement = targetElement;
		this.#srcElement.style.width = this.#width + "px";
		this.#srcElement.style.height = this.#height + "px";
		this.#srcElement.style.backgroundImage = "url(" + this.#img + ")";
		this.#srcElement.style.backgroundAttachment = "scroll";
		this.#srcElement.style.backgroundPosition = "top left";
		this.#srcElement.style.position = "absolute";
		this.#srcElement.style.zIndex = "99";
		this.#srcElement.style.pointerEvents = "none";
		this.#srcElement.style.visibility = "hidden";
	}

	/* toPolarCoords(int inX, int inY, int cX, int xY)
	Converts any given Cartesian coordinates to its polar representation, optionally with an offset.
	Returns a Javascript Object with key-value pairs in the following format:
	{	radius: Number,
		angle: Number	} */
	static toPolarCoords(inX,inY,cX,cY) {
		inX = typeof inX !== 'undefined' ? inX : 0.0;
		inY = typeof inY !== 'undefined' ? inY : 0.0;
		let subCart = {	x: inX-cX,
				y: inY-cY };
		let polar = { 	radius: Math.sqrt(subCart.x*subCart.x + subCart.y*subCart.y),
						angle:	Math.atan2(subCart.y,subCart.x) * 180.0/Math.PI };
		return polar;
	}

	/* toCartesianCoords(int inX, int inY, int cX, int xY)
		Converts any given polar coordinates to its Cartesian representation, optionally with an offset.
		Returns a Javascript Object with key-value pairs in the following format:
		{	x: Number,
			y: Number	} */
	static toCartesianCoords (inRadius,inAngle,inOffsetX,inOffsetY) {
		inOffsetX = typeof inOffsetX !== 'undefined' ? inOffsetX : 0.0;
		inOffsetY = typeof inOffsetY !== 'undefined' ? inOffsetY : 0.0;
		let cart = {	x: inOffsetX + inRadius * Math.cos(inAngle * 2.0 * Math.PI / 360.0),
						y: inOffsetY + inRadius * Math.sin(inAngle * 2.0 * Math.PI / 360.0) };
		return cart;
	}

	static getPageOffset() {
		return { x: window.pageXOffset || window.scrollX,
			y: window.pageYOffset || window.scrollY};
	}

	// The main logic loop for Witch Sertimus. Hee hee hee!
	updateObject() {
		this.#speed = 0.03 * Math.sqrt(Math.pow(this.#mX - this.#x, 2) + Math.pow(this.#mY - this.#y, 2));

		let position = WitchSertimus.toPolarCoords(this.#mX, this.#mY, this.#x, this.#y);
		position.radius = this.#speed;
		position = WitchSertimus.toCartesianCoords(position.radius, position.angle, 0, 0);
		this.#x = this.#x + position.x;
		this.#y = this.#y + position.y;

		this.#manageSparkles();
	}

	#manageAnimation() {
		if (this.#active) {
			requestAnimationFrame(() => this.#manageAnimation());
		}

		this.#aTNow = Date.now();
		this.#aTElapsed = this.#aTNow - this.#aTThen;

		if (this.#aTElapsed > this.#fpsInterval) {
			this.#aTThen = this.#aTNow - (this.#aTElapsed % this.#fpsInterval);
			this.#animate();
		}
	}

	#animate() {
		this.updateObject();

		if (this.#aOffsetTimer % 16 == 0) {
			if (this.#offsetY > 32)
				this.#offsetY = this.#offsetY * -1;
			this.#offsetY += 4;
			this.#aOffsetTimer = 0;
		}

		if (this.#x >= this.#mX) {
			this.#srcElement.style.transform = "scaleX(1)";
			this.#srcElement.style.filter = "";
		} else {
			this.#srcElement.style.transform = "scaleX(-1)";
			this.#srcElement.style.filter = "FlipH";
		}

		this.#srcElement.style.left = (this.#x - 58) + "px";
		this.#srcElement.style.top = (this.#y + Math.abs(this.#offsetY) - 58) + "px";

		this.#aOffsetTimer++;
	}

	// Create trailing sparkles.
	#createSparkle() {
		let node = document.createElement("div");
		this.#sparkleList.push(new Sparkle(document.body.appendChild(node), (this.#mX < this.#x ? this.#x + this.#width + 10 - 58 : this.#x - 10 - 58), this.#y + this.#height - 58, this.#dirPrefix));
	}

	// Maintain our array of sparkles. Delete any expired ones too.
	#manageSparkles() {
		if (this.#speed > 2 && this.#sparkleTimer == 4) {
			this.#createSparkle();
			this.#sparkleTimer = 0;
		} else if (this.#sparkleTimer == 16) {
			this.#sparkleTimer = 0;
		} else {
			this.#sparkleTimer++;
		}

		for (var i = 0; i < this.#sparkleList.length; i++) {
			if (this.#sparkleList[i].flaggedForDeletion()) {
				this.#sparkleList[i].getSrcNode().parentNode.removeChild(this.#sparkleList[i].getSrcNode());
				this.#sparkleList[i] = null;
				for (var j = i; j < this.#sparkleList.length - 1; j++) {
					var temp = this.#sparkleList[j];
					this.#sparkleList[j] = this.#sparkleList[j + 1];
					this.#sparkleList[j + 1] = temp;
				}
				this.#sparkleList.length--;
			}
		}
	}

	// Clear the list of sparkles and remove them from the DOM.
	#clearSparkles() {
		while(this.#sparkleList.length != 0) {
			let e = this.#sparkleList.pop();
			e.getSrcNode().parentNode.removeChild(e.getSrcNode());
		}
	}

	// Witch Sertimus mouse move event handler.
	handleMouseEvent(e) {
		e = e || window.event;
		let scrollInfo = WitchSertimus.getPageOffset();
		this.#mX = e.clientX + scrollInfo.x;
		this.#mY = e.clientY + scrollInfo.y;
	}

	start() {
		this.#active = true;
		this.#fpsInterval = 1000/this.#fps;
		this.#aTThen = Date.now();
		document.documentElement.addEventListener("mousemove", (e) => this.handleMouseEvent(e));
		requestAnimationFrame(() => this.#manageAnimation());
		this.#srcElement.style.visibility = "visible";
	}

	stop() {
		this.#active = false;
		this.#clearSparkles();
		document.documentElement.removeEventListener("mousemove", (e) => this.handleMouseEvent(e));
		this.#srcElement.style.visibility = "hidden";
	}
}

class Sparkle {
	#img = null;
	#x=0
	#y=0
	#width=9
	#height=9;
	#timer=0;
	
	#aTNow = 0;
	#aTThen = 0;
	#aTElapsed = 0;
	#fps = 60;
	#fpsInterval = 0;
	
	#deleteMe = false;
	#srcNode = null;

	constructor(srcDiv, iX, iY, appPath) {
		this.#width = this.#height = Math.floor((Math.random() * 1 + 1) * this.#height);
		this.#x = iX;
		this.#y = iY;
		this.#img = appPath + "/img/sparkle_transparent.png";
		this.#srcNode = srcDiv;
		
		this.#srcNode.style.width = this.#width+"px";
		this.#srcNode.style.height = this.#height+"px";
		this.#srcNode.style.backgroundImage = "url("+this.#img+")";
		this.#srcNode.style.backgroundAttachment = "scroll";
		this.#srcNode.style.backgroundPosition = "top left";
		this.#srcNode.style.backgroundSize = "100% 100%";
		this.#srcNode.style.imageRendering = "crisp-edges";
		this.#srcNode.style.position = "absolute";
		this.#srcNode.style.zIndex = "100";
		this.#srcNode.style.transform = "scaleX("+(this.#width/9)+") scaleY("+(this.#height/9)+")";
		this.#srcNode.style.top = this.#y+"px";
		this.#srcNode.style.left = this.#x+"px";
		this.#srcNode.style.pointerEvents = "none";
		
		this.#fpsInterval = 1000/this.#fps;
		this.#aTThen = Date.now();
		requestAnimationFrame(() => this.updateObject());
	}

	// Main logic loop for Sparkle object.
	updateObject() {
		if (!this.#deleteMe) {
			requestAnimationFrame(() => this.updateObject());
		}

		this.#aTNow = Date.now();
		this.#aTElapsed = this.#aTNow - this.#aTThen;

		if (this.#aTElapsed > this.#fpsInterval) {
			this.#aTThen = this.#aTNow - (this.#aTElapsed % this.#fpsInterval);
			
			if (this.#timer > 63) {
				this.#deleteMe = true;
			} else {
				this.#timer++;
				this.#y++;
				this.#srcNode.style.top = this.#y+"px";
				requestAnimationFrame(() => this.updateObject());
			}
		}
	}
	
	flaggedForDeletion() {
		return this.#deleteMe;
	}
	
	getSrcNode() {
		return this.#srcNode;
	}
}