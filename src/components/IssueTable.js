import React from 'react'

const IssueTable = (props) => {
  return (
    <div className='container mt-1 mb-5'>
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
              <th scope="row" id={issue.email}>{index + 1}</th>
              <td>{issue.name}</td>
              <td>{issue.email}</td>
              <td>{issue.issue}</td>
              <td>{issue.description}</td>
              <td><button type="button" className={issue.status === false ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-dark'} onClick={() => props.handleStatus(issue.id, { status: issue.status === true ? false : true })}>{issue.status === false ? 'pending' : 'Done'}</button>
              </td>
              <td>
                {issue.status === false?<i className="fas fa-edit me-3 ms-3" title='Edit Issue' onClick={() => props.updateStatus(issue.id,issue.name, issue.email, issue.description, issue.issue)}></i>: <div></div>}


                <i className="fas fa-trash " title='Delete Issue' onClick={() => props.delete(issue.id)}></i>
              </td>
            </tr>
          ))}

        </tbody>
      </table>



    </div>
  )
}

export default IssueTable