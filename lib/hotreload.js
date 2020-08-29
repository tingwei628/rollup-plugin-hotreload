/**
 * load js in html on the client side
 */

/**** dynamic inject load js file path ****/
/**** NOTE: all relative file path to hotreload.js********/


function insertjs() {
  //* READ EACH JS FILE*//
  if (loadfilePath === undefined || loadfilePath === null)
    throw TypeError("loadfilePath is not defined");
  for (var i = 0; i < loadfilePath.length; i++) {
    var script = document.createElement("script");
    script.id = "rph-id" + i;
    script.src = loadfilePath[i] + "?v=" + new Date().getTime();
    script.type = "text/javascript";
    document.body.appendChild(script);
  }
}
function reloadjs() {
  for (var j = 0; j < loadfilePath.length; j++) {
	var script = document.getElementById("rph-id" + j);
    script.src = loadfilePath[j] + "?v=" + new Date().getTime();
  }
  window.location.reload();
  
}


/************USE EVENTSOURCE*****************/
insertjs();
window.___hashkey___ = "";
if (!!window.EventSource) {

  var timeout = 500; // 3s
  var source = null;
  window.___lastupdate___ = new Date();
  function createEventSource() {
    source = new EventSource('http://localhost:9999/rollup-plugin-hotreload');
    source.onmessage = function (e) {
      if (e.data && (window.___hashkey___ === "" || window.___hashkey___ !== e.data)) {
        window.___hashkey___ = e.data;
        window.___lastupdate___ = new Date();
		reloadjs();
      }
    };
  }
  try {
    createEventSource();
  } catch (err) {
    throw err;
  }
} else {
  throw new Error("Browser does not support EventSource \
  Use EventSource Polyfill instead!");
}

