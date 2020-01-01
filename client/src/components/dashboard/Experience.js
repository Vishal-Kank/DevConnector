import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Experience = ({ experience }) => {
    //console.log(experience)
    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className='hide-sm'>{exp.title}</td>
            <td className='hide-sm'>
                <Moment format='DD/MM/YYYY'>{exp.from}</Moment>-{' '}
                {exp.to !== null ? (<Moment format='DD/MM/YYYY'>{exp.to}</Moment>) : ('NOW')}
            </td>
            <td> <button className='btn btn-danger'>Delete</button></td>
        </tr>
    ));
    return (
        <Fragment>
            <h2 className='my-2'>Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className='hide-sm'>Title</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
}

export default Experience;