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
    const [ state, set ] = React.useState(store.state);
    if (!store.setters.includes(set)) {
        store.setters.push(set);
    }

    React.useEffect(() => () => {
        store.setters = store.setters.filter(setter=> setter !== set);
    }, [])

    return [ state, store.setState ];
}

window.walletAccount = new nearlib.WalletAccount("transcode.zod.tv", "https://wallet.nearprotocol.com");
console.log("signed in?", window.walletAccount.isSignedIn());

store.state = {
    navbar_burger: false,

    tab_view_tab: "create_job",
    tab_view_output_selected: 0,

    cj_source: "s3://ApIKeYaa34a5:ApIPassOrSecret@sys.wasabi.com/myOriginals/myVideo.mp4",
    cj_outputs: [{target: "s3://APIKey:APISec@sys.wasabi.com/myVideo/myVideo-1080p.mp4", codec: "h264", bitrate: 4.5, width: -1, height: 720, audio: "copy", audio_codec: "aac", audio_bitrate: 256, offset: "00:00:00", duration: ""}],
    cj_json: "",

    help_modal_open: false,
    help_modal_title: "Unknown",
    help_modal_body: ["Unknown help, something wrong?"],

    privkey_modal_open: false,
    privkey_modal_submit_loading: false,
    privKey_base58: "44zsbWT9Xk1RjJysfZaZ1qF8CpGQQ8yLP8Xk4ydqZ6GdGfiHPm5u7VbiUZRSiPkWwQAjJWpebcQZ1V58PTbPnHt3", //zod_tv3

    zod_pubKey_base58: "9yfgNakMJNAcLumq6tmT3JkX9P4rNFmWf7zaLG3jLXpc", //transcode.zod.tv

    job_table: [],
    job_button_loading: false, 
    j_job_acc: "devuser1557211012642",
    j_job_id: "1",

    wallet_signed_in: window.walletAccount.isSignedIn(),
    wallet_account_name: window.walletAccount.getAccountId(),
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function post_promise(method, json) {
    if (typeof json === 'object' && json !== null) {
        json = JSON.stringify(json)
    }
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (this.getResponseHeader('content-type') == "application/json") {
                        resolve(JSON.parse(xhr.response))
                    } else {
                        resolve(xhr.response)
                    }
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout')
        }

        xhr.withCredentials = true;
        xhr.open('POST', API_ENDPOINT + method);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(json);
    });
}

function p_add_output() {
    var cj_outputs = [...store.state.cj_outputs];
    var new_output = {target: "", codec: "h264", bitrate: 4.5, width: -1, height: 720, audio: "copy", audio_codec: "aac", audio_bitrate: 256, offset: "00:00:00", duration: ""};
    cj_outputs.push(new_output);
    store.setState("cj_outputs", cj_outputs);
}
function p_delete_output(idx) {
    var cj_outputs = [...store.state.cj_outputs];
    cj_outputs.splice(idx, 1);
    store.setState("cj_outputs", cj_outputs);
    if (store.state.tab_view_output_selected > (cj_outputs.length-1)) {
        store.setState("tab_view_output_selected", cj_outputs.length-1);
    }
}
function p_update_output(idx, key, value) {
    var cj_outputs = [...store.state.cj_outputs];
    var output = cj_outputs[idx];
    output[key] = value;
    store.setState("cj_outputs", cj_outputs);
}

