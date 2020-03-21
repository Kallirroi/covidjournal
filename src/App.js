import React, {useState, useEffect} from 'react';
import dotenv from 'dotenv'; 

import './App.css';

dotenv.config()
const process_api_key = process.env.REACT_APP_AIRTABLE_API_KEY;
const airtable_api_url = process.env.REACT_APP_AIRTABLE_API_URL;
const airtable_table = process.env.REACT_APP_AIRTABLE_TABLE;
const airtable_base = process.env.REACT_APP_AIRTABLE_BASE; 

function App() {

  const [airtableData, setAirtableData] = useState([]);
  const [Notes, setNotes] = useState('');
  const [URL, setURL] = useState('');
  const [Thumbnail, setThumbnail] = useState('');

  useEffect(()=>{
    fetch(`${airtable_api_url}/${airtable_base}/${airtable_table}?sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc`, {
       "headers": {"Authorization": `Bearer ${process_api_key}`}
    })
    .then(res => res.json())
    .then((data) => {
      setAirtableData(data.records)
    })
  },[])


  function showDetails(e) {
    e.preventDefault();
    const elementKey = e.target.id;
    setNotes(airtableData[elementKey].fields.Notes)
    setURL(airtableData[elementKey].fields.URL)
    setThumbnail(airtableData[elementKey].fields.Attachments ? airtableData[elementKey].fields.Attachments[0].thumbnails.large.url : null)
  }

  function hideDetails() {
    setNotes('')
    setURL('')
    setThumbnail('')
  }

  return (
    <div className='App'>
      <div className='title'>journal</div>
      <div className='subtitle'>during some strange times / best viewed on desktop</div>
      <main> 

        <div className='details'>
          {Thumbnail && <div className='image'><img src={Thumbnail} width='50%' alt='thumbnail' /></div> }
          <div className='notes'>{Notes}</div>
          <div className='URL'><a href={URL} target='_blank' rel="noopener noreferrer">{URL}</a></div>
        </div> 

        <div className='entries'>
          { airtableData !== undefined && 
            airtableData.map( (row, i) => (
              <div className='row' key={i}> 
                <div className='name' id={i} onClick={(e) => showDetails(e)} >{row.fields.Name} | {row.createdTime.slice(5, 10)}</div>
              </div>
            ))
          }
        </div>
        </main> 
        <div className='credits'>Made by <a href="https://kalli-retzepi.com/" target='_blank' rel="noopener noreferrer" >Kalli</a> during her time at the <a href="https://www.recurse.com/" target='_blank' rel="noopener noreferrer">Recurse Center</a>.</div>    
    </div>
  );
}

export default App;
