import React from "react";
import "./App.css";
import Header from "./components/header/header";
import { BrowserRouter,Route } from "react-router-dom";
import Home from './pages/Home';
import CounterPage from "./pages/CounterPage";
import HandTrackingComponent from "./components/hand";
import About from "./pages/about";
import Counter from "./components/counter";

function App(){
  
  
  return(
    <BrowserRouter>
      <div>
        <Header/>
      </div>

       {/* "exact" ensures that the component is rendered only when the url is exact '/' otherwise it will be always rendered */}
      <Route path='/' component={Home} exact/>
      <Route path='/counter' component={CounterPage} />
      <Route path='/about'> <About /> </Route>
      <Route path='/bicepcurls'> <Counter exercise={"sidewaysLegRaise"} /> </Route>
      <Route path='/squats'> <Counter exercise={"sitToStand"} /> </Route>
      <Route path='/pushups'> <Counter exercise={"forwardLegRaise"} /> </Route>
      <Route path='/crunches'> <Counter exercise={"crunches"} /> </Route>
      <Route path='hands'><HandTrackingComponent/></Route>
    </BrowserRouter>
  )
}

export default App;