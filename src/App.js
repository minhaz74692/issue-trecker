import React, { useEffect, useState } from 'react';
import firestore from './firebase';
import IssueTable from './components/IssueTable';


const App = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [issue, setIssue] = useState('');
  const [status, setStatus] = useState(false);

  const issuesRef = firestore.collection('issues');
  const dataToAdd = {
    name,
    email,
    description,
    issue,
    status
  };
  const [issues, setissues] = useState([]);
  const handleAddIssue = async (e) => {
    e.preventDefault();
    await issuesRef.add(dataToAdd)
      .then((docRef) => {
        console.log('Issue added: ', docRef.id);

      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    window.location.reload();
  }
  const handleUpdateNote = async (id, newText) => {
    await issuesRef.doc(id).update({ text: newText });
    setEditNoteId(null);
  };

  const handleRemoveNote = async (id) => {
    await issuesRef.doc(id).delete();
  };



  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore.collection('issues').get();
        const data = querySnapshot.docs.map((doc) => doc.data());
        setissues(data);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container mt-5'>
      <h2 className='text-center'>Issue Treaker</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" aria-describedby="name" required value={name}
            onChange={(e) => setName(e.target.value)} />

        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" className="form-control" id="email" aria-describedby="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="issueDescription" className="form-label">Issue Description</label>
          <input type="text" className="form-control" id="issueDescription" aria-describedby="issueDescription" required value={description}
            onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* DropDown issue selection */}
        <div className='mb-3'>
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
      <button type="submit" className="btn btn-primary" onClick={handleAddIssue}>Submit</button>
      <div className='mtm-5'><h2 className='text-center'>Issue List</h2></div>
      
      <IssueTable issues = {issues}/>

    </div>
  )
}

export default App