function p_open_help(title) {
    var body = [""]
    switch(title) {
        case "Target":
        case "Source":
            body = ["Your source or target is the full path to the location of the file, currently HTTP, HTTPS and S3 are supported.",
            "",
            "<protocol>://<api_key>:<api_pass>@<bucket_host>/<bucket_path>",
            "",
            "protocol: http | https | ftp | ftps | sftp | s3",
            "api_key: API Key to access things like S3 and FTP",
            "api_pass: API Password/Secret to access things like S3 and FTP",
            "bucket_host: The domain of your provider",
            "bucket_path: The full path to the file in the bucket",
            "",
            "Press the Check button to troubleshoot your configuration and see if the file can be accessed"
            ];
            break;
        case "Codec":
            body = ["The video codec to use for the output.",
            "",
            "Supported: h264 | hevc",
            "Coming Soon: vp9 av1",
            ];
            break;
        case "Bitrate":
            body = ["The video bitrate in MegaBits Per Second to use for the output.",
            ];
            break;
        case "Height":
        case "Width":
            body = ["The video output width and height. If you want to automatically set it, use -1.",
            "",
            "Example to downscale to 240p keeping aspect ratio. Width: -1 Height: 240"
            ];
            break;
        case "Offset":
            body = ["The video offset is where to start cutting the video from for this output.",
            "The offset is automatically adjusted to the nearest keyframe to prevent a black output.", 
            "",
            "The format must be <hour>:<minute>:<second>",
            "",
            "Example: 00:05:00 start the video on the nearest keyframe to the 5th minute"
            ];
            break;
        case "Duration":
            body = ["The video duration is for how long to cut the video for",
            "",
            "The format must be <hour>:<minute>:<second>",
            "",
            "Example: Offset: 00:05:00 Duration: 00:01:00",
            "Cut 1 minute of video after the 5th minute"
            ];
            break;
        case "Audio":
            body = ["What to do with the audio from the source video.",
            "",
            "Copy: Copy the source audio to the output, without touching it",
            "NoAudio: Remove the audio completely from the output",
            "Custom: Set a custom codec and bitrate to down/up sample the audio"
            ];
            break;
        case "Audio Codec":
            body = ["Which audio codec to use",
            "",
            "Supported: aac",
            "Coming Soon: opus",
            ];
            break;
        case "Audio Bitrate":
            body = ["Audio bitrate for the output in KiloBits Per Second",
            "",
            "Recommended 128kbps, 192kbps or 256kbps. ITunes uses 256kbps.",
            ];
            break;

        case "Private Key":
            body = ["The private key for your address in base58 format. Gotten from your wallet but currently NEAR Wallets are not ready.",
            "",
            "There is a default private key already entered for debug purposes.  Note that if you use this key, "
            + "your job is as good as plain text on the blockchain and anyone can steal your API keys for S3/FTP/etc.",
            ];
            break;
        case "Job Json":
            body = ["This is how your job looks before being encrypted. Only you can see this.",
            ];
            break;
        case "Job Encrypted":
            body = ["Your job is encrypted before it goes on the blockchain, a shared secret is generated between the drone who will process your job."
            + "  The drone also is not able to peek at the job JSON using a recent advance in applicable cryptography, which is still being ironed out."
            + "  If you are curious it is similar technology to what dFinity is using.",
            "",
            "In summary, only you have access to the plaintext Json and everyone else sees the Encrypted blob, the drone operator working on your job only sees Encrypted blob.",
            "Welcome to decentralized trustless computing, strap in and bid 'The Cloud' goodbye!"
            ];
            break;
        case "By Job Id":
            body = ["Find a single Job by Id. The Id is an incremental number.",
            "",
            ];
            break;
        case "By Near Account Name":
            body = ["Find all jobs belonging to a NEAR account. Your Near Account name is a string.",
            "",
            ];
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
        privKey_Curve25519_bin = ed2curve.convertSecretKey(privKey_ed25519_bin);
        //var res = nacl.sign.keyPair.fromSecretKey(binKey);
        //publicKey = res.publicKey;
        //secretKey = res.secretKey;
    } catch (e) {
        store.setState("privKey_error", "Failed to convert ed25519 to Curve25519");
        return;
    }

    var zod_pubKey_Curve25519 = ed2curve.convertPublicKey(Base58.decode(store.state.zod_pubKey_base58))

    var shared_secret = nacl.box.before(zod_pubKey_Curve25519, privKey_Curve25519_bin);
    return shared_secret;
}

function p_encryptSharedBox(message, private_key_base58) {
    var shared_secret = p_getSharedSecret(private_key_base58);

    var nonce = newNonce();
    var message = store.state.cj_json;
    var boxed = nacl.box.after((new TextEncoder()).encode(message), nonce, shared_secret);
    return {boxed_base58: Base58.encode(boxed), nonce_base58: Base58.encode(nonce)};
}

function p_decryptSharedBox(boxed_base58, nonce_base58, private_key_base58) {
    var shared_secret = p_getSharedSecret(private_key_base58);

    var nonce = Base58.decode(nonce_base58);
    var boxed = Base58.decode(boxed_base58);
    var unboxed = nacl.box.open.after(boxed, nonce, shared_secret);
    var text = (new TextDecoder()).decode(unboxed);
    return text;
}

