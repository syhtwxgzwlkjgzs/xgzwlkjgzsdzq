import { createAttachment } from '@common/server';
import { fixImageOrientation } from '@common/utils/exif';

const attachmentUpload = async (files) => {
  const uploadPromises = [];

  for (let i = 0; i < files.length; i++) {
    const fileImg = await fixImageOrientation(files[i]);
    const formData = new FormData();
    formData.append('file', fileImg);
    formData.append('type', 1);
    uploadPromises.push(new Promise(async resolve => {
      const res = await createAttachment(formData);
      resolve(res);
    }));
  }

  return Promise.all(uploadPromises);
};

export default attachmentUpload;
