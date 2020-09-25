import React from 'react';
import { Icon } from 'tabler-react';
import './UploadedFilesList.css';

const UploadedFilesList = ({ attachedFiles, deleteFile }: any) => 
  <div className="uploadedFiles">
    <p className="font-weight-bold">Uploaded files:</p>
    {attachedFiles.map((file: any, index: number) =>
        <p key={file.FILE_ID} className="pl-2">
            {<span className="font-weight-bold">{index + 1}</span>}. {file.NAME}
            <Icon
                prefix="fe"
                name="trash"
                link
                className="trashFile"
                onClick={(e: any) => {
                    e.currentTarget.outerHTML = '<a class="icon"><i class="fe fe-loader trashFile"></i></a>';
                    deleteFile(file);
                    e.preventDefault();
                }}
            />
        </p>
    )}
  </div>

export { UploadedFilesList };