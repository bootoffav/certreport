import { Icon } from 'tabler-react';
import { AttachedFile } from '../../Task/types';
import './UploadedFilesList.css';

const fabricTestFileNamePrefix = 'Fabric Test Application Form_';

function fileView(file: AttachedFile, deleteFile: any) {
  return (
    <>
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
    </>
  );
}

function getSpecificFile(
  { attachedFiles, deleteFile }: IUploadedFilesList,
  fileType: 'Test report' | 'Certificate'
) {
  console.log(attachedFiles);
  let file;
  if (
    attachedFiles.length > 0 &&
    !attachedFiles[0].NAME.startsWith(fabricTestFileNamePrefix)
  ) {
    file = attachedFiles.shift();
  }

  return (
    <p>
      <span className="font-weight-bold">{fileType}:</span>
      <span>{file ? fileView(file, deleteFile) : ' -'}</span>
    </p>
  );
}

function getOtherFiles({ attachedFiles, deleteFile }: IUploadedFilesList) {
  return (
    <>
      <p className="font-weight-bold">Other files:</p>
      {attachedFiles.map((file: AttachedFile, index: number) => (
        <p key={file.FILE_ID} className="pl-2">
          {<span className="font-weight-bold">{index + 1}</span>}.
          {fileView(file, deleteFile)}
        </p>
      ))}
    </>
  );
}

interface IUploadedFilesList {
  attachedFiles: AttachedFile[];
  deleteFile: (file: AttachedFile) => void;
}

const UploadedFilesList = (props: IUploadedFilesList) => {
  return (
    <div className="uploadedFiles">
      {getSpecificFile(props, 'Test report')}
      {getSpecificFile(props, 'Certificate')}
      {getOtherFiles(props)}
    </div>
  );
};

export { UploadedFilesList };
