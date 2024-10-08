﻿ /* @licstart  The following is the entire license notice for the 
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

/* Note: MUST be used in conjunction with the full WitchSertimus.js
 * script, otherwise this script will not work as intended. */

class WitchSertimusControlPanel {
	#floatingObj = null;
	#enabled = null;
	#targetElement = null;

	constructor(targetElement, targetControllerElement, scriptPath) {
		this.#targetElement = targetControllerElement;

		if (WitchSertimusControlPanel.testCookie()) {
			this.#enabled = WitchSertimusControlPanel.checkCookie();
	
			if (this.#enabled === -1 || this.#enabled == null) {
				this.#enabled = true;
			}
			
			this.#floatingObj = new WitchSertimus(targetElement, scriptPath);

			if (this.#enabled) {
				this.#floatingObj.start();
			}
	
			this.#targetElement.addEventListener("click", (e) => this.clickEventHandler(e));
			this.#targetElement.innerHTML = "Click here to " + (this.#enabled ? "DISABLE" : "ENABLE") + " the Witch Sertimus script!";
		} else {
			this.#targetElement.innerHTML = "Witch Sertimus would be seen here but cookies are disabled! They're needed to enable and disable this feature.";
		}
	}

	/* parseBoolean(string str)
	* Applies lowercase, strips whitespace and attempts to parse the string into a boolean value.
	* Returns:
	* true if the modified string reads 'true'
	* false if the modified string reads 'false'
	* -1 if the parameter type is incorrect or if the function
	* failed to parse the string. */
	static parseBoolean(str) {
		if (typeof str != "string") {
			return -1;
		}
	
		var strCmp = str.trim().toLowerCase();
	
		switch (strCmp) {
			case "true":
				return true;
			case "false":
				return false;
			default:
				return -1;
		}
	}

	/* function checkCookie()
	* Retrieves cookie for the the WitchSertimus script and checks the status of the user setting.
	* Returns:
	* true if the WitchSertimus script is enabled by the user.
	* false if the WitchSertimus script is disabled by the user.
	* -1 if the cookie does not exist or if the function has failed
	* to convert the value of the cookie to boolean. */
	static checkCookie() {
		let cookies = document.cookie;

		if (cookies.length == 0) {
			return -1;
		} else {
			var cookieArray = cookies.split(";");
	
			for (var i = 0; i < cookieArray.length; i++) {
				var c = cookieArray[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf("WitchSertimusEnabled=") == 0) {
					var kVP = c.trim().split("=");
					return WitchSertimusControlPanel.parseBoolean(kVP[1]);
				}
			}
		}
	
		return -1;
	}

	/* function setCookie(boolean enableSetting)
 	* Saves user setting to browser cookies. */
	static setCookie(enableSetting) {
		if (typeof enableSetting != 'boolean') {
			return;
		}
	
		// Constant. Sets the expiry date for the user setting cookie. Leave an empty string for no expiration date.
		var expDate = "Sun, Nov 1 2020 00:00:00 EST";
	
		var sertEnabled = enableSetting.toString();
		document.cookie = "WitchSertimusEnabled=" + sertEnabled + (expDate !== "" ? "; expires=" + expDate + ";" : ";") + " SameSite=Lax";
	}

	static clearCookie() {
		document.cookie = "WitchSertimusEnabled=true; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
	}

	/* function testCookie()
	* Function which tests to see if the script can access and set browser cookies.
	* Returns true if successful. False if otherwise.*/
	static testCookie() {
		let pass = false;
		document.cookie = "WitchSertimusCookieTest=1; SameSite=Lax";
	
		let cookies = document.cookie;
	
		if (cookies.length == 0) {
			return false;
		} else {
			let cookieArray = cookies.split(";");
	
			for (var i = 0; i < cookieArray.length; i++) {
				let c = cookieArray[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf("WitchSertimusCookieTest=") == 0) {
					pass = true;
					document.cookie = "WitchSertimusCookieTest=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
				}
			}
		}
	
		return pass;
	}

	clickEventHandler(e) {
		this.#enabled = !this.#enabled;
		WitchSertimusControlPanel.setCookie(this.#enabled);
	
		if (this.#enabled) {
			this.#floatingObj.start();
		} else {
			this.#floatingObj.stop();
		}
	
		this.#targetElement.innerHTML = "Click here to " + (this.#enabled ? "DISABLE" : "ENABLE") + " the Witch Sertimus script!";
	}
}