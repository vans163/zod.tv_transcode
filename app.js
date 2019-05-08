"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var API_ENDPOINT = "https://api.maelstrom.network/";
var store = {
  state: {},
  setState: function setState(a, b) {
    var _this = this;

    if (b === undefined) {
      this.state = a;
      this.setters.forEach(function (setter) {
        return setter(_this.state);
      });
    } else {
      this.state[a] = b;
      this.setters.forEach(function (setter) {
        return setter(_this.state);
      });
    }
  },
  setters: []
};
store.setState = store.setState.bind(store);

function useStore() {
  var _React$useState = React.useState(store.state),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      set = _React$useState2[1];

  if (!store.setters.includes(set)) {
    store.setters.push(set);
  }

  React.useEffect(function () {
    return function () {
      store.setters = store.setters.filter(function (setter) {
        return setter !== set;
      });
    };
  }, []);
  return [state, store.setState];
}

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
  zod_pubKey_base58: "9yfgNakMJNAcLumq6tmT3JkX9P4rNFmWf7zaLG3jLXpc" //transcode.zod.tv

};

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function post_promise(method, json) {
  if (_typeof(json) === 'object' && json !== null) {
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
  var cj_outputs = _toConsumableArray(store.state.cj_outputs);

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
  var cj_outputs = _toConsumableArray(store.state.cj_outputs);

  cj_outputs.splice(idx, 1);
  store.setState("cj_outputs", cj_outputs);

  if (store.state.tab_view_output_selected > cj_outputs.length - 1) {
    store.setState("tab_view_output_selected", cj_outputs.length - 1);
  }
}

function p_update_output(idx, key, value) {
  var cj_outputs = _toConsumableArray(store.state.cj_outputs);

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
      body = ["This is how your job looks before being encrypted. Only you can see this."];
      break;

    case "Job Encrypted":
      body = ["Your job is encrypted before it goes on the blockchain, a shared secret is generated between the drone who will process your job." + "  The drone also is not able to peek at the job JSON using a recent advance in applicable cryptography, which is still being ironed out." + "  If you are curious it is similar technology to what dFinity is using.", "", "In summary, only you have access to the plaintext Json and everyone else sees the Encrypted blob, the drone operator working on your job only sees Encrypted blob.", "Welcome to decentralized trustless computing, strap in and bid 'The Cloud' goodbye!"];
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

  var _p_encryptSharedBox = p_encryptSharedBox(json, store.state.privKey_base58),
      boxed_base58 = _p_encryptSharedBox.boxed_base58,
      nonce_base58 = _p_encryptSharedBox.nonce_base58;

  store.setState("boxed_base58", boxed_base58);
  store.setState("nonce_base58", nonce_base58);
  store.setState("privkey_modal_open", true); //var encrypted = encrypt_shared_box(json, my_pubkey, my_privkey, );
}

function p_insertJob() {
  return _p_insertJob.apply(this, arguments);
}

function _p_insertJob() {
  _p_insertJob = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            store.setState("privkey_modal_submit_loading", true);
            _context.next = 3;
            return jobInsert(store.state.boxed_base58, store.state.nonce_base58);

          case 3:
            store.setState("privkey_modal_submit_loading", false);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _p_insertJob.apply(this, arguments);
}

function MainPicker() {
  var _useStore = useStore(),
      _useStore2 = _slicedToArray(_useStore, 2),
      s = _useStore2[0],
      setState = _useStore2[1];

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
    onClick: function onClick() {
      return setState("tab_view_tab", "create_job");
    }
  }, React.createElement("a", null, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "fas fa-image",
    "aria-hidden": "true"
  })), React.createElement("span", null, "Create Job"))), React.createElement("li", {
    className: s.tab_view_tab == "jobs" ? "is-active" : "",
    onClick: function onClick() {
      return setState("tab_view_tab", "jobs");
    }
  }, React.createElement("a", null, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "fas fa-film",
    "aria-hidden": "true"
  })), React.createElement("span", null, "Jobs"))), React.createElement("li", {
    className: s.tab_view_tab == "help" ? "is-active" : "",
    onClick: function onClick() {
      return setState("tab_view_tab", "help");
    }
  }, React.createElement("a", null, React.createElement("span", {
    className: "icon is-small"
  }, React.createElement("i", {
    className: "far fa-file-alt",
    "aria-hidden": "true"
  })), React.createElement("span", null, "Help")))))), s.tab_view_tab == "create_job" && React.createElement(CreateJob, null), s.tab_view_tab == "jobs" && React.createElement(Jobs, null), s.tab_view_tab == "help" && React.createElement(Help, null)));
}

function CreateJob() {
  var _useStore3 = useStore(),
      _useStore4 = _slicedToArray(_useStore3, 2),
      s = _useStore4[0],
      setState = _useStore4[1];

  return [React.createElement("div", {
    key: "create_job",
    className: "card-content"
  }, React.createElement("div", {
    className: "content"
  }, React.createElement("div", {
    className: "field"
  }, "Source ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Source");
    }
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
    onChange: function onChange(e) {
      return setState("cj_source", e.target.value);
    }
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
  }, React.createElement("a", {
    href: "#",
    className: "card-footer-item"
  }, "Clear"), React.createElement("a", {
    href: "#",
    className: "card-footer-item",
    onClick: function onClick() {
      return p_submitJob();
    }
  }, "Submit"))];
}

