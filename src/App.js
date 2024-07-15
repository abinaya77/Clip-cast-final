import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VideoJS from './Components/VideoJS';
import VideoPlayer from './Components/VideoPlayer';
import Upload from './Components/Upload';
import Button from './Components/Button';
import SearchBar from './Components/SearchBar';
import VideoList from './Components/VideoList';

const App = () => {
  const [modal, setModal] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const titlesPerPage = 5; // Number of titles per page

  useEffect(() => {
    fetchVideoList();
  }, []);

  const fetchVideoList = () => {
    fetch('https://clip-cast-server.onrender.com/api/videos')
      .then(response => response.json())
      .then(data => {
        const videoUrls = data.videos.map(video => ({
          id: video._id,
          name: video.title,
          url: `/videos/${video.filename}`,
          description: video.description // Assuming video description is available
        }));
        setVideoList(videoUrls);
        if (videoUrls.length > 0) {
          setCurrentVideo(videoUrls[0]); // Set the first video as the current video initially
        }
        console.log('Fetched video list:', videoUrls); // Debug log
      })
      .catch(error => console.error('Error fetching videos:', error));
  };

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: currentVideo ? [{ src: `https://clip-cast-server.onrender.com${currentVideo.url}`, type: 'video/mp4' }] : [],
  };

  const handlePlayerReady = (player) => {
    console.log('Player is ready:', player);
  };

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUploadClose = (isUploaded) => {
    setModal(false);
    if (isUploaded) {
      fetchVideoList(); // Refresh the video list after uploading
    }
  };

  const handleSearch = (searchQuery) => {
    // Construct the URL based on whether there's a search query or not
    const url = searchQuery
      ? `https://clip-cast-server.onrender.com/api/search?q=${searchQuery}`
      : 'https://clip-cast-server.onrender.com/api/videos';
    
    console.log("Fetching from URL:", url);
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Response data:', data);
  
        // Adjust based on the actual response structure
        const videoList = searchQuery ? data : data.videos;
  
        if (Array.isArray(videoList)) {
          // Process the video list to match the required format
          const videoUrls = videoList.map(video => ({
            id: video._id,
            name: video.title,
            url: `/videos/${video.filename}`,
            description: video.description
          }));
  
          console.log("Processed video URLs:", videoUrls);
          setVideoList(videoUrls);
  
          // Set the first video as the current video if there are any
          if (videoUrls.length > 0) {
            setCurrentVideo(videoUrls[0]);
          } else {
            setCurrentVideo(null); // Clear the current video if no videos are available
          }
        } else {
          console.error('Unexpected response format:', data);
          setVideoList([]);
          setCurrentVideo(null);
        }
      })
      .catch(error => console.error('Error searching videos:', error));
  };
  

  
  const totalPages = Math.ceil(videoList.length / titlesPerPage);
  const currentTitles = videoList.slice((currentPage - 1) * titlesPerPage, currentPage * titlesPerPage);

  return (
    <BrowserRouter>
      <AppStyled className="App">
        <div className="header">
          <h1 className='text-4xl font-bold'>Clip Cast</h1>
          <div className="upload">
            <Button
              name="Upload"
              icon={<i className="fas fa-plus"></i>}
              onClick={() => { setModal(true); }}
              bg="#1e90ff"
            />
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        {modal && <Upload onClose={handleUploadClose} />}
        
        
        <Routes>
          <Route path='/' element={
            <div className="content">
              
              <div className="video-list">
              <h2 className='items-center'>Titles</h2>
                <ul>
                  {currentTitles.length > 0 ? (
                    currentTitles.map((video, index) => (
                      <li
                        key={index}
                        onClick={() => handleVideoClick(video)}
                        className={currentVideo && currentVideo.url === video.url ? 'highlighted' : ''}
                      >
                        {video.name}
                      </li>
                    ))
                  ) : (
                    <p>No videos available</p>
                  )}
                </ul>
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="video-player">
                <h2 className='v-head'>Videos-section</h2>
                {currentVideo && (
                  <div>
                    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
                    <p>{currentVideo.description}</p>
                  </div>
                )}
              </div>
            </div>
          } />
          <Route path='/videos/:id' element={<VideoPlayer />} />
        </Routes>
        {modal && <div className="overlay" onClick={() => setModal(false)}></div>}
      </AppStyled>
    </BrowserRouter>
  );
}

const AppStyled = styled.div`
  padding: 3rem 10rem;
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  /* Animated Background */
  background: linear-gradient(45deg, #E9FF97, #071952, #DC0083);
  background-size: 600% 600%;
  animation: gradient 15s ease infinite;

  @keyframes gradient {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    color: #fff;
    background: linear-gradient(to right, #00b894 40%, #705DF2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .upload {
    display: flex;
    justify-content: flex-end;
    margin: 2rem 0; /* Add margins above and below */
    gap: 1rem;
  }

  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0; /* Add space above and below */
  }

  .center-text {
    text-align: right;
    margin: 0; /* Adjust margin as needed */
  }

  h2 {
    color: #fff;
    font-size: 2rem;
    margin: 0;
  }

  /* Add styles for the SearchBar if needed */
  .search-bar {
    /* Adjust width or other styles as needed */
  }

  .content {
    display: flex;
    justify-content: space-between;
  }

  .video-list {
    flex: 1;
    margin-right: 3rem;
    text-align: center;
  }

  .video-player {
    flex: 2;
    text-align: center; /* Center the content horizontally */
    border: 1px solid white; /* Add a white border around the div */
  padding: 1rem;
  }
  
  .v-head{
     
     margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    cursor: pointer;
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    margin: 0.5rem 0;
    border-radius: 5px;
    transition: background 0.3s;
  }

  li:hover {
    background: #ddd;
  }

  .highlighted {
    background: #1e90ff;
    color: #fff;
  }

  p {
    color: #fff;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem; /* Ensure pagination is below title section */
  }

  .pagination button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background: #f0f0f0;
    cursor: pointer;
    transition: background 0.3s;
  }

  .pagination button:hover {
    background: #ddd;
  }

  .pagination .active {
    background: #1e90ff;
    color: #fff;
  }
`;



export default App;
