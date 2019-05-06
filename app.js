"use strict";

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
  tab_view_output_tab: 1,
  tab_view_output_selected: 1
};

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
  }, "Source ", React.createElement("a", null, React.createElement("i", {
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
    value: "s3://sys.wasabi.com/myBucket/myVideo.mp4"
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
    className: "card-footer-item"
  }, "Submit"))];
}

function CreateJobOutputs() {
  var _useStore5 = useStore(),
      _useStore6 = _slicedToArray(_useStore5, 2),
      s = _useStore6[0],
      setState = _useStore6[1];

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
  }, React.createElement("li", {
    className: s.tab_view_output_tab == 1 ? "is-active" : "",
    onClick: function onClick() {
      return setState("tab_view_output_selected", 1);
    }
  }, React.createElement("a", null, React.createElement("span", null, "Output 1"))), React.createElement("li", null, React.createElement("a", null, React.createElement("span", {
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
  }, "Target ", React.createElement("a", null, React.createElement("i", {
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
    value: "s3://sys.wasabi.com/myVideo/myVideo-1080p.mp4"
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
  }, "Codec ", React.createElement("a", null, React.createElement("i", {
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
    value: "h264"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Bitrate ", React.createElement("a", null, React.createElement("i", {
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
    value: "4.5 mbps"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }), React.createElement("div", {
    className: "column"
  })), React.createElement("div", {
    className: "columns"
  }, React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Width ", React.createElement("a", null, React.createElement("i", {
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
    value: "-1"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Height ", React.createElement("a", null, React.createElement("i", {
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
    value: "1080"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Offset ", React.createElement("a", null, React.createElement("i", {
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
    value: "00:10:00"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Duration ", React.createElement("a", null, React.createElement("i", {
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
    value: "00:05:00"
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
  }, "Audio ", React.createElement("a", null, React.createElement("i", {
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
    value: "Yes"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Audio Codec ", React.createElement("a", null, React.createElement("i", {
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
    value: "aac"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
    className: "column"
  }, React.createElement("div", {
    className: "field"
  }, "Audio Bitrate ", React.createElement("a", null, React.createElement("i", {
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
    value: "256 kbps"
  }), React.createElement("span", {
    className: "icon is-small is-right is-success"
  }, React.createElement("i", {
    className: ""
  })))))))), React.createElement("div", {
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