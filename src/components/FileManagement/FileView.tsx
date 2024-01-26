import { Icon, Button } from 'tabler-react';
import type { AttachedFile } from 'Task/types';

interface FileViewProps {
  file?: AttachedFile;
  deleteFile?: any;
  renameFile?: any;
  fileNamePlaceholder?: string;
  otherFile?: boolean;
}

function MarkAsSpecificFile(props: any) {
  const rename = (e: any, namePrefix: string) => {
    e.preventDefault();
    props.renameFile(props.file.FILE_ID, namePrefix + props.file.NAME);
  };

  return (
    <span className="float-right">
      <Button
        className="mx-2"
        size="sm"
        icon="check"
        color="primary"
        outline
        onClick={(e: any) => rename(e, 'Test Report_')}
      >
        It's Test Report
      </Button>
      <Button
        size="sm"
        icon="check"
        color="primary"
        outline
        onClick={(e: any) => rename(e, 'Certificate_')}
      >
        It's Certificate
      </Button>
    </span>
  );
}

function FileView(props: FileViewProps) {
  return props.file ? (
    <>
      <a href={import.meta.env.VITE_B24_HOST + props.file.DOWNLOAD_URL}>
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
      {props.otherFile && (
        <MarkAsSpecificFile file={props.file} renameFile={props.renameFile} />
      )}
    </>
  ) : (
    <>{props.fileNamePlaceholder}</>
  );
}

export { FileView };
