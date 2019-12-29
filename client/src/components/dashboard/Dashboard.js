import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = ({ getCurrentProfile, profile: { profile, loading }, auth }) => {

    useEffect(() => {
        getCurrentProfile()
    }, []);

    return loading && profile === null ? <Spinner /> : <Fragment>Test</Fragment>;

}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);