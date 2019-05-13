"use strict";

var API_ENDPOINT = "https://api.maelstrom.network/";
const store = {
  state: {},

  setState(a, b) {
    if (b === undefined) {
      this.state = a;
      this.setters.forEach(setter => setter(this.state));
    } else {
      this.state[a] = b;
      this.setters.forEach(setter => setter(this.state));
    }
  },

  setters: []
};
store.setState = store.setState.bind(store);

function useStore() {
  const [state, set] = React.useState(store.state);

  if (!store.setters.includes(set)) {
    store.setters.push(set);
  }

  React.useEffect(() => () => {
    store.setters = store.setters.filter(setter => setter !== set);
  }, []);
  return [state, store.setState];
}

window.walletAccount = new nearlib.WalletAccount("transcode.zod.tv", "https://wallet.nearprotocol.com");
console.log("signed in?", window.walletAccount.isSignedIn());
store.state = {
  navbar_burger: false,
  tab_view_tab: "create_job",
  tab_view_output_selected: 0,
  cj_source: "s3://ApIKeYaa34a5:ApIPassOrSecret@sys.wasabi.com/myOriginals/myVideo.mp4",
  cj_outputs: [{
    target: "s3://APIKey:APISec@sys.wasabi.com/myVideo/myVideo-1080p.mp4",
    codec: "h264",
    bitrate: 4.5,
    width: -1,
    height: 720,
    audio: "copy",
    audio_codec: "aac",
    audio_bitrate: 256,
    offset: "00:00:00",
    duration: ""
  }],
  cj_json: "",
  help_modal_open: false,
  help_modal_title: "Unknown",
  help_modal_body: ["Unknown help, something wrong?"],
  privkey_modal_open: false,
  privkey_modal_submit_loading: false,
  privKey_base58: "44zsbWT9Xk1RjJysfZaZ1qF8CpGQQ8yLP8Xk4ydqZ6GdGfiHPm5u7VbiUZRSiPkWwQAjJWpebcQZ1V58PTbPnHt3",
  //zod_tv3
  zod_pubKey_base58: "9yfgNakMJNAcLumq6tmT3JkX9P4rNFmWf7zaLG3jLXpc",
  //transcode.zod.tv
  job_table: [],
  job_button_loading: false,
  j_job_acc: "zod.near",
  j_job_id: "1",
  wallet_signed_in: window.walletAccount.isSignedIn(),
  wallet_account_name: window.walletAccount.getAccountId()
};

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function post_promise(method, json) {
  if (typeof json === 'object' && json !== null) {
    json = JSON.stringify(json);
  }

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (this.getResponseHeader('content-type') == "application/json") {
            resolve(JSON.parse(xhr.response));
          } else {
            resolve(xhr.response);
          }
        } else {
          reject(xhr.status);
        }
      }
    };

    xhr.ontimeout = function () {
      reject('timeout');
    };

    xhr.withCredentials = true;
    xhr.open('POST', API_ENDPOINT + method);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json);
  });
}

function p_add_output() {
  var cj_outputs = [...store.state.cj_outputs];
  var new_output = {
    target: "",
    codec: "h264",
    bitrate: 4.5,
    width: -1,
    height: 720,
    audio: "copy",
    audio_codec: "aac",
    audio_bitrate: 256,
    offset: "00:00:00",
    duration: ""
  };
  cj_outputs.push(new_output);
  store.setState("cj_outputs", cj_outputs);
}

function p_delete_output(idx) {
  var cj_outputs = [...store.state.cj_outputs];
  cj_outputs.splice(idx, 1);
  store.setState("cj_outputs", cj_outputs);

  if (store.state.tab_view_output_selected > cj_outputs.length - 1) {
    store.setState("tab_view_output_selected", cj_outputs.length - 1);
  }
}

function p_update_output(idx, key, value) {
  var cj_outputs = [...store.state.cj_outputs];
  var output = cj_outputs[idx];
  output[key] = value;
  store.setState("cj_outputs", cj_outputs);
}

