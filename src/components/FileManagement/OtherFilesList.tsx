import React from 'react';
import { FileView } from './FileView';
import { AttachedFile } from 'Task/types';
import './OtherFilesList.css';

interface IUploadedFilesList {
  attachedFiles: AttachedFile[];
  deleteFile: (file: AttachedFile) => void;
  renameFile: (id: string, newName: string) => void;
}

const OtherFilesList = (props: IUploadedFilesList) => {
  return (
    <div className="uploadedFiles">
      <p className="font-weight-bold">Other files:</p>
      {props.attachedFiles.map((file: AttachedFile, index: number) => (
        <p key={file.FILE_ID} className="pl-2">
          {<span className="font-weight-bold">{index + 1}</span>}.
          <FileView
            file={file}
            deleteFile={props.deleteFile}
            renameFile={props.renameFile}
            otherFile
          />
        </p>
      ))}
    </div>
  );
};

export { OtherFilesList };
