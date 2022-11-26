import React, { Component } from 'react'
import {movies} from '../movieData'
export class Banner extends Component {
  render() {
    let movieElem= movies.results[Math.floor(Math.random()*10)]
    let backdrop=movieElem.backdrop_path
    let title=movieElem.title
    let description=movieElem.overview
    return (

       <div className="card banner-card">
       <img src={`https://image.tmdb.org/t/p/original//${backdrop}`} className="card-img-top banner-img" alt="..."/>
       
         <h5 className="card-title banner-title">{title}</h5>
         <p className="card-text banner-text">{description}</p>

       
     </div>
    )
  }
}

export default Banner

