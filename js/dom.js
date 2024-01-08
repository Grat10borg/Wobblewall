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

err: err.bind($),
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

// logs and says a message 
function err(msg) {
	console.error(msg);
	ComfyJS.say(msg);
}

/*	simple API request function
 *
 *	pass request string and if it should use Twitch auth
 *	needs to be validated first
 * */
async function api(request, twitch) {
  if (settings.Tconnect == false)
	$$.api_approve();
  if (twitch == true) {
    const respon = await fetch(`${request}`, {
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
    const respon = await fetch(`${request}`)
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
        if (resp.client_id) {
          settings.client_id = resp.client_id;

          $$.log("Token Validated Sucessfully ..." + resp.message);
          return 1;
        }
        $$.err("unexpected Output ..." + resp.message);
        return 0;
      })
      .catch((err) => {
        $$.err(err);
        return 0;
      });
 return 1;
}
//#endregion
