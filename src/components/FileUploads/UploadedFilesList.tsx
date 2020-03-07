import React from 'react';
import './UploadedFilesList.css';

const UploadedFilesList = ({attachedFiles}: any) =>
  <div className="uploadedFiles">
    <p className="font-weight-bold">Uploaded files:</p>
    {attachedFiles.map((file: any) => <p>&nbsp;&nbsp;{file.NAME}</p>)}
  </div>

export default UploadedFilesList;