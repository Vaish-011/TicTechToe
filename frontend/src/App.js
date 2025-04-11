import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import JobMarket from './components/jobmarket';
import Skill from './components/skill';
import NetworkAnalysis from './components/networkanalysis';
import PersonalisedCareer from './components/personalisedcareer';
import ResumeAndInterview from './components/resumeandinterview';
import Home from './components/home'; // ✅ Import Home component

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/jobmarket' element={<JobMarket />} />
          <Route path='/networkanalysis' element={<NetworkAnalysis />} />
          <Route path='/resumeinterview' element={<ResumeAndInterview />} />
          <Route path='/personalised' element={<PersonalisedCareer />} />
          <Route path='/skill' element={<Skill />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