function CreateJobOutputs() {
  var _useStore5 = useStore(),
      _useStore6 = _slicedToArray(_useStore5, 2),
      s = _useStore6[0],
      setState = _useStore6[1];

  var o_idx = s.tab_view_output_selected;
  var o = s.cj_outputs[o_idx];
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
  }, s.cj_outputs.map(function (item, idx) {
    return React.createElement("li", {
      key: idx,
      className: s.tab_view_output_selected == idx ? "is-active" : "",
      onClick: function onClick() {
        return setState("tab_view_output_selected", idx);
      }
    }, React.createElement("a", null, idx == 0 && React.createElement("span", null, "Output " + (idx + 1)), idx > 0 && React.createElement("div", null, React.createElement("span", null, "Output " + (idx + 1)), React.createElement("span", null, " \xA0\xA0\xA0 ", React.createElement("i", {
      className: "fas fa-trash-alt",
      onClick: function onClick(e) {
        e.stopPropagation();
        p_delete_output(idx);
      }
    })))));
  }), React.createElement("li", null, React.createElement("a", {
    onClick: function onClick() {
      return p_add_output();
    }
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
    onClick: function onClick() {
      return p_open_help("Target");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "target", e.target.value);
    }
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
    onClick: function onClick() {
      return p_open_help("Codec");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "codec", e.target.value);
    }
  }, React.createElement("option", {
    value: "h264"
  }, "h264"), React.createElement("option", {
    value: "hevc"
  }, "hevc")))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Bitrate ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Bitrate");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "bitrate", e.target.value);
    }
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
    onClick: function onClick() {
      return p_open_help("Width");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "width", e.target.value);
    }
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Height ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Height");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "height", e.target.value);
    }
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Offset ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Offset");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "offset", e.target.value);
    }
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Duration ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Duration");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "duration", e.target.value);
    }
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
    onClick: function onClick() {
      return p_open_help("Audio");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "audio", e.target.value);
    }
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
    onClick: function onClick() {
      return p_open_help("Audio Codec");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "audio_codec", e.target.value);
    }
  }, React.createElement("option", {
    value: "aac"
  }, "aac")))))))), React.createElement("div", {
    className: "column"
  }, o.audio == "custom" && React.createElement("div", {
    className: "field"
  }, "Audio Bitrate ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Audio Bitrate");
    }
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
    onChange: function onChange(e) {
      return p_update_output(o_idx, "audio_bitrate", e.target.value);
    }
  }))), React.createElement("div", {
    className: "control"
  }, React.createElement("a", {
    className: "button is-static"
  }, "KBPS")))))), React.createElement("div", {
    className: "column"
  })))));
}

function Jobs() {
  var _useStore7 = useStore(),
      _useStore8 = _slicedToArray(_useStore7, 2),
      s = _useStore8[0],
      setState = _useStore8[1];

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
  }, "By Job Id ", React.createElement("a", null, React.createElement("i", {
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
    value: "37"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))), React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button"
  }, "Search")))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "By Near Account Name ", React.createElement("a", null, React.createElement("i", {
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
    value: "devnet24324"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))), React.createElement("div", {
    className: "control"
  }, React.createElement("button", {
    className: "button"
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
    className: "button"
  }, "Search"))))))), "Outputs", React.createElement("table", {
    className: "table is-bordered"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Id"), React.createElement("th", null, "Account"), React.createElement("th", null, "Drone"), React.createElement("th", null, "Status"), React.createElement("th", null, "Error Code"), React.createElement("th", null, "Error Text"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", null, "1"), React.createElement("td", null, "devnet331"), React.createElement("td", null, "devnet134141"), React.createElement("td", null, "Working"), React.createElement("td", null, "0"), React.createElement("td", null)), React.createElement("tr", null, React.createElement("th", null, "2"), React.createElement("td", null, "devnet331"), React.createElement("td", null), React.createElement("td", null, "Queued"), React.createElement("td", null, "0"), React.createElement("td", null)), React.createElement("tr", null, React.createElement("th", null, "3"), React.createElement("td", null, "devnet331"), React.createElement("td", null, "devnet3313"), React.createElement("td", null, "Finished"), React.createElement("td", null, "0"), React.createElement("td", null)), React.createElement("tr", null, React.createElement("th", null, "4"), React.createElement("td", null, "devnet331"), React.createElement("td", null, "devnet3313"), React.createElement("td", null, "Error"), React.createElement("td", null, "3"), React.createElement("td", null, "Source Video Width > 4096"))))));
}

function Help() {
  var _useStore9 = useStore(),
      _useStore10 = _slicedToArray(_useStore9, 2),
      s = _useStore10[0],
      setState = _useStore10[1];

  return [];
}

