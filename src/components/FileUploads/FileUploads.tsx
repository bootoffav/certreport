import qs from 'qs';
import React from 'react';
import B24 from '../../B24';
// import ReactDOM from 'react-dom';
import UploadedFilesList from './UploadedFilesList';


const creator_id = process.env.REACT_APP_B24_USER_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;

class FileUploads extends React.Component<{
  taskId: string | undefined;
  attachedFiles: any;
  updateAttachedFiles: () => void;
}> {

  state = {
    uploading: false
  };

  upload = (e: any) => {
    // let uploaded: any = [];
    this.setState({ uploading: true });
    const amountOfFiles = e.target.files.length;
    let uploadedFiles = 0;

    const renderToUI = (uploadedResponse: any, file: any) => {
      uploadedFiles++;
      // uploaded.push({ name: file.name, result: uploadedResponse.result ? true : false })
      // ReactDOM.render(<Loading uploaded={uploaded} />, document.getElementById('loaded'));
      if (uploadedFiles === amountOfFiles) {
        this.setState({ uploading: false });
      }
    }
    
    for (let file of e.target.files) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        // @ts-ignore
        B24.fileUpload(this.props.taskId, file.name, reader.result)
          .then((res: any) => {
            renderToUI(res, file);
            this.props.updateAttachedFiles();
          });
      }
    }
  }

  deleteFile = (file: any) => {
    Promise.all([
      fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.deletefile?` + qs.stringify({ TASK_ID: this.props.taskId, ATTACHMENT_ID: file.ATTACHMENT_ID })),
      fetch(`${main_url}/${creator_id}/${webhook_key}/disk.file.delete?` + qs.stringify({ id: file.FILE_ID }))
    ]).then(this.props.updateAttachedFiles);
  }

  render() {
    return <>
      <UploadedFilesList attachedFiles={this.props.attachedFiles} deleteFile={this.deleteFile} />
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroupFileAddon01">
            {this.state.uploading
              ? <div className="spinner-border spinner-border-sm text-primary" role="status"></div> : ''
            }
          </span>
        </div>
        <div className="custom-file">
          <input type="file" className="custom-file-input"
            multiple
            onChange={this.upload}
            id="inputGroupFile01"
            aria-describedby="inputGroupFileAddon01" />
          <label className="custom-file-label" htmlFor="inputGroupFile01">Choose all files</label>
        </div>
      </div>
      <div id="loaded"></div>
    </>
  }
}

// const Loading = (props: any) =>
//   <ul className="list-group list-group-flush">
//     {props.uploaded.map(({ name, result }: any, index: number) =>
//       <li className="list-group-item" key={index}>
//         {name}  &nbsp;&nbsp;&nbsp;
//             {result
//           ? <span className="oi oi-circle-check"></span>
//           : <span className="oi oi-circle-x"></span>
//         }
//       </li>)
//     }
//   </ul>;


export default FileUploads;