import React from 'react';

import styles from './autocomplete.css';
import { IconSearch, IconVideoPlayer } from './svgIcon.js'

function MovieItem(props) {
  return (
    <div className={styles.movieItem} onClick={() => props.onClick()}>
      <div className={styles.movieItemTitle}>{props.value.title}</div>
      <div className={styles.movieItemDetails}>{`${parseFloat(props.value.vote_average).toFixed(1)} Rating, ${props.value.release_date.slice(0, 4)}`}</div>
    </div>
  );
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: '', movies: [], enabled: false };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleMovieSelectEvent = this.handleMovieSelectEvent.bind(this);
  }

  fetchData(query) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&language=en-US&query=${query}&page=1&include_adult=false`)
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({
            movies: res.results.slice(0, 8)
          });
        },
        (error) => {
          alert("Error while downloading")
        }
      )
  }

  handleInputChange(event) {
    this.setState({
      query: event.target.value,
      enabled: event.target.value.length > 0,
      movies: event.target.value.length < 3 ? [] : this.state.movies
    }, () => {
      if (this.state.query && this.state.query.length >= 3) {
        this.fetchData(this.state.query)
      }
    })
  }

  handleMovieSelectEvent(title) {
    this.setState({
      enabled: false,
      query: title
    })
  }

  renderMoviesList() {
    return (
      this.state.enabled && (
        <div className={styles.moviesList}>
          {this.state.movies.map((object) => <MovieItem value={object} key={object.id} onClick={() => this.handleMovieSelectEvent(object.title)} />)}
        </div>
      )
    )
  }

  renderInputBarRow() {
    return (
      <div className={styles.inputBar}>
        <div className={styles.iconWrapper}>
          <IconVideoPlayer className={styles.iconVideoWhite} />
        </div>
        <div className={this.state.enabled ? styles.inputWrapper : null}>
          {this.state.enabled && (<div className={`${styles.iconWrapper} ${styles.inputIconWrapper}`}>
            <IconVideoPlayer className={styles.iconVideoBlack} />
          </div>)}
          <input value={this.state.query} onChange={this.handleInputChange} className={styles[this.state.enabled ? 'inputWithText' : 'input']} placeholder="Enter a movie name" />
          {this.state.enabled && <div className={styles.inputLowerText}>Enter a movie name</div>}
        </div>
      </div>
    )
  }

  renderSearchIcon(){
    return (
      !this.state.enabled ? <div className={styles.iconWrapperSearch}><IconSearch /></div> : null      
    )
  }

  render() {
    return (
      <div className={`${styles.content} ${this.state.enabled ? null : styles['contentWithText']}`}>
        {this.renderInputBarRow()}
        {this.renderSearchIcon()}
        {this.renderMoviesList()}
      </div>
    )
  }
}

const Autocomplete = () => (
  <div className={styles.container}>
    <Search />
  </div>
);

export default Autocomplete;
