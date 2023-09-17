
import './Assets/main.css'
import Authentication from './auth/Authentication';
import UnAuthentication from './auth/UnAuthentication';
let token = localStorage.getItem("token")
function App() {
  
  if(token){
    return <Authentication/>
  }
  else{
    return <UnAuthentication/>
  }
}

export default App;
