// src/components/SearchResults/SearchResults.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MovieItem from '../MovieItem/MovieItem';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);
  const loader = useRef(null); // Define the loader ref
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Ensure setTotalPages is defined

  const fetchMovies = (page) => {
    if (searchQuery) {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        params: {
          query: searchQuery,
          include_adult: 'false',
          language: 'en-US',
          page: page,
        },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      axios
        .request(options)
        .then(function (response) {
          const filteredResults = response.data.results.filter(
            (movie) => movie.poster_path
          );
          if (page === 1) {
            setSearchResults(filteredResults);
          } else {
            setSearchResults((prevMovies) => [
              ...prevMovies,
              ...filteredResults,
            ]);
          }
          setTotalPages(response.data.total_pages);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };


  /// Added recently 
  const [testSearch, setTextSearch] = useState('Loading...');

  
  const timeSearch = () => {

    setTimeout(() => {
      setTextSearch("No result found!")
    }, 5000);
  
  } 

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
      setSearchResults([]);
      fetchMovies(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMovies(currentPage);
    }
  }, [currentPage]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="movie__list">
      <h2>Search Results for : "{searchQuery}"</h2>
      <div className="movie-grid">
        {searchResults.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>
      <div ref={loader} className="loader">
       <h2> {testSearch} </h2>
      </div>
    </div>
  );
};

export default SearchResults;
