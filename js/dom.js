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
api_approve: api_approve.bind($), // validate twitch token

log: console.log,
}

// dom functions

// misc function, make javascript wait
function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

// Http request function specify Twitch if using twitch tokens
async function api(http, isTwitch) {
  if (isTwitch == true || isTwitch != undefined) {
    const respon = await fetch(`${http}`, {
      headers: {
        Authorization: "Bearer " + config.MY_API_TOKEN,
        "Client-ID": settings.client_id, 
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

async function api_approve() {
    await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: "Bearer " + config.MY_API_TOKEN,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.status) {
          if (resp.status == 401) {
            $$.err("This api token is invalid ... " + resp.message);
            return 0;
          }
          $$.err("Unexpected output with a status");
          return 0;
        }
        if (resp) {
          settings.client_id = resp.client_id; // client ID
	  settings.broadcaster_login = resp.login; // username
	  settings.broadcaster_id = resp.user_id; // user ID
	  settings.Tconnect = true; // twitch connected.

          $$.log("Token Validated Sucessfully ... logged into "
          + resp.login);
	 
          return 1;
        }
        return 0;
      })
      .catch((err) => {
        return 0;
      });
 return 1;
}
//#endregion
