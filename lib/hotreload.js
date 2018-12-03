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
    script.src = loadfilePath[i];
    script.type = "text/javascript";
    document.body.appendChild(script);
  }
}
function reloadjs() {
  var scripts = [];
  for (var j = 0; j < loadfilePath.length; j++) {
    scripts = scripts.concat(document.getElementById("rph-id" + j));
  }
  if (scripts) {
    for (var k = 0; k < scripts.length; k++) {
      document.body.removeChild(scripts[k]);
    }
    insertjs();
  }
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
        reloadjs();
        window.___hashkey___ = e.data;
        window.___lastupdate___ = new Date();
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

