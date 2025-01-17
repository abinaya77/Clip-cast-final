import React from 'react';
import styled from 'styled-components';
import Button from './Button';

function Upload({ onClose }) {
  const [video, setVideo] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [label, setLabel] = React.useState('Upload your video...');
  const [loading, setLoading] = React.useState(false);

  const handleTextChange = (name) => (e) => {
    if (name === 'title') {
      setTitle(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
    setLabel('Your Video: ' + e.target.files[0].name);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (title && video) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', video);

      try {
        const res = await fetch('https://clip-cast-server.onrender.com/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          onClose(true); // Trigger the parent component's success handler
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }

      setLoading(false);
      setTitle('');
      setDescription('');
      setVideo(null);
      setLabel('Upload your video...');
    } else {
      alert('Please enter a title and select a video file');
      setLoading(false);
    }
  };

  return (
    <UploadStyled>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <div className="input-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter Title"
            value={title}
            onChange={handleTextChange('title')}
          />
        </div>
        <div className="input-control">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            placeholder="Enter description here..."
            id="description"
            cols="30"
            rows="6"
            value={description}
            onChange={handleTextChange('description')}
          ></textarea>
        </div>
        <div className="input-control upload-con">
          <label htmlFor="video">Video Upload</label>
          <div className="inner-input">
            <label
              className="inner-label"
              htmlFor="video"
              style={{ color: video ? '#00b894' : 'rgb(74 74 74)' }}
            >
              {label}
            </label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              hidden
              onChange={handleVideo}
            />
          </div>
          <div className="upload-btn">
            <Button
              name="Upload"
              icon={<i className="fas fa-upload"></i>}
              bg="#00b894"
              type="submit"
              disabled={loading}
            />
          </div>
        </div>
      </form>
      <button onClick={() => onClose(false)}>Close</button>
    </UploadStyled>
  );
}


const UploadStyled = styled.div`
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  background: #262626;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 3px 5px 30px rgba(255, 255, 255, 0.1);
  h2 {
    color: #fff;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    .input-control {
      display: flex;
      flex-direction: column;
      input,
      textarea {
        padding: 0.8rem 1rem;
        border: 1px solid rgb(74 74 74);
        border-radius: 5px;
        outline: none;
        resize: none;
        background: transparent;
        color: #fff;
      }
      label {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: #fff;
        opacity: 0.9;
      }
    }
    .inner-input {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed rgb(74 74 74);
      border-radius: 5px;
      padding: 1rem;
      cursor: pointer;
      height: 90px;
      position: relative;
      padding: 1rem;
      .inner-label {
        cursor: pointer;
        margin: 0;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(74 74 74);
      }
    }
    .upload-btn {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
    }
  }
`;

export default Upload;