function p_submitJob() {
    var job = {
        source: store.state.cj_source,
        outputs: store.state.cj_outputs
    }
    var json = JSON.stringify(job);
    store.setState("cj_json", json);

    let {boxed_base58, nonce_base58} = p_encryptSharedBox(json, store.state.privKey_base58);

    store.setState("boxed_base58", boxed_base58);
    store.setState("nonce_base58", nonce_base58);

    store.setState("privkey_modal_open", true);

    //var encrypted = encrypt_shared_box(json, my_pubkey, my_privkey, );
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
  window.walletAccount.requestSignIn(
      "transcode.zod.tv", 
      "Zod.TV - Transcode", 
      location.href,
      location.href);
}

function p_near_signout() {
    window.walletAccount.signOut();
    store.setState("wallet_signed_in", false);
    store.setState("wallet_account_name", "");
    window.history.replaceState({}, document.title, "/");
}


function MainPicker() {
    const [s, setState] = useStore();

    return <section class="container" style={{padding: "10px", marginBottom: "20px", marginTop: "10px"}}>
      <div class="card">
        <header class="card-header">
          <div class="tabs is-boxed">
            <ul>
              <li class={s.tab_view_tab == "create_job" ? "is-active" : ""} onClick={()=> setState("tab_view_tab", "create_job")}>
                <a>
                  <span class="icon is-small"><i class="fas fa-image" aria-hidden="true"></i></span>
                  <span>Create Job</span>
                </a>
              </li>
              <li class={s.tab_view_tab == "jobs" ? "is-active" : ""} onClick={()=> setState("tab_view_tab", "jobs")}>
                <a>
                  <span class="icon is-small"><i class="fas fa-film" aria-hidden="true"></i></span>
                  <span>Jobs</span>
                </a>
              </li>
              <li class={s.tab_view_tab == "help" ? "is-active" : ""} onClick={()=> setState("tab_view_tab", "help")}>
                <a>
                  <span class="icon is-small"><i class="far fa-file-alt" aria-hidden="true"></i></span>
                  <span>Help</span>
                </a>
              </li>
            </ul>
          </div>
        </header>
        {s.tab_view_tab == "create_job" && <CreateJob/>}
        {s.tab_view_tab == "jobs" && <Jobs/>}
        {s.tab_view_tab == "help" && <Help/>}
      </div>
    </section>;
}

function CreateJob() {
    const [s, setState] = useStore();

    return [<div key="create_job" class="card-content">
        <div class="content">
          
          <div class="field">
            Source <a onClick={()=> p_open_help("Source")}><i class="far fa-question-circle" aria-hidden="true"></i></a>

            <div class="field-body">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <div class="control has-icons-right">
                    <input class="input" type="text" value={s.cj_source} onChange={(e)=>setState("cj_source", e.target.value)}/>
                    <span class="icon is-small is-right is-success">
                      <i class=""></i>
                    </span>
                  </div>
                </div>
                <div class="control">
                  <button class="button" >
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>

          Outputs
          <CreateJobOutputs/>

          {/*<div class="field">
            <div class="control">
              <input class="input is-primary" type="text" placeholder="Primary input"/>
            </div>
          </div>*/}

        </div>
      </div>,
      <footer key="footer_create_job" class="card-footer">
        <a href="#" class="card-footer-item">Clear</a>
        <a href="#" class="card-footer-item" onClick={()=> p_submitJob()}>Submit</a>
      </footer>
    ]
}