function p_open_help(title) {
  var body = [""];

  switch (title) {
    case "Target":
    case "Source":
      body = ["Your source or target is the full path to the location of the file, currently HTTP, HTTPS and S3 are supported.", "", "<protocol>://<api_key>:<api_pass>@<bucket_host>/<bucket_path>", "", "protocol: http | https | ftp | ftps | sftp | s3", "api_key: API Key to access things like S3 and FTP", "api_pass: API Password/Secret to access things like S3 and FTP", "bucket_host: The domain of your provider", "bucket_path: The full path to the file in the bucket", "", "Press the Check button to troubleshoot your configuration and see if the file can be accessed"];
      break;

    case "Codec":
      body = ["The video codec to use for the output.", "", "Supported: h264 | hevc", "Coming Soon: vp9 av1"];
      break;

    case "Bitrate":
      body = ["The video bitrate in MegaBits Per Second to use for the output."];
      break;

    case "Height":
    case "Width":
      body = ["The video output width and height. If you want to automatically set it, use -1.", "", "Example to downscale to 240p keeping aspect ratio. Width: -1 Height: 240"];
      break;

    case "Offset":
      body = ["The video offset is where to start cutting the video from for this output.", "The offset is automatically adjusted to the nearest keyframe to prevent a black output.", "", "The format must be <hour>:<minute>:<second>", "", "Example: 00:05:00 start the video on the nearest keyframe to the 5th minute"];
      break;

    case "Duration":
      body = ["The video duration is for how long to cut the video for", "", "The format must be <hour>:<minute>:<second>", "", "Example: Offset: 00:05:00 Duration: 00:01:00", "Cut 1 minute of video after the 5th minute"];
      break;

    case "Audio":
      body = ["What to do with the audio from the source video.", "", "Copy: Copy the source audio to the output, without touching it", "NoAudio: Remove the audio completely from the output", "Custom: Set a custom codec and bitrate to down/up sample the audio"];
      break;

    case "Audio Codec":
      body = ["Which audio codec to use", "", "Supported: aac", "Coming Soon: opus"];
      break;

    case "Audio Bitrate":
      body = ["Audio bitrate for the output in KiloBits Per Second", "", "Recommended 128kbps, 192kbps or 256kbps. ITunes uses 256kbps."];
      break;

    case "Private Key":
      body = ["The private key for your address in base58 format. Gotten from your wallet but currently NEAR Wallets are not ready.", "", "There is a default private key already entered for debug purposes.  Note that if you use this key, " + "your job is as good as plain text on the blockchain and anyone can steal your API keys for S3/FTP/etc."];
      break;

    case "Job Json":
      body = ["This is how your job looks before being encrypted. Only you can see this (and drone for now..)."];
      break;

    case "Job Encrypted":
      body = ["This is how your job looks after encryption. Everyone can see this.", ""];
      break;

    case "By Job Id":
      body = ["Find a single Job by Id. The Id is an incremental number.", ""];
      break;

    case "By Near Account Name":
      body = ["Find all jobs belonging to a NEAR account. Your Near Account name is a string.", ""];
      break;

    default:
      body = ["Unknown text, something wrong?"];
      break;
  }

  store.setState("help_modal_title", title);
  store.setState("help_modal_body", body);
  store.setState("help_modal_open", true);
}

function p_getSharedSecret(private_key_base58) {
  var privKey_ed25519_bin;

  try {
    privKey_ed25519_bin = Base58.decode(private_key_base58);
  } catch (e) {
    store.setState("privKey_error", "Failed to decode base58");
    return;
  }

  var privKey_Curve25519_bin;

  try {
    privKey_Curve25519_bin = ed2curve.convertSecretKey(privKey_ed25519_bin); //var res = nacl.sign.keyPair.fromSecretKey(binKey);
    //publicKey = res.publicKey;
    //secretKey = res.secretKey;
  } catch (e) {
    store.setState("privKey_error", "Failed to convert ed25519 to Curve25519");
    return;
  }

  var zod_pubKey_Curve25519 = ed2curve.convertPublicKey(Base58.decode(store.state.zod_pubKey_base58));
  var shared_secret = nacl.box.before(zod_pubKey_Curve25519, privKey_Curve25519_bin);
  return shared_secret;
}

