import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './components/Main';
import JobMarket from './components/jobmarket';
import Skill from './components/skill';
import NetworkAnalysis from './components/networkanalysis';
import PersonalisedCareer from './components/personalisedcareer';
import ResumeAndInterview from './components/resumeandinterview';
import Home from './components/home';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import TrendingJobs from './components/Trendingjobs';
import Dashboard from './components/dashboard';
import RecommendJob from './components/recommendjob';
import Coursematerial from './components/Coursematerial';
import JobRecommend  from './components/jobrecommend';

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
          <Route path='/create' element={<CreateAccount/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/trendingjob' element={<TrendingJobs/>}/>
          <Route path='/main' element={<Main/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/recommended' element={<RecommendJob/>}/>
          <Route path='/coursematerial' element={<Coursematerial />} />
          <Route path='/jobrecommend' element={<JobRecommend />} />
        
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