function CreateJobOutputs() {
    const [s, setState] = useStore();
    let o_idx = s.tab_view_output_selected;
    let o = s.cj_outputs[o_idx];

    return <div class="card">
        <header class="card-header">
          <div class="tabs is-boxed">
            <ul style={{marginLeft: "0em", marginTop: "0em"}}>
              {
                s.cj_outputs.map((item,idx)=> 
                  <li key={idx} class={s.tab_view_output_selected == idx ? "is-active" : ""} onClick={()=> setState("tab_view_output_selected", idx)}>
                    <a>
                      {idx == 0 && <span>{"Output "+(idx+1)}</span>}
                      {idx > 0 && 
                        <div>
                          <span>{"Output "+(idx+1)}</span>
                          <span> &nbsp;&nbsp;&nbsp; <i class="fas fa-trash-alt" onClick={(e)=> {e.stopPropagation(); p_delete_output(idx)}}></i></span>
                        </div>
                      }
                    </a>
                  </li>
                )
              }
              <li>
                <a onClick={()=> p_add_output()}>
                  <span class="icon is-small"><i class="far fa-plus-square" aria-hidden="true"></i></span>
                </a>
              </li>
            </ul>
          </div>
        </header>

        <div class="card-content" style={{padding: "0.25em"}}>
          <div class="content">
            
            <div class="field">
              Target <a onClick={()=> p_open_help("Target")}><i class="far fa-question-circle" aria-hidden="true"></i></a>

              <div class="field-body">
                <div class="field has-addons">
                  <div class="control is-expanded">
                    <div class="control has-icons-right">                    
                      <input class="input" type="text" value={o.target} onChange={(e)=> p_update_output(o_idx,"target",e.target.value)}/>
                      <span class="icon is-small is-right is-success">
                        <i class=""></i>
                      </span>
                    </div>
                  </div>
                  <div class="control">
                    <button class="button" >
                      Check
                    </button>
                  </div>
                </div>
              </div>
            </div>


            <div class="columns">
              <div class="column">

                <div class="field">
                  Codec <a onClick={()=> p_open_help("Codec")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                          <div class="select is-fullwidth">
                            <select value={o.codec} onChange={(e)=> p_update_output(o_idx,"codec",e.target.value)}>
                              <option value="h264">h264</option>
                              <option value="hevc">hevc</option>
                            </select>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div class="column">

                <div class="field">
                  Bitrate <a onClick={()=> p_open_help("Bitrate")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow has-addons">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value={o.bitrate} onChange={(e)=> p_update_output(o_idx,"bitrate",e.target.value)}/>
                        </div>
                      </div>
                      <div class="control">
                        <a class="button is-static">MBPS</a>
                      </div>
                    </div>
                  </div>
                </div>
                

              </div>
              <div class="column"></div>
              <div class="column"></div>
            </div>



            <div class="columns">
              <div class="column">

                <div class="field">
                  Width <a onClick={()=> p_open_help("Width")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value={o.width} onChange={(e)=> p_update_output(o_idx,"width",e.target.value)}/>
                          <span class="icon is-small is-right is-success">
                            <i class=""></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div class="column">

                <div class="field">
                  Height <a onClick={()=> p_open_help("Height")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value={o.height} onChange={(e)=> p_update_output(o_idx,"height",e.target.value)}/>
                          <span class="icon is-small is-right is-success">
                            <i class=""></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div class="column">

                <div class="field">
                  Offset <a onClick={()=> p_open_help("Offset")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value={o.offset} onChange={(e)=> p_update_output(o_idx,"offset",e.target.value)}/>
                          <span class="icon is-small is-right is-success">
                            <i class=""></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div class="column">

                <div class="field">
                  Duration <a onClick={()=> p_open_help("Duration")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value={o.duration} onChange={(e)=> p_update_output(o_idx,"duration",e.target.value)}/>
                          <span class="icon is-small is-right is-success">
                            <i class=""></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>


            <div class="columns">
              <div class="column">

                <div class="field">
                  Audio <a onClick={()=> p_open_help("Audio")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select is-fullwidth">
                          <select value={o.audio} onChange={(e)=> p_update_output(o_idx,"audio",e.target.value)}>
                            <option value="copy">Copy</option>
                            <option value="noaudio">NoAudio</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
              <div class="column">
                {o.audio == "custom" &&
                  <div class="field">
                    Audio Codec <a onClick={()=> p_open_help("Audio Codec")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <div class="select is-fullwidth">
                            <select value={o.audio_codec} onChange={(e)=> p_update_output(o_idx,"audio_codec",e.target.value)}>
                              <option value="aac">aac</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                

              </div>
              <div class="column">
                
                {o.audio == "custom" &&
                  <div class="field">
                    Audio Bitrate <a onClick={()=> p_open_help("Audio Bitrate")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                    <div class="field-body">
                      <div class="field is-narrow has-addons">
                        <div class="control">
                          <div class="control has-icons-right">
                            <input class="input" type="text" value={o.audio_bitrate} onChange={(e)=> p_update_output(o_idx,"audio_bitrate",e.target.value)}/>
                          </div>
                        </div>
                        <div class="control">
                          <a class="button is-static">KBPS</a>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                

              </div>
              <div class="column"></div>
            </div>


          </div>
        </div>


      </div>
}

function Jobs() {
    const [s, setState] = useStore();

    return <div class="card-content">
        <div class="content">
          
          <div class="columns">
            <div class="column">

              <div class="field">
                By Job Id <a onClick={()=> p_open_help("By Job Id")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                <div class="field-body">
                  <div class="field is-narrow has-addons">
                    <div class="control">
                      <div class="control">
                        <input class="input" type="text" value={s.j_job_id} onChange={(e)=> setState("j_job_id", e.target.value)}/>
                      </div>
                    </div>
                    <div class="control">
                      <button class={"button "+(s.job_button_loading?"is-loading":"")} onClick={()=> p_getJobById()}>
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="column">

              <div class="field">
                By Near Account Name <a onClick={()=> p_open_help("By Near Account Name")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
                <div class="field-body">
                  <div class="field is-narrow has-addons">
                    <div class="control">
                      <div class="control has-icons-right">
                        <input class="input" type="text" value={s.j_job_acc} onChange={(e)=> setState("j_job_acc", e.target.value)}/>
                        <span class="icon is-small is-right is-success">
                          <i class=""></i>
                        </span>
                      </div>
                    </div>
                    <div class="control">
                      <button class={"button "+(s.job_button_loading?"is-loading":"")} onClick={()=> p_getJobsByNearAccount()}>
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="column">

              <div class="field">
                All Jobs
                <div class="field-body">
                  <div class="field is-narrow has-addons">
                    <div class="control">
                      <button class={"button "+(s.job_button_loading?"is-loading":"")} onClick={()=> p_getAllJobs()}>
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


          Jobs
          <table class="table is-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Account</th>                
                <th>Drone</th>
                <th>Status</th>
                <th>Error Code</th>
                <th>Error Text</th>
              </tr>
            </thead>
            <tbody>
            {
              s.job_table.map((item,idx)=> 
                <tr key={item.id}>
                  <th>{item.id}</th>
                  <td>{item.owner}</td>
                  <td>{item.drone}</td>
                  <td>{item.drone == null ? "Queued" : (item.done == true ? "Done" : "Working")}</td>
                  <td>{item.error_code}</td>
                  <td>{item.error_text}</td>
                </tr>
              )
            }
            </tbody>
           </table>


        </div>
      </div>
}

function Help() {
    const [s, setState] = useStore();

    return [];
}

function HelpModal() {
    const [s, setState] = useStore();

    return <div class={"modal " + (s.help_modal_open ? "is-active" : "")} style={{zIndex: 100}}>
      <div class="modal-background" onClick={()=> setState("help_modal_open", false)}></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{s.help_modal_title}</p>
          <button class="delete" aria-label="close" onClick={()=> setState("help_modal_open", false)}></button>
        </header>
        <section class="modal-card-body">
          {
            s.help_modal_body.map((item,idx)=> 
              item == "" ? <br key={idx}/> : <p key={idx}>{item}</p>
            )
          }
        </section>
        <footer>
        </footer>
      </div>
    </div>;
}

function PrivKeyModal() {
    const [s, setState] = useStore();

    return <div class={"modal " + (s.privkey_modal_open ? "is-active" : "")}>
      <div class="modal-background" onClick={()=> setState("privkey_modal_open", false)}></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Submission</p>
          <button class="delete" aria-label="close" onClick={()=> setState("privkey_modal_open", false)}></button>
        </header>
        <section class="modal-card-body">

          <div class="field">
            Your Private Key <a onClick={()=> p_open_help("Private Key")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <div class="control is-fullwidth">
                    <input class="input" type="text" value={s.privKey_base58} onChange={(e)=> setState("privKey_base58",e.target.value)}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            Your Private Job <a onClick={()=> p_open_help("Job Json")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
            <textarea class="textarea" value={s.cj_json} rows="6" style={{resize: "none", backgroundColor: "#eff0f1", overflow: "auto"}} readOnly></textarea>
          </div>
          <div class="field">
            Your Public Encrypted Job Blob <a onClick={()=> p_open_help("Job Encrypted")}><i class="far fa-question-circle" aria-hidden="true"></i></a>
            <textarea class="textarea" value={s.boxed_base58} style={{resize: "none", backgroundColor: "#eff0f1", overflow: "auto"}} readOnly></textarea>
          </div>

        </section>
        <footer class="modal-card-foot">
          <button class="button is-error" onClick={()=> setState("privkey_modal_open", false)}>Cancel</button>
          <button class={"button "+(s.privkey_modal_submit_loading ? "is-loading" : "")} onClick={()=> p_insertJob()}>Submit</button>
        </footer>
      </div>
    </div>;
}

function NavBar() {
    const [s, setState] = useStore();

    return <div>
      <div>
        <nav class="navbar"></nav>
        <nav class="navbar is-transparent is-fixed-top has-shadow" style={{boxShadow: "rgba(10, 10, 10, 0.1) 0px 2px 3px"}}>
          <div class="navbar-brand">
            <span class="navbar-item">
              <img src="https://cdn.shopify.com/s/files/1/2312/7883/products/19-1_1400x.png?v=1539110648" alt="Description" style={{cursor: "pointer"}}/>
              <span style={{cursor: "default"}}>&nbsp;&nbsp;ZODTV - TRANSCODE</span>
            </span>
            <button class="button navbar-burger "></button>
          </div>
          <div class="navbar-menu ">
            <div class="navbar-start"></div>
            <div class="navbar-end">

            {s.wallet_signed_in == false &&
              <div class="navbar-item">
                <div class="field is-grouped">
                  <p class="control">
                    <a class="button" href="#" onClick={()=> p_near_signin()}>
                      <span class="icon">
                        <i class="fas fa-link"></i>
                      </span>
                      <span>Login with NEAR</span>
                    </a>
                  </p>
                </div>
              </div>
            }

            {s.wallet_signed_in == true &&
              [
              <div key="1" class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">{s.wallet_account_name}</a>
              </div>,

              <div key="2" class="navbar-item">
                <div class="field is-grouped">
                  <p class="control">
                    <a class="button" href="#" onClick={()=> p_near_signout()}>
                      <span class="icon">
                        <i class="fas fa-sign-out-alt"></i>
                      </span>
                      <span>Logout</span>
                    </a>
                  </p>
                </div>
              </div>]
            }

            </div>
          </div>
        </nav>
      </div>
    </div>;
}


async function initContract() {
  // Initializing connection to the NEAR DevNet.
  window.near = await nearlib.dev.connect(nearConfig);

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await near.loadContract(nearConfig.contractName, {
    // NOTE: This configuration only needed while NEAR is still in development
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ["getJobs", "getJob", "getJobsByAccount"],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ["jobInsert", "jobDelete", "droneStartJob", "droneFinishJob", "incrementCounter"],
    // Sender is the account ID to initialize transactions.
    // For devnet we create accounts on demand. See other examples on how to authorize accounts.
    sender: nearlib.dev.myAccountId
    //sender: window.walletAccount.getAccountId()
  });
}

async function jobInsert(box, nonce) {
    var res = await contract.jobInsert({enc_json: box, enc_nonce: nonce});
    console.log("jobInsert", res);
    return res.status == "Completed";
}

async function jobDelete(id) {
    var res = await contract.jobDelete({id: id});
    console.log("jobDelete", res);
    return res.status == "Completed";
}

async function getJobs() {
    return await contract.getJobs();
}
async function getJob(id) {
    return await contract.getJob({id: id});
}
async function getJobsByAccount(account) {
    return await contract.getJobsByAccount({account: account});
}

// COMMON CODE BELOW:
// Loads nearlib and this contract into window scope.
window.nearInitPromise = initContract()
  //.then(doWork)
  .catch(console.error);


ReactDOM.render(React.createElement(NavBar,{},null), document.getElementById("react_navbar"));
ReactDOM.render(React.createElement(MainPicker,{},null), document.getElementById("react_main_picker"));
ReactDOM.render(React.createElement(HelpModal,{},null), document.getElementById("react_help_modal"));
ReactDOM.render(React.createElement(PrivKeyModal,{},null), document.getElementById("react_privkey_modal"));