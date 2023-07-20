import React, { useEffect, useState } from 'react';
import firestore from './firebase';
import IssueTable from './components/IssueTable';
import { v4 as uuidv4 } from "uuid";


const App = (props) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [issue, setIssue] = useState('');
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('');
  const [updateStart, setUpdateStart] = useState(false);

  // Handle update and submit button visibility
  const handleUpdateStatus = (id,name, email, des, issue) => {
    setId(id)
    setUpdateStart(true);
    setName(name);
    setEmail(email);
    setDescription(des);
    setIssue(issue);
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For smooth scrolling
    });
  }

  const issuesRef = firestore.collection('issues');
  const dataToAddorUpdate = {
    id: uuidv4(),
    name,
    email,
    description,
    issue,
    status
  };
  const [issues, setIssues] = useState([]);

  const scrollToBottom = () => {
    const bottomElement = document.getElementById('bottomElement');
    bottomElement.scrollIntoView({ behavior: 'smooth' });
  };

  const fieldClear = () => {
    setName('');
    setEmail('');
    setDescription('');
    setIssue('');
  }

  // Add new Issue
  const handleAddIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOperation('...adding');
    const querySnapshot = await issuesRef.where('email', '==', email).get();

    let isAnyDocumentWithFalseStatus = true;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === false) {
        isAnyDocumentWithFalseStatus = false;
      }
      // console.log(isAnyDocumentWithTrueStatus);
    });
    querySnapshot.docs.length > 0 && isAnyDocumentWithFalseStatus ===false ? window.alert('you can not add more then one issue with same email with pending status.') :
      dataToAddorUpdate.email != '' && dataToAddorUpdate.issue != '' ? await issuesRef.add(dataToAddorUpdate)
        .then((docRef) => {
          console.log('Issue added: ', docRef.id);
          fieldClear();
          scrollToBottom();
          setIssues([...issues, dataToAddorUpdate]);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        }) : window.alert('Email and Issue are Required');
    setLoading(false);

  }

  // Edit Issue
  const handleEditIssue = async (email, newData) => {
    setLoading(true);
    setOperation('...updating');
    try {
      const querySnapshot = await issuesRef.where('email', '==', email).get();

      const batch = firestore.batch();
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, newData);
      });

      await batch.commit();
      fieldClear();
      setIssues(issues.map((issue) => {
        return issue.email === email ? { ...dataToAddorUpdate } : issue;
      }));
      console.log('Issue updated successfully.');
    } catch (error) {
      console.error('Error updating documents:', error);
    }
    setLoading(false);
    setUpdateStart(false);
  };

  // Handle Issue Status
  const handleStatus = async (id, newData) => {
    setLoading(true);
    try {
      const querySnapshot = await issuesRef.where('id', '==', id).get();

      const batch = firestore.batch();
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, newData);
      });

      await batch.commit();
      
      setIssues(issues.map((issue) => {
        return issue.id === id ? {id: issue.id,name:issue.name, email: issue.email, description: issue.description, issue: issue.issue, status : issue.status=== true?false:true } : issue;
      }));
    } catch (error) {
      console.error('Error updating documents:', error);
    }
    setLoading(false);
  };

  // Delete Issue
  const handleDelete = async (id) => {
    setLoading(true);
    setOperation('...deleting');
    try {
      const querySnapshot = await issuesRef.where('id', '==', id).get();
      const batch = firestore.batch();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      const newIssueList = issues.filter((issue) => {
        return issue.id !== id;
      });
      setIssues(newIssueList);
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
    setLoading(false);
  };

  // Fetch Firestore data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore.collection('issues').get();
        const data = querySnapshot.docs.map((doc) => doc.data());
        setIssues(data);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container mt-2'>
      <div className='col-6 ms-auto me-auto'>
        <h2 className='text-center'>Issue Tracker</h2>
        <form>
          <div className="mb-2">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" aria-describedby="name" required value={name}
              onChange={(e) => setName(e.target.value)} />

          </div>
          <div className="mb-2">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input type="email" className="form-control" id="email" aria-describedby="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-2">
            <label htmlFor="issueDescription" className="form-label">Issue Description</label>
            <input type="text" className="form-control" id="issueDescription" aria-describedby="issueDescription" required value={description}
              onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* DropDown issue selection */}
          <div className='mb-2'>
            <label htmlFor="issue" className=''>Choose a type of issue:</label>
            <select id="issue" name="issue" className='ms-3 rounded py-2 px-5' required value={issue}
              onChange={(e) => setIssue(e.target.value)}>
              <option value="select issue inactive">-Select a Issue-</option>
              <option value="Slow Speed">Slow Speed</option>
              <option value="Connection Drop">Connection Drop</option>
              <option value="No Connection">No Connection</option>
            </select>
          </div>


        </form>
        <button type="submit" className="btn btn-primary" style={{ 'display': updateStart ? 'none' : 'block' }} onClick={handleAddIssue} >Submit</button>

        <button type="submit" className="btn btn-primary" style={{ 'display': updateStart ? 'block' : 'none' }} onClick={() => handleEditIssue(email, dataToAddorUpdate)} >Update Issue</button>

      </div>

      {loading === true ? <div className="d-flex justify-content-center"><div className="spinner-border " role="status" style={{'width': '3rem', 'height': '3rem'}}>
        <span className="visually-hidden">Loading...</span></div><h4 className='ms-3'>{operation}</h4>
      </div> :<div></div>}
      <div className='mt-5'><h2 className='text-center'>Issue List</h2></div>

      { issues.length > 0 ? <IssueTable issues={issues} handleEdit={handleEditIssue} delete={handleDelete} updateStart={updateStart} updateStatus={handleUpdateStatus} handleStatus={handleStatus} /> : <div className='mt-2 mb-6'><h3 className='text-center'>No issue added yet.</h3></div>}
      <div id="bottomElement" className='m-5'></div>

    </div>
  )
}

export default App