function p_encryptSharedBox(message, private_key_base58) {
  var shared_secret = p_getSharedSecret(private_key_base58);
  var nonce = newNonce();
  var message = store.state.cj_json;
  var boxed = nacl.box.after(new TextEncoder().encode(message), nonce, shared_secret);
  return {
    boxed_base58: Base58.encode(boxed),
    nonce_base58: Base58.encode(nonce)
  };
}

function p_decryptSharedBox(boxed_base58, nonce_base58, private_key_base58) {
  var shared_secret = p_getSharedSecret(private_key_base58);
  var nonce = Base58.decode(nonce_base58);
  var boxed = Base58.decode(boxed_base58);
  var unboxed = nacl.box.open.after(boxed, nonce, shared_secret);
  var text = new TextDecoder().decode(unboxed);
  return text;
}

function p_submitJob() {
  var job = {
    source: store.state.cj_source,
    outputs: store.state.cj_outputs
  };
  var json = JSON.stringify(job);
  store.setState("cj_json", json);
  let {
    boxed_base58,
    nonce_base58
  } = p_encryptSharedBox(json, store.state.privKey_base58);
  store.setState("boxed_base58", boxed_base58);
  store.setState("nonce_base58", nonce_base58);
  store.setState("privkey_modal_open", true); //var encrypted = encrypt_shared_box(json, my_pubkey, my_privkey, );
}

async function p_insertJob() {
  store.setState("privkey_modal_submit_loading", true);
  await jobInsert(store.state.boxed_base58, store.state.nonce_base58);
  store.setState("privkey_modal_submit_loading", false);
}

async function p_getJobById() {
  store.setState("job_button_loading", true);
  var job = await getJob(store.state.j_job_id);

  if (job == null) {
    store.setState("job_table", []);
  } else {
    store.setState("job_table", [job]);
  }

  store.setState("job_button_loading", false);
}

async function p_getAllJobs() {
  store.setState("job_button_loading", true);
  var jobs = await getJobs();
  store.setState("job_table", jobs);
  store.setState("job_button_loading", false);
}

async function p_getJobsByNearAccount() {
  store.setState("job_button_loading", true);
  var jobs = await getJobs();
  jobs = jobs.filter(v => v.owner == store.state.j_job_acc);
  store.setState("job_table", jobs);
  store.setState("job_button_loading", false);
}

function p_near_signin() {
  window.walletAccount.requestSignIn("transcode.zod.tv", "Zod.TV - Transcode", location.href, location.href);
}

function p_near_signout() {
  window.walletAccount.signOut();
  store.setState("wallet_signed_in", false);
  store.setState("wallet_account_name", "");
  window.history.replaceState({}, document.title, location.pathname);
}

function MainPicker() {
  const [s, setState] = useStore();
  return React.createElement("section", {
    className: "container",
    style: {
      padding: "10px",
      marginBottom: "20px",
      marginTop: "10px"
    }
  }, React.createElement("div", {
    className: "card"
  }, React.createElement("header", {
    className: "card-header"
  }, React.createElement("div", {
    className: "tabs is-boxed"
  }, React.createElement("ul", null, React.createElement("li", {
    className: s.tab_view_tab == "create_job" ? "is-active" : "",
    onClick: () => setState("tab_view_tab", "create_job")
  }, React.createElement("a", null, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "fas fa-image",
    "aria-hidden": "true"
  })), React.createElement("span", null, "Create Job"))), React.createElement("li", {
    className: s.tab_view_tab == "jobs" ? "is-active" : "",
    onClick: () => setState("tab_view_tab", "jobs")
  }, React.createElement("a", null, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "fas fa-film",
    "aria-hidden": "true"
  })), React.createElement("span", null, "Jobs"))), React.createElement("li", {
    className: s.tab_view_tab == "help" ? "is-active" : "",
    onClick: () => setState("tab_view_tab", "help")
  }, React.createElement("a", null, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "far fa-file-alt",
    "aria-hidden": "true"
  })), React.createElement("span", null, "Help")))))), s.tab_view_tab == "create_job" && React.createElement(CreateJob, null), s.tab_view_tab == "jobs" && React.createElement(Jobs, null), s.tab_view_tab == "help" && React.createElement(Help, null)));
}