function HelpModal() {
  var _useStore11 = useStore(),
      _useStore12 = _slicedToArray(_useStore11, 2),
      s = _useStore12[0],
      setState = _useStore12[1];

  return React.createElement("div", {
    className: "modal " + (s.help_modal_open ? "is-active" : ""),
    style: {
      zIndex: 100
    }
  }, React.createElement("div", {
    className: "modal-background",
    onClick: function onClick() {
      return setState("help_modal_open", false);
    }
  }), React.createElement("div", {
    className: "modal-card"
  }, React.createElement("header", {
    className: "modal-card-head"
  }, React.createElement("p", {
    className: "modal-card-title"
  }, s.help_modal_title), React.createElement("button", {
    className: "delete",
    "aria-label": "close",
    onClick: function onClick() {
      return setState("help_modal_open", false);
    }
  })), React.createElement("section", {
    className: "modal-card-body"
  }, s.help_modal_body.map(function (item, idx) {
    return item == "" ? React.createElement("br", {
      key: idx
    }) : React.createElement("p", {
      key: idx
    }, item);
  })), React.createElement("footer", null)));
}

function PrivKeyModal() {
  var _useStore13 = useStore(),
      _useStore14 = _slicedToArray(_useStore13, 2),
      s = _useStore14[0],
      setState = _useStore14[1];

  return React.createElement("div", {
    className: "modal " + (s.privkey_modal_open ? "is-active" : "")
  }, React.createElement("div", {
    className: "modal-background",
    onClick: function onClick() {
      return setState("privkey_modal_open", false);
    }
  }), React.createElement("div", {
    className: "modal-card"
  }, React.createElement("header", {
    className: "modal-card-head"
  }, React.createElement("p", {
    className: "modal-card-title"
  }, "Confirm Submission"), React.createElement("button", {
    className: "delete",
    "aria-label": "close",
    onClick: function onClick() {
      return setState("privkey_modal_open", false);
    }
  })), React.createElement("section", {
    className: "modal-card-body"
  }, React.createElement("div", {
    className: "field"
  }, "Your Private Key ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Private Key");
    }
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
    onChange: function onChange(e) {
      return setState("privKey_base58", e.target.value);
    }
  })))))), React.createElement("div", {
    className: "field"
  }, "Your Private Job ", React.createElement("a", {
    onClick: function onClick() {
      return p_open_help("Job Json");
    }
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
    onClick: function onClick() {
      return p_open_help("Job Encrypted");
    }
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
    onClick: function onClick() {
      return setState("privkey_modal_open", false);
    }
  }, "Cancel"), React.createElement("button", {
    className: "button " + s.privkey_modal_submit_loading ? "is-loading" : "",
    onClick: function onClick() {
      return p_insertJob();
    }
  }, "Submit"))));
}
/*
<section className="container" style="padding: 10px; margin-bottom: 20px; margin-top: 10px; ">
  <div className="card">
    <header className="card-header">
      <div className="tabs is-boxed">
        <ul>
          <li className="is-active">
            <a>
              <span className="icon is-small"><i className="fas fa-image" aria-hidden="true"></i></span>
              <span>Create Job</span>
            </a>
          </li>
          <li>
            <a>
              <span className="icon is-small"><i className="fas fa-film" aria-hidden="true"></i></span>
              <span>Jobs</span>
            </a>
          </li>
          <li>
            <a>
              <span className="icon is-small"><i className="far fa-file-alt" aria-hidden="true"></i></span>
              <span>Help</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
    <div className="card-content">
      <div className="content">
        
        <div className="field">
          Source <a><i className="far fa-question-circle" aria-hidden="true"></i></a>

          <div className="field-body">
            <div className="field has-addons">
              <div className="control is-expanded">
                <div className="control has-icons-right">
                  <input className="input" type="text" value="s3://sys.wasabi.com/myBucket/myVideo.mp4">
                  <span className="icon is-small is-right is-success">
                    <i className=""></i>
                  </span>
                </div>
              </div>
              <div className="control">
                <button className="button" >
                  Check
                </button>
              </div>
            </div>
          </div>

          <!-- <div className="control">
            <input className="input is-primary" type="text" placeholder="Primary input">
          </div> -->
        </div>

        Outputs
        <div className="tabs is-boxed">
          <ul style="margin-left: 0em; margin-top: 0em">
            <li className="is-active">
              <a>
                <span>Output 1</span>
              </a>
            </li>
            <li>
              <a>
                <span className="icon is-small"><i className="far fa-plus-square" aria-hidden="true"></i></span>
              </a>
            </li>
          </ul>
        </div>

        <div className="field">
          <div className="control">
            <input className="input is-primary" type="text" placeholder="Primary input">
          </div>
        </div>


      </div>
    </div>
    <footer className="card-footer">
      <a href="#" className="card-footer-item">Clear</a>
      <a href="#" className="card-footer-item">Submit</a>
    </footer>
  </div>
</section>
*/


ReactDOM.render(React.createElement(MainPicker, {}, null), document.getElementById("react_main_picker"));
ReactDOM.render(React.createElement(HelpModal, {}, null), document.getElementById("react_help_modal"));
ReactDOM.render(React.createElement(PrivKeyModal, {}, null), document.getElementById("react_privkey_modal"));