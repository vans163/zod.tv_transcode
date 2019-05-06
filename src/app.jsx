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

store.state = {
    navbar_burger: false,

    tab_view_tab: "create_job",
    tab_view_output_tab: 1,
    tab_view_output_selected: 1
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
            Source <a><i class="far fa-question-circle" aria-hidden="true"></i></a>

            <div class="field-body">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <div class="control has-icons-right">
                    <input class="input" type="text" value="s3://sys.wasabi.com/myBucket/myVideo.mp4"/>
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
        <a href="#" class="card-footer-item">Submit</a>
      </footer>
    ]
}

function CreateJobOutputs() {
    const [s, setState] = useStore();

    return <div class="card">
        <header class="card-header">
          <div class="tabs is-boxed">
            <ul style={{marginLeft: "0em", marginTop: "0em"}}>
              <li class={s.tab_view_output_tab == 1 ? "is-active" : ""} onClick={()=> setState("tab_view_output_selected", 1)}>
                <a>
                  <span>Output 1</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="icon is-small"><i class="far fa-plus-square" aria-hidden="true"></i></span>
                </a>
              </li>
            </ul>
          </div>
        </header>

        <div class="card-content" style={{padding: "0.25em"}}>
          <div class="content">
            
            <div class="field">
              Target <a><i class="far fa-question-circle" aria-hidden="true"></i></a>

              <div class="field-body">
                <div class="field has-addons">
                  <div class="control is-expanded">
                    <div class="control has-icons-right">
                      <input class="input" type="text" value="s3://sys.wasabi.com/myVideo/myVideo-1080p.mp4"/>
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
                  Codec <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="h264"/>
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
                  Bitrate <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="4.5 mbps"/>
                          <span class="icon is-small is-right is-success">
                            <i class=""></i>
                          </span>
                        </div>
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
                  Width <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="-1"/>
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
                  Height <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="1080"/>
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
                  Offset <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="00:10:00"/>
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
                  Duration <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="00:05:00"/>
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
                  Audio <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="Yes"/>
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
                  Audio Codec <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="aac"/>
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
                  Audio Bitrate <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                  <div class="field-body">
                    <div class="field is-narrow">
                      <div class="control">
                        <div class="control has-icons-right">
                          <input class="input" type="text" value="256 kbps"/>
                          <span class="icon is-small is-right is-success">
                            <i class=""></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
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
                By Job Id <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                <div class="field-body">
                  <div class="field is-narrow has-addons">
                    <div class="control">
                      <div class="control has-icons-right">
                        <input class="input" type="text" value="37"/>
                        <span class="icon is-small is-right is-success">
                          <i class=""></i>
                        </span>
                      </div>
                    </div>
                    <div class="control">
                      <button class="button">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="column">

              <div class="field">
                By Near Account Name <a><i class="far fa-question-circle" aria-hidden="true"></i></a>
                <div class="field-body">
                  <div class="field is-narrow has-addons">
                    <div class="control">
                      <div class="control has-icons-right">
                        <input class="input" type="text" value="devnet24324"/>
                        <span class="icon is-small is-right is-success">
                          <i class=""></i>
                        </span>
                      </div>
                    </div>
                    <div class="control">
                      <button class="button">
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
                      <button class="button">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


          Outputs
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
              <tr>
                <th>1</th>
                <td>devnet331</td>
                <td>devnet134141</td>
                <td>Working</td>
                <td>0</td>
                <td></td>
              </tr>
              <tr>
                <th>2</th>
                <td>devnet331</td>
                <td></td>
                <td>Queued</td>
                <td>0</td>
                <td></td>
              </tr>
              <tr>
                <th>3</th>
                <td>devnet331</td>
                <td>devnet3313</td>
                <td>Finished</td>
                <td>0</td>
                <td></td>
              </tr>
              <tr>
                <th>4</th>
                <td>devnet331</td>
                <td>devnet3313</td>
                <td>Error</td>
                <td>3</td>
                <td>Source Video Width > 4096</td>
              </tr>
            </tbody>
           </table>


        </div>
      </div>
}

function Help() {
    const [s, setState] = useStore();

    return [];
}



/*
<section class="container" style="padding: 10px; margin-bottom: 20px; margin-top: 10px; ">
  <div class="card">
    <header class="card-header">
      <div class="tabs is-boxed">
        <ul>
          <li class="is-active">
            <a>
              <span class="icon is-small"><i class="fas fa-image" aria-hidden="true"></i></span>
              <span>Create Job</span>
            </a>
          </li>
          <li>
            <a>
              <span class="icon is-small"><i class="fas fa-film" aria-hidden="true"></i></span>
              <span>Jobs</span>
            </a>
          </li>
          <li>
            <a>
              <span class="icon is-small"><i class="far fa-file-alt" aria-hidden="true"></i></span>
              <span>Help</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
    <div class="card-content">
      <div class="content">
        
        <div class="field">
          Source <a><i class="far fa-question-circle" aria-hidden="true"></i></a>

          <div class="field-body">
            <div class="field has-addons">
              <div class="control is-expanded">
                <div class="control has-icons-right">
                  <input class="input" type="text" value="s3://sys.wasabi.com/myBucket/myVideo.mp4">
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

          <!-- <div class="control">
            <input class="input is-primary" type="text" placeholder="Primary input">
          </div> -->
        </div>

        Outputs
        <div class="tabs is-boxed">
          <ul style="margin-left: 0em; margin-top: 0em">
            <li class="is-active">
              <a>
                <span>Output 1</span>
              </a>
            </li>
            <li>
              <a>
                <span class="icon is-small"><i class="far fa-plus-square" aria-hidden="true"></i></span>
              </a>
            </li>
          </ul>
        </div>

        <div class="field">
          <div class="control">
            <input class="input is-primary" type="text" placeholder="Primary input">
          </div>
        </div>


      </div>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item">Clear</a>
      <a href="#" class="card-footer-item">Submit</a>
    </footer>
  </div>
</section>
*/
ReactDOM.render(React.createElement(MainPicker,{},null), document.getElementById("react_main_picker"));