function CreateJob() {
  const [s, setState] = useStore();
  return [React.createElement("div", {
    key: "create_job",
    className: "card-content"
  }, React.createElement("div", {
    className: "content"
  }, React.createElement("div", {
    className: "field"
  }, "Source ", React.createElement("a", {
    onClick: () => p_open_help("Source")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field has-addons"
  }, React.createElement("div", {
    className: "control is-expanded"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: s.cj_source,
    onChange: e => setState("cj_source", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))), React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button"
  }, "Check"))))), "Outputs", React.createElement(CreateJobOutputs, null))), React.createElement("footer", {
    key: "footer_create_job",
    className: "card-footer"
  }, s.wallet_signed_in && React.createElement("a", {
    href: "#",
    className: "card-footer-item",
    onClick: () => p_submitJob()
  }, "Submit"), s.wallet_signed_in == false && React.createElement("a", {
    className: "card-footer-item"
  }, "Submit (You must sign in)"))];
}

function CreateJobOutputs() {
  const [s, setState] = useStore();
  let o_idx = s.tab_view_output_selected;
  let o = s.cj_outputs[o_idx];
  return React.createElement("div", {
    className: "card"
  }, React.createElement("header", {
    className: "card-header"
  }, React.createElement("div", {
    className: "tabs is-boxed"
  }, React.createElement("ul", {
    style: {
      marginLeft: "0em",
      marginTop: "0em"
    }
  }, s.cj_outputs.map((item, idx) => React.createElement("li", {
    key: idx,
    className: s.tab_view_output_selected == idx ? "is-active" : "",
    onClick: () => setState("tab_view_output_selected", idx)
  }, React.createElement("a", null, idx == 0 && React.createElement("span", null, "Output " + (idx + 1)), idx > 0 && React.createElement("div", null, React.createElement("span", null, "Output " + (idx + 1)), React.createElement("span", null, " \xA0\xA0\xA0 ", React.createElement("i", {
    className: "fas fa-trash-alt",
    onClick: e => {
      e.stopPropagation();
      p_delete_output(idx);
    }
  })))))), React.createElement("li", null, React.createElement("a", {
    onClick: () => p_add_output()
  }, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "far fa-plus-square",
    "aria-hidden": "true"
  }))))))), React.createElement("div", {
    className: "card-content",
    style: {
      padding: "0.25em"
    }
  }, React.createElement("div", {
    className: "content"
  }, React.createElement("div", {
    className: "field"
  }, "Target ", React.createElement("a", {
    onClick: () => p_open_help("Target")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field has-addons"
  }, React.createElement("div", {
    className: "control is-expanded"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.target,
    onChange: e => p_update_output(o_idx, "target", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))), React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button"
  }, "Check"))))), React.createElement("div", {
    className: "columns"
  }, React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Codec ", React.createElement("a", {
    onClick: () => p_open_help("Codec")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "select is-fullwidth"
  }, React.createElement("select", {
    value: o.codec,
    onChange: e => p_update_output(o_idx, "codec", e.target.value)
  }, React.createElement("option", {
    value: "h264"
  }, "h264"), React.createElement("option", {
    value: "hevc"
  }, "hevc")))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Bitrate ", React.createElement("a", {
    onClick: () => p_open_help("Bitrate")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow has-addons"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.bitrate,
    onChange: e => p_update_output(o_idx, "bitrate", e.target.value)
  }))), React.createElement("div", {
    className: "control"
  }, React.createElement("a", {
    className: "button is-static"
  }, "MBPS")))))), React.createElement("div", {
    className: "column"
  }), React.createElement("div", {
    className: "column"
  })), React.createElement("div", {
    className: "columns"
  }, React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Width ", React.createElement("a", {
    onClick: () => p_open_help("Width")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.width,
    onChange: e => p_update_output(o_idx, "width", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Height ", React.createElement("a", {
    onClick: () => p_open_help("Height")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.height,
    onChange: e => p_update_output(o_idx, "height", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Offset ", React.createElement("a", {
    onClick: () => p_open_help("Offset")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.offset,
    onChange: e => p_update_output(o_idx, "offset", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Duration ", React.createElement("a", {
    onClick: () => p_open_help("Duration")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.duration,
    onChange: e => p_update_output(o_idx, "duration", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  }))))))))), React.createElement("div", {
    className: "columns"
  }, React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Audio ", React.createElement("a", {
    onClick: () => p_open_help("Audio")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "select is-fullwidth"
  }, React.createElement("select", {
    value: o.audio,
    onChange: e => p_update_output(o_idx, "audio", e.target.value)
  }, React.createElement("option", {
    value: "copy"
  }, "Copy"), React.createElement("option", {
    value: "noaudio"
  }, "NoAudio"), React.createElement("option", {
    value: "custom"
  }, "Custom")))))))), React.createElement("div", {
    className: "column"
  }, o.audio == "custom" && React.createElement("div", {
    className: "field"
  }, "Audio Codec ", React.createElement("a", {
    onClick: () => p_open_help("Audio Codec")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "select is-fullwidth"
  }, React.createElement("select", {
    value: o.audio_codec,
    onChange: e => p_update_output(o_idx, "audio_codec", e.target.value)
  }, React.createElement("option", {
    value: "aac"
  }, "aac")))))))), React.createElement("div", {
    className: "column"
  }, o.audio == "custom" && React.createElement("div", {
    className: "field"
  }, "Audio Bitrate ", React.createElement("a", {
    onClick: () => p_open_help("Audio Bitrate")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow has-addons"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: o.audio_bitrate,
    onChange: e => p_update_output(o_idx, "audio_bitrate", e.target.value)
  }))), React.createElement("div", {
    className: "control"
  }, React.createElement("a", {
    className: "button is-static"
  }, "KBPS")))))), React.createElement("div", {
    className: "column"
  })))));
}

