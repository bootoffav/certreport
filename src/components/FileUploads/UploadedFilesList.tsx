import React from 'react';
import { Button } from 'tabler-react';
import './UploadedFilesList.css';

const UploadedFilesList = ({ attachedFiles, deleteFile }: any) => {
  return <div className="uploadedFiles">
    <p className="font-weight-bold">Uploaded files:</p>
    {attachedFiles.map((file: any) =>
        <p key={file.FILE_ID}>{file.NAME}
            <Button className="ml-3" color="orange" size="sm" icon="trash"
                onClick={(e: any) => {
                    e.currentTarget.innerText = 'wait...';
                    deleteFile(file);
                    e.preventDefault();
                }}
            />
        </p>
    )}
  </div>
}

export default UploadedFilesList;