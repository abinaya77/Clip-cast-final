import React from 'react';
import styled from 'styled-components';

const VideoList = ({ videos }) => {
  return (
    <VideoListStyled>
      {videos.map((video) => (
        <div key={video._id} className="video-item">
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          <video src={video.videoUrl} controls />
        </div>
      ))}
    </VideoListStyled>
  );
};

const VideoListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  
  .video-item {
    width: 100%;
    max-width: 300px;
    background: #262626;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 3px 5px 15px rgba(0, 0, 0, 0.2);
    color: white;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
  }

  video {
    width: 100%;
    border-radius: 10px;
  }
`;

export default VideoList;
