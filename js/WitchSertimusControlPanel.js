/* Note: MUST be used in conjunction with the full WitchSertimus.js
 * script, otherwise this script will not work as intended. */

/* function parseBoolean(string str)
 * Applies lowercase, strips whitespace and attempts to parse the string into a boolean value.
 * Returns:
 * true if the modified string reads 'true'
 * false if the modified string reads 'false'
 * -1 if the parameter type is incorrect or if the function
 * failed to parse the string. */
var floatingObj = null;
var enabled = null;
var targetElement = null;

function parseBoolean(str) {
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
function checkCookie() {
	var cookies = document.cookie;

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
				return parseBoolean(kVP[1]);
			}
        }
	}

	return -1;
}

/* function setCookie(boolean enableSetting)
 * Saves user setting to browser cookies. */
function setCookie(enableSetting) {
	if (typeof enableSetting != 'boolean') {
		return;
	}

	// Constant. Sets the expiry date for the user setting cookie. Leave an empty string for no expiration date.
	var expDate = "Sun, Nov 1 2020 00:00:00 EST";

	var sertEnabled = enableSetting.toString();
	document.cookie = "WitchSertimusEnabled=" + sertEnabled + (expDate !== "" ? "; expires=" + expDate + ";" : ";") + " path=/; SameSite=Lax";
}

function clearCookie() {
	document.cookie = "WitchSertimusEnabled=true; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
}

/* function testCookie()
 * Function which tests to see if the script can access and set browser cookies.
 * Returns true if successful. False if otherwise.*/
function testCookie() {
	var pass = false;
	document.cookie = "WitchSertimusCookieTest=1; path=/; SameSite=Lax";

	cookies = document.cookie;

	if (cookies.length == 0) {
		return false;
	} else {
		var cookieArray = cookies.split(";");

		for (var i = 0; i < cookieArray.length; i++) {
			var c = cookieArray[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf("WitchSertimusCookieTest=") == 0) {
				pass = true;
				document.cookie = "WitchSertimusCookieTest=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
			}
		}
	}

	return pass;
}

function clickEventHandler(e) {
	enabled = !enabled;
	setCookie(enabled);

	if (enabled) {
		floatingObj.start();
	} else {
		floatingObj.stop();
	}

	targetElement.innerHTML = "Click here to " + (enabled ? "DISABLE" : "ENABLE") + " the Witch Sertimus script!";
}

/* function init(string eventTargetID)
 * Initializes the control panel script, making the passed element ID
 * the target of an onclick event which toggles the WitchSertimus script.
 * */
function init(eventTargetID) {
	if (testCookie()) {
		enabled = checkCookie();

		if (enabled === -1 || enabled == null) {
			enabled = true;
		}

		floatingObj = new WitchSertimus(document.getElementById("ooospooky"));

		if (enabled) {
			floatingObj.start();
		}

		targetElement = document.getElementById(eventTargetID.toString());
		targetElement.addEventListener("click", clickEventHandler);
		targetElement.innerHTML = "Click here to " + (enabled ? "DISABLE" : "ENABLE") + " the Witch Sertimus script!";
	} else {
		targetElement = document.getElementById(eventTargetID.toString());
		targetElement.innerHTML = "Witch Sertimus would be seen here but cookies are disabled! They're needed to enable and disable this feature.";
    }
}