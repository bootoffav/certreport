import { Icon } from 'tabler-react';
import './UploadedFilesList.css';

const UploadedFilesList = ({ attachedFiles, deleteFile }: any) => (
  <div className="uploadedFiles">
    <p className="font-weight-bold">Uploaded files:</p>
    {attachedFiles.map((file: any, index: number) => (
      <p key={file.FILE_ID} className="pl-2">
        {<span className="font-weight-bold">{index + 1}</span>}.
        <a href={'https://xmtextiles.bitrix24.ru' + file.DOWNLOAD_URL}>
          {' '}
          {file.NAME} ({(Number(file.SIZE) / 1024).toFixed(2).toLocaleString()}{' '}
          Kb)
        </a>
        <Icon
          prefix="fe"
          name="trash"
          link
          className="trashFile"
          onClick={() => deleteFile(file)}
        />
      </p>
    ))}
  </div>
);

export { UploadedFilesList };
