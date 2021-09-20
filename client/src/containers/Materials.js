import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Uploadui from '../components/Uploadui.js'
import Showmaterial from '../components/Showmaterial.js'
import NavbarContainer from "./NavbarContainer";

export class Material extends Component {
  componentDidMount = () => {
    const { history } = this.props;
    if (!localStorage.jwtToken) {
      history.push("/login");
    }
  };

  render() {
    return (
      <div>
        <NavbarContainer />
        <Uploadui />
        <Showmaterial />
      </div>
    );
  }
}

Material.propTypes = {
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps)(Material);
