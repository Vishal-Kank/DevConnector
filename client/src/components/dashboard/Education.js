import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Education = ({ educations }) => {
    const education = educations.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td className='hide-sm'>
                <Moment format='DD/MM/YYYY' >{edu.from}</Moment>-
                {edu.to !== null ? (<Moment format='DD/MM/YYYY'>{edu.to}</Moment>) : ('NOW')}
            </td>
            <td>
                <button className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ));
    return (
        <Fragment>
            <h2 className='my-2'>Education Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Year</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{education}</tbody>
            </table>
        </Fragment>
    )
}

Education.propTypes = {
    educations: PropTypes.array.isRequired
}

export default Education;