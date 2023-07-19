import React from 'react'

const IssueTable = (props) => {
  return (
    <div className='container mt-1'>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email Id</th>
              <th scope="col">Issue Type</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Edit/Delete</th>

            </tr>
          </thead>
          <tbody>
            {props.issues.map((issue, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{issue.name}</td>
                <td>{issue.email}</td>
                <td>{issue.issue}</td>
                <td>{issue.description}</td>
                <td>{issue.status == false ? 'pending' : 'Done'}</td>
                <td>
                  <i className="fas fa-edit me-3 ms-3" title='Edit Issue'></i>
                  <i className="fas fa-trash " title='Delete Issue'></i>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>
  )
}

export default IssueTable