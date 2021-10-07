import React, { Component } from "react";
import axios from "axios";
import classnames from "classnames";
import Loading from "components/Loading";
import Panel from "components/Panel";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";
import { setInterview } from "helpers/reducers";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews,
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot,
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay,
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  },
];

class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    intervieweres: {}
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) this.setState({ focused });

    
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(([days, appointments, interviewers]) => {
        this.setState({
          loading: false,
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data
        })
      })
    
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.socket.onmessage = event => {
      const {type, id, interview} = JSON.parse(event.data);
      console.log(type, id, interview);

      if(type === "SET_INTERVIEW") {
        this.setState(previousState => 
          setInterview(previousState, id, interview)  
        );
      }
    }
  };

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  };

  componentWillUnmount() {
    this.socket.close();
  }

  selectPanel(id) {
    this.setState((preveiousState) => ({
      focused: preveiousState.focused !== null ? null : id,
    }));
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    const panels = data
      .filter(
        ({ id }) => this.state.focused === null || this.state.focused === id
      )
      .map(({ id, label , getValue}) => {
        return (
          <Panel
            key={id}
            label={label}
            value={getValue(this.state)}
            onSelect={() => this.selectPanel(id)}
          />
        );
      });

    if (this.state.loading) {
      return <Loading />;
    }

    return <main className={dashboardClasses}>{panels}</main>;
  };
};

export default Dashboard;
