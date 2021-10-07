import React, { Component } from "react";
import classnames from "classnames";
import Loading from "components/Loading";
import Panel from "components/Panel";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6,
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm",
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday",
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3",
  },
];

class Dashboard extends Component {
  state = {
    loading: false,
    focused: null,
  };

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
      .map(({ id, label, value }) => {
        return (
          <Panel
            key={id}
            label={label}
            value={value}
            onSelect={() => this.selectPanel(id)}
          />
        );
      });

    if (this.state.loading) {
      return <Loading />;
    }

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
