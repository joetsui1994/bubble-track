export function validateFile(file) {
    const allowedExtensions =  ['json', 'txt'],
        sizeLimit = 500000000; // 500 MB
  
    // destructuring file name and size from file object
    const { name: fileName, size: fileSize } = file;
    const fileExtension = fileName.split(".").pop();
  
    /* 
      check if the extension of the uploaded file is included 
      in our array of allowed file extensions
    */
    if (!allowedExtensions.includes(fileExtension)) {
        return ({
            status: 1,
            errMessage: 'File type not allowed.',
            fileName: 'N/A',
            fileSize: 'N/A',
            content: null,
        });
    } else if(fileSize > sizeLimit) {
        return ({
            status: 1,
            errMessage: 'Maximum file size (500MB) exceeded.',
            fileName: 'N/A',
            fileSize: 'N/A',
            content: null,
        });
    } else {
        return ({
            status: 0,
            errMessage: '',
            fileName: fileName,
            fileSize: fileSize,
            file: file,
        });
    }
}

export function fileSizeDisplay(fileSize) {
    if (fileSize < 1000) {
        return `${fileSize} B`;
    } else if (fileSize >= 1000 && fileSize < 1000000) {
        const fileSizeKB = fileSize/1000;
        return `${Math.round(fileSizeKB*100)/100} KB`;
    } else if (fileSize > 1000000) {
        const fileSizeMB = fileSize/1000000;
        return `${Math.round(fileSizeMB*100)/100} KB`;
    }
}