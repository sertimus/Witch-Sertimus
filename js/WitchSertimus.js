 /* @source: http://sertimus.xyz/js/WitchSertimus.js
	@licstart  The following is the entire license notice for the 
    JavaScript code in this page.
    
	Witch Sertimus - Watch them fly around the page!
	Copyright (C) 2014-2020  gameaddict30

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

/* function toPolarCoords(int inX, int inY, int cX, int xY)
	Converts any given Cartesian coordinates to its polar representation, optionally with an offset.
	Returns a Javascript Object with key-value pairs in the following format:
	{	radius: Number,
		angle: Number	} */
function toPolarCoords(inX,inY,cX,cY) {
	inOffsetX = typeof cX !== 'undefined' ? cX : 0.0;
	inOffsetY = typeof cY !== 'undefined' ? cY : 0.0;
	var subCart = {	x: inX-cX,
			y: inY-cY };
	var polar = { 	radius: Math.sqrt(subCart.x*subCart.x + subCart.y*subCart.y),
					angle:	Math.atan2(subCart.y,subCart.x) * 180.0/Math.PI };
	return polar;
}

/* function toPolarCoords(int inX, int inY, int cX, int xY)
	Converts any given polar coordinates to its Cartesian representation, optionally with an offset.
	Returns a Javascript Object with key-value pairs in the following format:
	{	x: Number,
		y: Number	} */
function toCartesianCoords (inRadius,inAngle,inOffsetX,inOffsetY) {
	inOffsetX = typeof inOffsetX !== 'undefined' ? inOffsetX : 0.0;
	inOffsetY = typeof inOffsetY !== 'undefined' ? inOffsetY : 0.0;
	var cart = {	x: inOffsetX + inRadius * Math.cos(inAngle * 2.0 * Math.PI / 360.0),
					y: inOffsetY + inRadius * Math.sin(inAngle * 2.0 * Math.PI / 360.0) };
	return cart;
}

function getPageOffset() {
	return { x: window.pageXOffset,
		 y: window.pageYOffset };
}

function Sparkle(srcDiv, iX, iY) {
	var img = null;
	var x=0,y=0,width=9,height=9;
	var timer=0;
	var objTimer = null;
	var deleteMe = false;
	var srcNode = null;

	// Main logic loop for Sparkle object.
	function updateObject() {
		if (timer > 63) {
			clearInterval(objTimer);
			deleteMe = true;
		} else {
			timer++;
			y++;
			srcDiv.style.top = y+"px";
		}
	}
	
	this.flaggedForDeletion = function() {
		return deleteMe;
	};
	
	this.getSrcNode = function() {
		return srcNode;
	};
	
	width = height = Math.floor(Math.random() * 2 + 1) * height;
	x = iX;
	y = iY;
	img = new Image();
	img.src = "./img/sparkle_transparent.png";
	srcNode = srcDiv;
	
	srcElement = srcDiv;
	srcElement.style.width = 9+"px";
	srcElement.style.height = 9+"px";
	srcElement.style.backgroundImage = "url("+img.src+")";
	srcElement.style.backgroundAttachment = "scroll";
	srcElement.style.backgroundPosition = "top left";
	srcElement.style.imageRendering = "crisp-edges";
	srcElement.style.position = "absolute";
	srcElement.style.zIndex = "100";
	srcElement.style.transform = "scaleX("+(width/9)+") scaleY("+(height/9)+")";
	srcElement.style.top = y+"px";
	srcElement.style.left = x+"px";
	srcElement.style.pointerEvents = "none";
	
	objTimer = setInterval(function(){updateObject();}, 16);
}

