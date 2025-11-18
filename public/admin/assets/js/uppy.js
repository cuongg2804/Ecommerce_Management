import { Uppy, Dashboard,XHRUpload } from "https://releases.transloadit.com/uppy/v4.18.2/uppy.min.mjs";
const uppyUpload = document.querySelector("#uppy-upload");
if(uppyUpload) {
  const uppy = new Uppy()
  uppy.use(Dashboard, { 
    target: '#uppy-upload', 
    inline: true,
    width: "100%"
  })
  const urlParams  = new URLSearchParams(window.location.search);
  const folderPath = urlParams.get("folderPath");
  uppy.use(XHRUpload, { 
    endpoint: `${pathAdmin}/file/upload?folderPath=${folderPath}`,
    bundle: true,
    fieldName: "files"
  })

  

  uppy.on('upload-success', (file, responseObject) => {
    const res = responseObject.body;
    drawToast(res.message, res.code);
    window.location.reload();
  });
}