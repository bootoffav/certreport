import { BaseInput } from '../FormFields';

interface CommentsNewsProps {
  news: string;
  comments: string;
  handleChange: any;
}

function CommentsNews({ news, comments, handleChange }: CommentsNewsProps) {
  return (
    <>
      <div className="form-row">
        <BaseInput
          required={false}
          value={news}
          className="w-100"
          id="news"
          label="News:"
          handleChange={handleChange}
        />
      </div>
      <div className="form-row">
        <label htmlFor="comments">Comments:</label>
        <textarea
          className="form-control"
          value={comments}
          id="comments"
          rows={15}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default CommentsNews;
