import React, { Component} from 'react';


import './App.css';
import Navigation from './components/navigation/navigation';
import FaceRecognition from './components/facerecognition/facerecognition';
import Signin from './components/Signin/Signin';
import Logo from './components/logo/logo';
import Imagelinkform from './components/imagelinkform/imagelinkform';
import Register from './components/register/register';
import 'tachyons';
import Rank from './components/rank/rank';
import Particles from 'react-particles-js';











const particlesOptions ={
  particles:{
    number:{
      value: 150,
      density:{
        enable: true,
        value_area:700
      }
        
      
    }
  }
}

const initialState={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{
     
        id:'',
        name:'',
        email:'',
    
     
        entries:0,
        joined:''
      }

}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
      
    
  }

  loadUser =(data) =>{
    this.setState({user : {
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined


    }})
  }
 

 

  calculatefacelocation =(data) =>{
    const clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image= document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return{
      leftcol:clarifaiface.left_col * width,
      toprow:clarifaiface.top_row * height,
      rightcol: width - (clarifaiface.right_col *width),
      bottomrow:height -(clarifaiface.bottom_row * height),



    }

  }
  displayfacebox=(box) =>{
    this.setState({box:box});
    console.log(box);
  }
  onInputChange =(event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit =() =>{
    this.setState({imageUrl:this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json',
    },
      body:JSON.stringify({
        input: this.state.input
      })
    })
    .then(response =>response.json())


   
      .then(response =>{
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json',
          },
            body:JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            
            .then(count => {
             this.setState(Object.assign(this.state.user,{entries:count}))
            })
            .catch(console.log)
          
        
      

        }
        this.displayfacebox (this.calculatefacelocation(response))
      })
       
      .catch(err => console.log(err));
      
     

     }

    onRouteChange =(route) =>{
      if(route ==='signout')
      {
        this.setState(initialState)
      }else if(route ==='home')
      {
        this.setState({isSignedIn:true})
      }
      this.setState({route: route});
    }
    
      
    
  
  render() {
    const {isSignedIn,imageUrl,route,box} =this.state;
    return (
      <div className="App">
      <Particles className='particles'
               params={particlesOptions} 
               />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route ==='home'
        ? <div> 
              <Logo />
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries}
              />
              <Imagelinkform
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
             />
          
              <FaceRecognition box={box} imageUrl={imageUrl} />
         </div>
         :(
           route ==='signin'
           ?<Signin loadUser ={this.loadUser}onRouteChange={this.onRouteChange}/>
           :<Register loadUser={this.loadUser}onRouteChange={this.onRouteChange}/>
         )

         
          
              

          
         
        }
        </div>
         
        
      

    );
  }
  
  
}

export default App;