function Jobs() {
  const [s, setState] = useStore();
  return React.createElement("div", {
    className: "card-content"
  }, React.createElement("div", {
    className: "content"
  }, React.createElement("div", {
    className: "columns"
  }, React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "By Job Id ", React.createElement("a", {
    onClick: () => p_open_help("By Job Id")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow has-addons"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: s.j_job_id,
    onChange: e => setState("j_job_id", e.target.value)
  }))), React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button " + (s.job_button_loading ? "is-loading" : ""),
    onClick: () => p_getJobById()
  }, "Search")))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "By Near Account Name ", React.createElement("a", {
    onClick: () => p_open_help("By Near Account Name")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow has-addons"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control has-icons-right"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: s.j_job_acc,
    onChange: e => setState("j_job_acc", e.target.value)
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))), React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button " + (s.job_button_loading ? "is-loading" : ""),
    onClick: () => p_getJobsByNearAccount()
  }, "Search")))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "All Jobs", React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field is-narrow has-addons"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button " + (s.job_button_loading ? "is-loading" : ""),
    onClick: () => p_getAllJobs()
  }, "Search"))))))), "Jobs", React.createElement("table", {
    className: "table is-bordered"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Id"), React.createElement("th", null, "Requester"), React.createElement("th", null, "Drone"), React.createElement("th", null, "Status"), React.createElement("th", null, "Error Code"), React.createElement("th", null, "Error Text"))), React.createElement("tbody", null, s.job_table.map((item, idx) => React.createElement("tr", {
    key: item.id
  }, React.createElement("th", null, item.id), React.createElement("td", null, item.owner), React.createElement("td", null, item.drone), React.createElement("td", null, item.drone == null ? "Queued" : item.done == true ? "Done" : "Working"), React.createElement("td", null, item.error_code), React.createElement("td", null, item.error_text)))))));
}

function Help() {
  const [s, setState] = useStore();
  return React.createElement("div", {
    className: "card-content"
  }, React.createElement("div", {
    className: "content"
  }, React.createElement("p", null, "Video Transcoding is the process of turning high quality (4k) video into lower resolutions / codecs so all devices and internet connections can play it."), React.createElement("p", null, "Globally, Video traffic will be 82 percent of all IP traffic by 2022. ", React.createElement("a", {
    href: "https://www.cisco.com/c/en/us/solutions/collateral/service-provider/visual-networking-index-vni/white-paper-c11-741490.html",
    target: "_blank"
  }, "Link")), React.createElement("p", null, "Zod.TV Transcoder is two part, consumers and providers.  Consumers need videos transcoded.  Providers do the transcoding."), React.createElement("p", null, "Due to advances in applied cryptography, providers will use a technology similar to what dFinity is using.  This protects your secrets, like your API Keys for S3 cloud storage from the provider, even if the provider has physical access and root to the machine your job is running on."), React.createElement("p", null, "Your secrets are safe, but the work gets done. Welcome to the new age of decentralization, bid 'The Cloud' farewell!")));
}

