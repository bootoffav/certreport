import React from 'react';
import { Icon } from 'tabler-react';
import { AttachedFile } from '../../Task/types';
import './OtherFilesList.css';

interface FileViewProps {
  file?: AttachedFile;
  deleteFile?: any;
  fileNamePlaceholder?: string;
}
function FileView(props: FileViewProps) {
  return props.file ? (
    <>
      <a href={'https://xmtextiles.bitrix24.ru' + props.file.DOWNLOAD_URL}>
        {' '}
        {props.file.NAME} (
        {(Number(props.file.SIZE) / 1024).toFixed(2).toLocaleString()} Kb)
      </a>
      <Icon
        prefix="fe"
        name="trash"
        link
        className="trashFile"
        onClick={() => props.deleteFile(props.file)}
      />
    </>
  ) : (
    <>{props.fileNamePlaceholder}</>
  );
}

interface IUploadedFilesList {
  attachedFiles: AttachedFile[];
  deleteFile: (file: AttachedFile) => void;
}

const OtherFilesList = (props: IUploadedFilesList) => {
  return (
    <div className="uploadedFiles">
      <p className="font-weight-bold">Other files:</p>
      {props.attachedFiles.map((file: AttachedFile, index: number) => (
        <p key={file.FILE_ID} className="pl-2">
          {<span className="font-weight-bold">{index + 1}</span>}.
          <FileView file={file} deleteFile={props.deleteFile} />
        </p>
      ))}
    </div>
  );
};

export { OtherFilesList, FileView };