function WitchSertimus(srcDiv) {
	var img = null;
	var srcElement = null;
	var x = 0, y = 0, offsetY = 0, speed = 0, width = 116, height = 116, mX = 0, mY = 0;
	var animationTimer = 0;

	var sparkleList = [];
	var sparkleTimer = null;

	// The main logic loop for Witch Sertimus. Hee hee hee!
	function updateObject() {
		speed = 0.03 * Math.sqrt(Math.pow(mX - x, 2) + Math.pow(mY - y, 2));

		if (animationTimer % 16 == 0) {
			if (offsetY > 32)
				offsetY = offsetY * -1;
			offsetY += 4;
			animationTimer = 0;
		}

		var position = toPolarCoords(mX, mY, x, y);
		position.radius = speed;
		position = toCartesianCoords(position.radius, position.angle, 0, 0);
		x = x + position.x;
		y = y + position.y;

		if (x >= mX) {
			srcElement.style.transform = "scaleX(1)";
			srcElement.style.filter = "";
		} else {
			srcElement.style.transform = "scaleX(-1)";
			srcElement.style.filter = "FlipH";
		}

		srcElement.style.left = (x - 58) + "px";
		srcElement.style.top = (y + Math.abs(offsetY) - 58) + "px";

		manageSparkles();
		animationTimer++;
	};

	// Create trailing sparkles.
	function createSparkle() {
		var node = document.createElement("div");
		sparkleList.push(new Sparkle(document.body.appendChild(node), (mX < x ? x + width + 10 - 58 : x - 10 - 58), y + height - 58));
	}

	// Maintain our array of sparkles. Delete any expired ones too.
	function manageSparkles() {
		for (var i = 0; i < sparkleList.length; i++) {
			if (sparkleList[i].flaggedForDeletion()) {
				sparkleList[i].getSrcNode().parentNode.removeChild(sparkleList[i].getSrcNode());
				sparkleList[i] = null;
				for (var j = i; j < sparkleList.length - 1; j++) {
					var temp = sparkleList[j];
					sparkleList[j] = sparkleList[j + 1];
					sparkleList[j + 1] = temp;
				}
				sparkleList.length--;
			}
		}
	}

	// Clear the list of sparkles and remove them from the DOM.
	function clearSparkles() {
		while(sparkleList.length != 0) {
			e = sparkleList.pop();
			e.getSrcNode().parentNode.removeChild(e.getSrcNode());
		}
	}

	// Witch Sertimus mouse move event handler.
	function handleMouseEvent(e) {
		e = e || window.event;
		mX = e.clientX + getPageOffset().x;
		mY = e.clientY + getPageOffset().y;
	}

	// Start and initialize Sertimus.
	this.startWitchSertimus = function () {
		if (img === null) {
			img = new Image();
			img.src = "./img/witchsert200pctransparent.png";
        }

		if (srcElement === null) {
			srcElement = srcDiv;
			srcElement.style.width = width + "px";
			srcElement.style.height = height + "px";
			srcElement.style.backgroundImage = "url(" + img.src + ")";
			srcElement.style.backgroundAttachment = "scroll";
			srcElement.style.backgroundPosition = "top left";
			srcElement.style.position = "absolute";
			srcElement.style.zIndex = "99";
			srcElement.style.pointerEvents = "none";
			srcElement.style.visibility = "hidden";
		}

		objTimer = setInterval(updateObject, 16);
		sparkleTimer = setInterval(function () { if (speed >= 2) createSparkle(); }, 60);
		document.documentElement.addEventListener("mousemove", handleMouseEvent);
		srcElement.style.visibility = "visible";
	};

	// Stop Sertimus.
	this.stopWitchSertimus = function () {
		clearInterval(objTimer);
		clearInterval(sparkleTimer);
		clearSparkles();
		document.documentElement.removeEventListener("mousemove", handleMouseEvent);
		srcElement.style.visibility = "hidden";
	};
}

// Public method to start the WitchSertimus script.
WitchSertimus.prototype.start = function () {
	this.startWitchSertimus();
};

// Public method to stop the WitchSertimus script.
WitchSertimus.prototype.stop = function () {
	this.stopWitchSertimus();
};