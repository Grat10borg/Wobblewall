// Shorthand Dom versions
const $ = document;
const $$ = {
dom: document,

// document methods
id: $.getElementById.bind($),
class: $.getElementsByClassName.bind($),
make: $.createElement.bind($),
query: $.querySelector.bind($),
query_all: $.querySelectorAll.bind($),

// custome methods below this
wait: wait.bind($),
api: api.bind($), 
api_valid: api_valid.bind($), 

// just here to help me out when working.
log: console.log,
}

// misc function, make javascript wait
function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

// calls Twitch API to validate token returns 0 on fail 1 on success
async function api_valid() {
  if (config.MY_API_TOKEN != undefined &&
	  config.MY_API_TOKEN != "" &&
      config.MY_API_TOKEN != null) {
    await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: "Bearer " + config.MY_API_TOKEN,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.status) {
          if (resp.status == 401) {
            return 0;
          }
          return 0;
        }
        if (resp.client_id) {
          settings.api_clientid = resp.client_id;
		  settings.api_valid = true;
          return 1;
        }
        return 0;
      })
      .catch((err) => {
        $$.log(err);
        return 0;
      });
    return 1;
  } else {
    return 0;
  }
}
//#endregion

// Http request function specify Twitch if using twitch tokens
async function api(http, isTwitch) {
	console.log(http, isTwitch)
  if (isTwitch == true || isTwitch != undefined) {
    const respon = await fetch(`${http}`, {
      headers: {
        Authorization: "Bearer " + config.MY_API_TOKEN,
        "Client-ID": settings.api_clientid, // can also use Tclient_id. 
	//!! comment out Tclient if not being used !!
      },
    })
      .then((respon) => respon.json())
      .then((respon) => {
        // Return Response on Success
        return respon;
      })
      .catch((err) => {
        // Print Error if any. And return 0
        $$.log(err);
        return err;
      });
    return respon;
  } else {
    const respon = await fetch(`${http}`)
      .then((respon) => respon.json())
      .then((respon) => {
        // Return Response on Success
        return respon;
      })
      .catch((err) => {
        // Print Error if any. And return 0
        $$.log(err);
        return err;
      });
    return respon;
  }
}
