import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/*const Alert = ({ alerts }) =>
    /*alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ))*/

const Alert = ({ alerts }) => {
    if (alerts != null && alerts.length > 0)
        return alerts.map(alert => <div key={alert.id} className={`alert alert-${alert.alertType}`}>{alert.msg}</div>)
    return null;
}
Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alert   //state.rootreducers
})

export default connect(mapStateToProps)(Alert);
