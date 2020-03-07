import React from 'react';
import './UploadedFilesList.css';

const UploadedFilesList = ({ attachedFiles, deleteFile }: any) => {
  return <div className="uploadedFiles">
    <p className="font-weight-bold">Uploaded files:</p>
    {attachedFiles.map((file: any) =>
      <p key={file.FILE_ID}>{file.NAME}<button type="button" className="btn btn-link" onClick={({ currentTarget }: any) => {
        currentTarget.innerText = 'wait...';
        deleteFile(file);
      }}>X</button></p>
    )}
  </div>
}

export default UploadedFilesList;