function HelpModal() {
  const [s, setState] = useStore();
  return React.createElement("div", {
    className: "modal " + (s.help_modal_open ? "is-active" : ""),
    style: {
      zIndex: 100
    }
  }, React.createElement("div", {
    className: "modal-background",
    onClick: () => setState("help_modal_open", false)
  }), React.createElement("div", {
    className: "modal-card"
  }, React.createElement("header", {
    className: "modal-card-head"
  }, React.createElement("p", {
    className: "modal-card-title"
  }, s.help_modal_title), React.createElement("button", {
    className: "delete",
    "aria-label": "close",
    onClick: () => setState("help_modal_open", false)
  })), React.createElement("section", {
    className: "modal-card-body"
  }, s.help_modal_body.map((item, idx) => item == "" ? React.createElement("br", {
    key: idx
  }) : React.createElement("p", {
    key: idx
  }, item))), React.createElement("footer", null)));
}

function PrivKeyModal() {
  const [s, setState] = useStore();
  return React.createElement("div", {
    className: "modal " + (s.privkey_modal_open ? "is-active" : "")
  }, React.createElement("div", {
    className: "modal-background",
    onClick: () => setState("privkey_modal_open", false)
  }), React.createElement("div", {
    className: "modal-card"
  }, React.createElement("header", {
    className: "modal-card-head"
  }, React.createElement("p", {
    className: "modal-card-title"
  }, "Confirm Submission"), React.createElement("button", {
    className: "delete",
    "aria-label": "close",
    onClick: () => setState("privkey_modal_open", false)
  })), React.createElement("section", {
    className: "modal-card-body"
  }, React.createElement("div", {
    className: "field"
  }, "Your Private Key ", React.createElement("a", {
    onClick: () => p_open_help("Private Key")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("div", {
    className: "field-body"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("div", {
    className: "control"
  }, React.createElement("div", {
    className: "control is-fullwidth"
  }, React.createElement("input", {
    className: "input",
    type: "text",
    value: s.privKey_base58,
    onChange: e => setState("privKey_base58", e.target.value)
  })))))), React.createElement("div", {
    className: "field"
  }, "Your Private Job ", React.createElement("a", {
    onClick: () => p_open_help("Job Json")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("textarea", {
    className: "textarea",
    value: s.cj_json,
    rows: "6",
    style: {
      resize: "none",
      backgroundColor: "#eff0f1",
      overflow: "auto"
    },
    readOnly: true
  })), React.createElement("div", {
    className: "field"
  }, "Your Public Encrypted Job Blob ", React.createElement("a", {
    onClick: () => p_open_help("Job Encrypted")
  }, React.createElement("i", {
    className: "far fa-question-circle",
    "aria-hidden": "true"
  })), React.createElement("textarea", {
    className: "textarea",
    value: s.boxed_base58,
    style: {
      resize: "none",
      backgroundColor: "#eff0f1",
      overflow: "auto"
    },
    readOnly: true
  }))), React.createElement("footer", {
    className: "modal-card-foot"
  }, React.createElement("button", {
    className: "button is-error",
    onClick: () => setState("privkey_modal_open", false)
  }, "Cancel"), React.createElement("button", {
    className: "button " + (s.privkey_modal_submit_loading ? "is-loading" : ""),
    onClick: () => p_insertJob()
  }, "Submit"))));
}

function NavBar() {
  const [s, setState] = useStore();
  return React.createElement("div", null, React.createElement("div", null, React.createElement("nav", {
    className: "navbar"
  }), React.createElement("nav", {
    className: "navbar is-transparent is-fixed-top has-shadow",
    style: {
      boxShadow: "rgba(10, 10, 10, 0.1) 0px 2px 3px"
    }
  }, React.createElement("div", {
    className: "navbar-brand"
  }, React.createElement("span", {
    className: "navbar-item"
  }, React.createElement("img", {
    src: "https://cdn.shopify.com/s/files/1/2312/7883/products/19-1_1400x.png?v=1539110648",
    alt: "Description",
    style: {
      cursor: "pointer"
    }
  }), React.createElement("span", {
    style: {
      cursor: "default"
    }
  }, "\xA0\xA0ZODTV - TRANSCODE")), React.createElement("button", {
    className: "button navbar-burger "
  })), React.createElement("div", {
    className: "navbar-menu "
  }, React.createElement("div", {
    className: "navbar-start"
  }), React.createElement("div", {
    className: "navbar-end"
  }, s.wallet_signed_in == false && React.createElement("div", {
    className: "navbar-item"
  }, React.createElement("div", {
    className: "field is-grouped"
  }, React.createElement("p", {
    className: "control"
  }, React.createElement("a", {
    className: "button",
    href: "#",
    onClick: () => p_near_signin()
  }, React.createElement("span", {
    className: "icon"
  }, React.createElement("i", {
    className: "fas fa-link"
  })), React.createElement("span", null, "Login with NEAR"))))), s.wallet_signed_in == true && [React.createElement("div", {
    key: "1",
    className: "navbar-item has-dropdown is-hoverable"
  }, React.createElement("a", {
    className: "navbar-item"
  }, s.wallet_account_name), " "), React.createElement("div", {
    key: "2",
    className: "navbar-item"
  }, React.createElement("div", {
    className: "field is-grouped"
  }, React.createElement("p", {
    className: "control"
  }, React.createElement("a", {
    className: "button",
    href: "#",
    onClick: () => p_near_signout()
  }, React.createElement("span", {
    className: "icon"
  }, React.createElement("i", {
    className: "fas fa-sign-out-alt"
  })), React.createElement("span", null, "Logout")))))])))));
} //const nearClient = new nearlib.NearClient(
//window.walletAccount, 
//new nearlib.LocalNodeConnection(nearConfig.nodeUrl));


async function initContract() {
  // Initializing connection to the NEAR DevNet.
  //window.near = await nearlib.dev.connect(nearConfig);
  const nearClient = new nearlib.NearClient(window.walletAccount, new nearlib.LocalNodeConnection(nearConfig.nodeUrl));
  window.near = new nearlib.Near(nearClient); // Initializing our contract APIs by contract name and configuration.

  window.contract = await near.loadContract(nearConfig.contractName, {
    // NOTE: This configuration only needed while NEAR is still in development
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ["getJobs", "getJob", "getJobsByAccount"],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ["jobInsert", "jobDelete", "droneStartJob", "droneFinishJob", "incrementCounter"],
    // Sender is the account ID to initialize transactions.
    // For devnet we create accounts on demand. See other examples on how to authorize accounts.
    //sender: nearlib.dev.myAccountId
    sender: window.walletAccount.getAccountId()
  });
}

async function jobInsert(box, nonce) {
  var res = await contract.jobInsert({
    enc_json: box,
    enc_nonce: nonce
  });
  console.log("jobInsert", res);
  return res.status == "Completed";
}

async function jobDelete(id) {
  var res = await contract.jobDelete({
    id: Number(id)
  });
  console.log("jobDelete", res);
  return res.status == "Completed";
}

async function getJobs() {
  return await contract.getJobs();
}

async function getJob(id) {
  return await contract.getJob({
    id: Number(id)
  });
}

async function getJobsByAccount(account) {
  return await contract.getJobsByAccount({
    account: account
  });
} // COMMON CODE BELOW:
// Loads nearlib and this contract into window scope.


window.nearInitPromise = initContract() //.then(doWork)
.catch(console.error);
ReactDOM.render(React.createElement(NavBar, {}, null), document.getElementById("react_navbar"));
ReactDOM.render(React.createElement(MainPicker, {}, null), document.getElementById("react_main_picker"));
ReactDOM.render(React.createElement(HelpModal, {}, null), document.getElementById("react_help_modal"));
ReactDOM.render(React.createElement(PrivKeyModal, {}, null), document.getElementById("react_privkey_modal"));