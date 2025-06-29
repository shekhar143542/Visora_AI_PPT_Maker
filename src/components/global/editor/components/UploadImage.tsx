"use client";
import { FileUploaderRegular, } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

type Props = {
  contentId: string;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
};

function UploadImage({ contentId, onContentChange }: Props) {
  console.log("UPLOADCARE_KEY:", process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY);

  const handleChangeEvent = (e: { cdnUrl: string | string[] | string[][]; }) => {
    onContentChange(contentId, e.cdnUrl);
  };

  return (
    <div>
      <FileUploaderRegular
        sourceList="local, url, dropbox"
        classNameUploader="uc-light"
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY!}
        multiple={false}
        onFileUploadSuccess={handleChangeEvent}
        maxLocalFileSizeBytes={10000000}
      />
    </div>
  );
}

export default UploadImage;