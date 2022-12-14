import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Button from "@mui/material/Button";
import { TextField, touchRippleClasses } from "@mui/material";
import "./projectv2.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { createStore } from "state-pool";
import { activeUser } from "../login/login";

// let names = [];

async function getDescription(username, projectName) {
  let user = username.toString();
  let project = projectName.toString();
  const url = "/getDescription/" + user + "/" + project;
  const response = await fetch(url);
  const data = await response.text();
  return data;
}

async function getAllProjects(username) {
  let user = username.toString();
  const url = "/getAllProjects/" + user;
  const response = await fetch(url);
  const data = await response.json();
  // names = data;
  return data;
}
async function getProjectId(username, projectName) {
  let user = username.toString();
  let proj_name = projectName.toString();
  const url = "/getProjID/" + user + "/" + projectName;
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
async function getCPUCheckedOut(username, projectName) {
  let user = username.toString();
  const url = "/getCPU/" + user + "/" + projectName;
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
async function getGPUCheckedOut(username, projectName) {
  let user = username.toString();
  const url = "/getGPU/" + user + "/" + projectName;
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
async function getTotalCPUAvailable() {
  const url = "/getAvailability/CPU";
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
async function getTotalGPUAvailable() {
  const url = "/getAvailability/GPU";
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
async function checkInBE(username, projectName, itemName, quantity) {
  const url =
    "/checkInUser/" +
    username +
    "/" +
    projectName +
    "/" +
    itemName +
    "/" +
    quantity;
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
async function checkOutBE(username, projectName, itemName, quantity) {
  const url =
    "/checkOutUser/" +
    username +
    "/" +
    projectName +
    "/" +
    itemName +
    "/" +
    quantity;
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function MultipleSelectCheckmarks(props) {
  const [personName, setPersonName] = React.useState([]);
  const [names, setNames] = React.useState([]);
  //getAllProjects(props.user);
  const getData = () => {
    fetch("/getAllProjects/" + props.user)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setNames(myJson);
      });
  };
  useEffect(() => {
    getData();
  });

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
    props.parentInputChange(value);
  };

  return (
    <div>
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-simple-select-label">Project List</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={personName}
            label="Age"
            onChange={handleChange}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        {/* <SingleProject id= "mainProject" user = {"saleh"} projectName = {projectI} onChange></SingleProject> */}
      </div>
    </div>
  );
}

function GenButton(props) {
  return (
    <Button className="Button" variant="outlined" onClick={props.onClick}>
      {props.value}
    </Button>
  );
}

function JoinButton(props) {
  return (
    <Button className="Button" variant="contained" onClick={props.onClick}>
      {props.value}
    </Button> //Material UI Component 1
  );
}

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinButton: "Join",
      isJoined: false,
      set1CheckedOut: 0,
      set2CheckedOut: 0,
      set1Val: 0,
      set2Val: 0,
      cpuAvailable: 50,
      gpuAvailable: 100,
      proj_id: 0,
      description: "",
    };
    //this.initializeVals();
    this.initializeVals = this.initializeVals.bind(this);
    this.handleGenClick = this.handleGenClick.bind(this);
    this.handleSet1Change = this.handleSet1Change.bind(this);
    this.handleSet2Change = this.handleSet2Change.bind(this);
  }

  async initializeVals() {
    let initCPUVal = await getCPUCheckedOut(
      localStorage.getItem("CurrentUser"),
      //activeUser.getValue(),
      this.props.value
    );
    let initGPUVal = await getGPUCheckedOut(
      localStorage.getItem("CurrentUser"),
      //   activeUser.getValue(),
      this.props.value
    );
    let id = await getProjectId(
      localStorage.getItem("CurrentUser"),
      this.props.value
    );
    let desc = await getDescription(
      localStorage.getItem("CurrentUser"),
      this.props.value
    );

    // console.log(initCPUVal);
    // console.log(initGPUVal);
    this.setState({
      set1CheckedOut: initCPUVal,
      set2CheckedOut: initGPUVal,
      set1Val: initCPUVal,
      set2Val: initGPUVal,
      proj_id: id,
      description: desc,
    });
    // console.log(this.state.set1CheckedOut);
    // console.log(this.state.set2CheckedOut);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.value != this.props.value) {
      await this.initializeVals();
      await this.updateCPUCap();
      await this.updateGPUCap();
    }
    // this.initializeVals = this.initializeVals.bind(this);
    // this.handleGenClick = this.handleGenClick.bind( this);
    // this.handleSet1Change = this.handleSet1Change.bind(this);
    // this.handleSet2Change = this.handleSet2Change.bind(this);
  }
  async updateCPUCap() {
    let av = await getTotalCPUAvailable();
    this.setState({
      cpuAvailable: av,
    });
  }
  async updateGPUCap() {
    let av = await getTotalGPUAvailable();
    this.setState({
      gpuAvailable: av,
    });
  }
  async handleGenClick(name, set) {
    if (name === "Check In") {
      if (set === "Set1") {
        //CPU
        let enteredVal = this.state.set1Val;
        if (Number(enteredVal) > this.state.set1CheckedOut) {
          if (
            window.confirm(
              "You asked to check in more CPU items than what you have checked out. Would you like to check in all your CPU items?"
            )
          ) {
            document.getElementById("outlinedset1").value = "";
            let num = await checkInBE(
              localStorage.getItem("CurrentUser"),
              //   activeUser.getValue(),
              this.props.value, //project name
              "CPU",
              this.state.set1Val
            );
            this.setState({
              set1CheckedOut: Number(
                Number(this.state.set1CheckedOut) - Number(num)
              ),
            });
            await this.updateCPUCap();
          }
        } else {
          document.getElementById("outlinedset1").value = "";
          let num = await checkInBE(
            localStorage.getItem("CurrentUser"),
            //   activeUser.getValue(),
            this.props.value, //project name
            "CPU",
            this.state.set1Val
          );
          this.setState({
            set1CheckedOut: Number(
              Number(this.state.set1CheckedOut) - Number(num)
            ),
          });
          await this.updateCPUCap();
        }
      } else {
        let enterVal = this.state.set2Val;
        if (Number(enterVal) > this.state.set2CheckedOut) {
          if (
            window.confirm(
              "You asked to check in more GPU items than what you have checked out. Would you like to check in all your GPU items?"
            )
          ) {
            document.getElementById("outlinedset2").value = "";
            let num = await checkInBE(
              localStorage.getItem("CurrentUser"),
              //   activeUser.getValue(),
              this.props.value,
              "GPU",
              this.state.set2Val
            );
            this.setState({
              set2CheckedOut: Number(
                Number(this.state.set2CheckedOut) - Number(num)
              ),
            });
            await this.updateGPUCap();
          }
        } else {
          document.getElementById("outlinedset2").value = "";
          let num = await checkInBE(
            localStorage.getItem("CurrentUser"),
            //   activeUser.getValue(),
            this.props.value,
            "GPU",
            this.state.set2Val
          );
          this.setState({
            set2CheckedOut: Number(
              Number(this.state.set2CheckedOut) - Number(num)
            ),
          });
          await this.updateGPUCap();
        }
      }
    } else {
      if (set === "Set1") {
        //CPU
        let enterVal = this.state.set1Val;
        if (Number(enterVal) > this.state.cpuAvailable) {
          if (
            window.confirm(
              "You asked to check out more CPU items than what is available. Would you like to check out all remaining CPU items?"
            )
          ) {
            document.getElementById("outlinedset1").value = "";
            let num = await checkOutBE(
              localStorage.getItem("CurrentUser"),
              //   activeUser.getValue(),
              this.props.value,
              "CPU",
              this.state.set1Val
            );
            this.setState({
              set1CheckedOut: Number(
                Number(this.state.set1CheckedOut) + Number(num)
              ),
            });
            await this.updateCPUCap();
          }
        } else {
          document.getElementById("outlinedset1").value = "";
          let num = await checkOutBE(
            localStorage.getItem("CurrentUser"),
            //   activeUser.getValue(),
            this.props.value,
            "CPU",
            this.state.set1Val
          );
          this.setState({
            set1CheckedOut: Number(
              Number(this.state.set1CheckedOut) + Number(num)
            ),
          });
          await this.updateCPUCap();
        }
      } else {
        let input = this.state.set2Val;
        console.log(this.state.gpuAvailable);

        console.log(input);
        console.log(input > this.state.gpuAvailable);
        if (Number(input) > this.state.gpuAvailable) {
          if (
            window.confirm(
              "You asked to check out more GPU items than what is available. Would you like to check out all remaining GPU items?"
            )
          ) {
            document.getElementById("outlinedset2").value = "";
            let num = await checkOutBE(
              localStorage.getItem("CurrentUser"),
              //   activeUser.getValue(),
              this.props.value,
              "GPU",
              this.state.set2Val
            );
            this.setState({
              set2CheckedOut: Number(
                Number(this.state.set2CheckedOut) + Number(num)
              ),
            });
            await this.updateGPUCap();
          }
        } else {
          document.getElementById("outlinedset2").value = "";
          let num = await checkOutBE(
            localStorage.getItem("CurrentUser"),
            //   activeUser.getValue(),
            this.props.value,
            "GPU",
            this.state.set2Val
          );
          this.setState({
            set2CheckedOut: Number(
              Number(this.state.set2CheckedOut) + Number(num)
            ),
          });
          await this.updateGPUCap();
        }
      }
    }
  }
  renderJoinButton() {
    return (
      <JoinButton
        value={this.state.joinButton}
        onClick={() => this.handleClick()}
      />
    );
  }
  renderGenButton(name, set) {
    return (
      <GenButton
        id={set}
        value={name}
        onClick={() => this.handleGenClick(name, set)}
      />
    );
  }
  handleSet1Change(param) {
    this.setState({
      set1Val: param,
    });
  }
  handleSet2Change(param) {
    this.setState({
      set2Val: param,
    });
  }
  render() {
    return (
      <div className="Project">
        <div className="PName">
          <h1>{this.props.value}</h1>
        </div>
        <div className="proj-id">
          <p>ID: {this.state.proj_id}</p>
        </div>
        <div class="description">
          <p>{this.state.description}</p>
        </div>
        <div className="Set1">
          <b id="b">
            CPU: {this.state.set1CheckedOut} checked out ,{" "}
            {this.state.cpuAvailable} available
          </b>
          <TextField
            id="outlinedset1"
            label="Enter Qty"
            variant="outlined"
            onChange={(event) => this.handleSet1Change(event.target.value)}
          />
          {this.renderGenButton("Check In", "Set1")}
          {this.renderGenButton("Check Out", "Set1")}
          {/* {this.renderJoinButton()}                    */}
        </div>
        <div className="Set2">
          <b id="b">
            GPU: {this.state.set2CheckedOut} checked out ,{" "}
            {this.state.gpuAvailable} available
          </b>

          <TextField
            id="outlinedset2"
            label="Enter Qty"
            variant="outlined"
            onChange={(event) => this.handleSet2Change(event.target.value)}
          />
          {this.renderGenButton("Check In", "Set2")}
          {this.renderGenButton("Check Out", "Set2")}
        </div>
      </div>
    );
  }
}

class ProjectsV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "Select your project from the dropdown",
    };
    // console.log(store.getState("activeUser"));
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(name) {
    this.setState({
      projectName: name,
    });
  }
  render() {
    return (
      <div>
        <div>
          <MultipleSelectCheckmarks
            user={localStorage.getItem("CurrentUser")}
            //user={activeUser.getValue()}
            parentInputChange={this.onInputChange}
          ></MultipleSelectCheckmarks>
        </div>
        <div className="Projects" id="projects">
          <div className="Entrys" id="entries">
            <Entry value={this.state.projectName} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectsV2;
