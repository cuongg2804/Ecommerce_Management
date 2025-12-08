
const showToast = (message, type) => {
    let background = "linear-gradient(to right, #00b09b, #96c93d)"; // default success
    
    if (type === "error") {
      background = "linear-gradient(to right, #ff5f6d, #ffc371)";
    }

    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: background,
   
    }).showToast();
    sessionStorage.removeItem("toast");
}
const toast = sessionStorage.getItem("toast");

if(toast){
  const {type , message} = JSON.parse(toast);
  showToast(message,type);
}

const drawToast = (message, type = "success") =>{
    sessionStorage.setItem("toast", JSON.stringify({
      type : type,
      message : message
    }))
  
}

//ArticleCategoryForm
const ArticleCategoryForm = document.querySelector('#category-create');

if(ArticleCategoryForm){
  const validation = new JustValidate('#category-create');
  validation
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Vui lòng nhập tên danh mục'
    }
  ])
  .addField('#slug', [
    {
      rule: 'required',
      errorMessage: 'Vui lòng nhập đường dẫn'
    }
  ])
  .onSuccess(( event ) => {
      const name = event.target.name.value;
      const slug = event.target.slug.value;
      const parent = event.target.parent.value;
      const description = tinymce.get("description").getContent();
      const status = event.target.status.value;
      const avatar = event.target.avatar.value;
      const formData = new FormData()
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("parent", parent);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("avatar", avatar);
     
      fetch(`${pathAdmin}/article/category/create`,{
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
      })
  });
  $(document).ready(function() {
    const $selectFind = $("#category-create .js-example-basic-multiple");
    if ($selectFind.length) {
      $selectFind.select2();
    }
  });
}
//EndArticleCategoryForm

// generateSlug
const btnGenerateSlug = document.querySelector("[generateSlug]");
if(btnGenerateSlug){
  btnGenerateSlug.addEventListener("click", () => {
    const modelName = btnGenerateSlug.getAttribute("generateSlug");
    const from = btnGenerateSlug.getAttribute("from");
    const to = btnGenerateSlug.getAttribute("to");
    const description = tinymce.get("description").getContent();
    const string = document.querySelector(`[name='${from}']`).value;
    const  inputSlug= document.querySelector(`[name='${to}']`);
   
    const finalData = {
      string : string,
      modelName : modelName,
      from: from,
      to: to,
      description: description,
    }

    fetch(`${pathAdmin}/helpers/generateSlug`,{
      method: "POST",
      headers: { "Content-type": "application/json"},
      body : JSON.stringify(finalData)
    }
    )
    .then(res => res.json())
    .then((data) => {
      if(data.type =="success"){
          showToast(data.message, data.code);
          inputSlug.value = data.slug;
        }
        

        if(data.type =="error"){
          showToast(data.message, "error");
        }
    })
  })
}
// End generateSlug

//Tiny MCE
const initialTinyMCE = () => {
  tinymce.init({
    selector: 'textarea',
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | image',
    init_instance_callback: (editor) => {
      editor.on("OpenWindow", () => {
        const title = document.querySelector(".tox .tox-dialog__title")?.innerHTML;
        if(title == "Insert/Edit Media" || title == "Insert/Edit Image") {
          const inputSource = document.querySelector(`.tox input.tox-textfield[type="url"]`);
          inputSource.value = domainCDN;
        }
      })
    }

  });
}
initialTinyMCE();
//End TinyMCE

//formArticleCategoryEdit
const formArticleCategoryEdit = document.querySelector("#formArticleCategoryEdit");
if(formArticleCategoryEdit){
  const validation = new JustValidate("#formArticleCategoryEdit");

  validation.addField("#name", [
    {
      rule: 'required',
      errorMessage:"Vui lòng nhập tên danh mục!"
    }
  ])
  .addField("#slug", [
    {
      rule: 'required',
      errorMessage:"Vui lòng nhập đường dẫn"
    }
  ])
  .onSuccess((event) =>{
    const id = event.target.id.value;
    const name = event.target.name.value;
    const slug = event.target.slug.value;
    const status = event.target.status.value;
    const parent = event.target.parent.value;
    const avatar = event.target.avatar.value;
    const description = tinymce.get("description").getContent();
    
    const formData = new FormData();
    formData.append("name",name);
    formData.append("slug",slug);
    formData.append("status",status);
    formData.append("parent",parent);
    formData.append("avatar",avatar);
    formData.append("description",description);

    fetch(`${pathAdmin}/article/category/edit/${id}`,{
      method: "PATCH",
      body: formData
    })
    .then(res => res.json())
    .then(data =>{
      if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
    })
  })
}
//EndformArticleCategoryEdit

//Button API
const buttonApi = document.querySelectorAll("[button-api]");
if(buttonApi.length > 0) {
  buttonApi.forEach((button) => {
    button.addEventListener("click", () =>{
      const method = button.getAttribute("method");
      const dataApi = button.getAttribute("data-api");

      if(method == "DELETE" || method == "PATCH"){
        Swal.fire({
          title: "Bạn có chắc chắn muốn xóa?",
          text: "Bản ghi sẽ không thể khôi phục!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy"
        }).then((result) => {
          if (!result.isConfirmed) {
            return;
          }
          fetch(dataApi, {
            method : method || "GET"
          })
          .then(res => res.json())
          .then(data =>{
            if(data.code =="success"){
              drawToast(data.message, data.code);
              window.location.reload();
            }
            if(data.code =="error"){
              showToast(data.message, data.code);
            }
          })
        });
      }
      else{
        fetch(dataApi, {
        method : method || "GET"
      })
      .then(res => res.json())
      .then(data =>{
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          Toastify({
            text: data.message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
          }).showToast();
        }
      })
      }
    })
  })
}
//End Button API

//Form Search
const formSearch = document.querySelector("[form-search]");
if(formSearch) {
  const url = new URL(window.location.href);
 
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
     const value = event.target.keyword.value;
     if(value){
      url.searchParams.set("keyword", value);
     }
     else{
      url.searchParams.delete("keyword");
     }
     window.location.href = url.href;
  })

  //Hiện giá trị mặc định
  const curretValue = url.searchParams.get("keyword");
  if(curretValue){
    formSearch.keyword.value = curretValue;
  }
}
//End Form Search

//Pagination
const pagination = document.querySelector("[pagination]");
if(pagination){
  const url = new URL(window.location.href);
  pagination.addEventListener("change", (event) => {
    const value = pagination.value;
    if(value) {
      url.searchParams.set("page",value);
    }
    else{
      url.searchParams.delete("page");
    }

    window.location.href = url;
  })

  const currentValue = url.searchParams.get("page");
  if(currentValue){
    pagination.value = currentValue;
  }
}
//End Pagination

//Button Copy File
const btnCopyList = document.querySelectorAll("[button-copy]");
if(btnCopyList.length > 0) {
  btnCopyList.forEach((button) => {
    button.addEventListener("click", (event) =>{
      event.preventDefault();
      const dataLinks = button.getAttribute("data-content");
      window.navigator.clipboard.writeText(dataLinks);
      showToast("Đã copy!","sucess");
    })
  })
}
//Button Copy File

//Modal Preview File
const modalPreviewFile = document.querySelector("#modalPreviewFile");
if(modalPreviewFile){
  const innerPreviewFile = document.querySelector(".inner-preview-file");
  const buttonPreviewFileList = document.querySelectorAll("[button-preview-file]");
  let buttonPreviewFile = null;
  
  buttonPreviewFileList.forEach((button) => {
    button.addEventListener("click", (event) =>{
      buttonPreviewFile = button;
    })
  }) 
  modalPreviewFile.addEventListener('shown.bs.modal', function (event) {
    const datalinks = buttonPreviewFile.getAttribute("data-content");
    const mimetype = buttonPreviewFile.getAttribute("mimetype");

    if(mimetype.includes("image")){
      innerPreviewFile.innerHTML= `
        <img src="${datalinks}" width="100%" height="60%"/>
      `;
    }

    if(mimetype.includes("audio")){
      innerPreviewFile.innerHTML= `
        <audio controls src="${datalinks}"   type="audio/mp3"/>
      `;
    }

    if(mimetype.includes("application")){
      innerPreviewFile.innerHTML= `
        <iframe src="${datalinks}"  style="width:100%; height:500px;" frameborder="0"></iframe>
      `;
    }

    if(mimetype.includes("video")){
      innerPreviewFile.innerHTML= `
        <video src="${datalinks}" style="width:100%; height:500px;"controls controlsList="nodownload"></video>
      `;
    }
  })

  modalPreviewFile.addEventListener('hidden.bs.modal', function (event) {
    buttonPreviewFile= null;
    innerPreviewFile.innerHTML= " ";
  })
}
//End Modal Preview File

//Model-Change-File-Name
const modalChangeFileName = document.querySelector("#modalChangeFileName");
if(modalChangeFileName){
  const formChangeFileName = document.querySelector("[form-change-file-name]");
  const listButtonChangeFileName = document.querySelectorAll("[button-change-file-name]");
  let buttonChangeFile = null;

  listButtonChangeFileName.forEach((button) =>{
    button.addEventListener("click", (event) =>{
       buttonChangeFile = button;
    })
  })
 
  modalChangeFileName.addEventListener('shown.bs.modal', function (event) {
    const fileName = buttonChangeFile.getAttribute("data-file-name");
    const fileId = buttonChangeFile.getAttribute("data-file-id");
    
    const inputId = formChangeFileName.querySelector("input[name='fileId']");
    const inputName = formChangeFileName.querySelector("input[name='fileName']");

    inputId.value = fileId;
    inputName.value = fileName;

    formChangeFileName.addEventListener("submit",(event) =>{
      event.preventDefault();
      
      const id = inputId.value;
      const name = inputName.value;
      const formData = new FormData()
      formData.append("name", name);
      formData.append("id", id);

      fetch(`${pathAdmin}/file/change-file-name`,{
        method: "PATCH",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
      })
    })
  })
  
}
//End-Model-Change-File-Name

//Delete File
const listBtnDelFile = document.querySelectorAll("[button-delete-file]");
if(listBtnDelFile.length > 0) {
  listBtnDelFile.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-file-id");
      const fileName = button.getAttribute("data-file-name");

      const formData = new FormData();
      formData.append("id", id);
      formData.append("fileName", fileName);
      Swal.fire({
          title: `Bạn có chắc chắn muốn ${fileName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy"
        })
        .then((result) => {
          if (!result.isConfirmed) {
            return;
          }
          fetch(`${pathAdmin}/file/delete-file/${id}`, {
            method : "PATCH",
            body: formData
          })
          .then(res => res.json())
          .then(data =>{
            if(data.code =="success"){
              drawToast(data.message, data.code);
              window.location.reload();
            }
            if(data.code =="error"){
              showToast(data.message, data.code);
            }
          })
        });
    })
  })
}
//End Delete File

//Form-create-folder
const formCreateFolder = document.querySelector("[form-create-folder]");
if(formCreateFolder) {
  formCreateFolder.addEventListener("submit", (event) => {
    event.preventDefault();
    const folderName = event.target.folderName.value;
    if(!folderName){
      showToast("Chưa điền tên folder!", "error");
    }
    const formData = new FormData();
    formData.append("folderName", folderName);

  const urlParams  = new URLSearchParams(window.location.search);
  const folderPath = urlParams.get("folderPath");
    if(folderPath){
      formData.append("folderPath",folderPath);
    }
   
    fetch(`${pathAdmin}/folder/create`,{
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
      })
  })
}
//Form-create-folder

//Button to Folder
const listBtnToFolder = document.querySelectorAll("[button-to-folder]");
if(listBtnToFolder.length > 0) {
  const url = new URL(window.location.href);
 
  listBtnToFolder.forEach((button) => {
    button.addEventListener("click",(event) =>{
      let folderPath = button.getAttribute("folderPath");
      if(folderPath){
        const lastUrl = new URLSearchParams(window.location.search).get("folderPath") ;
        if(lastUrl){
          folderPath = `${lastUrl}/${folderPath}`;
        }
        url.searchParams.set("folderPath",folderPath);
      }
      else{
        url.searchParams.delete("folderPath");
      }
     window.location.href = url;
    })
  })
}
//End Button to Folder


//breadcumb-folder
const breadcumbFolder = document.querySelector("[breadcumb-folder]");
if(breadcumbFolder) {
  const url = (new URLSearchParams(window.location.search)).get("folderPath") || "";
  if(url.length > 0){
    const listFolder = url.split("/") || [];
    
    let html = `
      <li class="list-group-item bg-white">
        <a href="${pathAdmin}/file">
          <i class="la la-angle-double-right text-info me-2"></i>
          Media
        </a>
      </li>

    `
    let path = "" ;
    listFolder.forEach((item, index) =>{
      path += (index > 0 ? "/" : "") + listFolder[index];
      

      html += `
        <li class="list-group-item bg-white">
          <a href="${pathAdmin}/file?folderPath=${path}">
            <i class="la la-angle-double-right text-info me-2"></i>
            ${item}
          </a>
        </li>
      `
    })
    breadcumbFolder.innerHTML = html
  }
}
//End breadcumb-folder

alert = async (title,text, icon="warning") => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  })
  return result.isConfirmed;
 
}

//Delete Folder
const listBtnDelFolder = document.querySelectorAll("[button-delete-folder]");
if(listBtnDelFolder.length > 0) {
  const urlParams  = new URLSearchParams(window.location.search);
  
  listBtnDelFolder.forEach(  (button) => {
    button.addEventListener("click", async ()=>{
      const folderName = button.getAttribute("folderPath");
      const folderPath = (urlParams.get("folderPath") == null ? "" : urlParams.get("folderPath")) + "/" + folderName;
  
      if(await alert(`Bạn có chắc chắn muốn xóa ${folderName} ?`, "Folder sẽ không thể khôi phục!")){
        fetch(`${pathAdmin}/folder/delete?folderPath=${folderPath}`,{
           method: "DELETE"
        })
        .then(res => res.json())
        .then((data) =>{
          drawToast(data.message, data.code)
          if(data.code == "error"){
            showToast(data.message, data.code);
          }

          if(data.code == "success"){
            drawToast(data.message, data.code);
            location.reload();
          }
        })
      }
    })
  })
}
//End Delete Folder

const formGroupFile = document.querySelector("[form-group-file]");
if(formGroupFile){
  
  const input = formGroupFile.querySelector("[input-file]");
  const previewFile = document.querySelector("[preview-file]");

  input.addEventListener("input",() => {
    const value = input.value;
    previewFile.querySelector("img").src =`${domainCDN}${value}`;
  })

  if(input.value){
     const value = input.value;
    previewFile.querySelector("img").src =`${domainCDN}${value}`;
  }
}

//CheckBox_List
const getCheckBoxList = (name) => {
  const checkboxList = document.querySelector(`[checkbox-list="${name}"]`);
  const inputList = checkboxList.querySelectorAll(`input[type="checkbox"]:checked`);
  const idList = [];
  inputList.forEach(input =>{
    const id = input.value;
    if(id){
      idList.push(id)
    }
  })
  return idList;
}


//ArticleFormCreate
const ArticleFormCreate = document.querySelector('#article-create');
if(ArticleFormCreate){
  const validation = new JustValidate('#article-create');
  validation
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Vui lòng nhập tên danh mục'
    }
  ])
  .addField('#slug', [
    {
      rule: 'required',
      errorMessage: 'Vui lòng nhập đường dẫn'
    }
  ])
  .onSuccess(( event ) => {
      const name = event.target.name.value;
      const slug = event.target.slug.value;
      const category = getCheckBoxList("category");
      const description = tinymce.get("description").getContent();
      const status = event.target.status.value;
      const avatar = event.target.avatar.value;
      const content = tinymce.get("content").getContent();
      const formData = new FormData()
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("category", JSON.stringify(category));
    
      fetch(`${pathAdmin}/article/create`,{
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
      })
  });
  $(document).ready(function() {
    const $selectFind = $("#category-create .js-example-basic-multiple");
    if ($selectFind.length) {
      $selectFind.select2();
    }
  });
}
// End  ArticleFormCreate

//ArticleFormEdit
const formArticleEdit = document.querySelector("#articleEditForm");
if(formArticleEdit){
  const validation = new JustValidate("#articleEditForm");

  validation.addField("#name", [
    {
      rule: 'required',
      errorMessage:"Vui lòng nhập tên danh mục!"
    }
  ])
  .addField("#slug", [
    {
      rule: 'required',
      errorMessage:"Vui lòng nhập đường dẫn"
    }
  ])
  .onSuccess((event) =>{
    const id = event.target.id.value;
    const name = event.target.name.value;
    const slug = event.target.slug.value;
    const status = event.target.status.value;
    const avatar = event.target.avatar.value;
    const category = getCheckBoxList("category");
    const description = tinymce.get("description").getContent();
    const content = tinymce.get("content").getContent();
    const formData = new FormData();
    formData.append("name",name);
    formData.append("slug",slug);
    formData.append("status",status);
    formData.append("category",JSON.stringify(category));
    formData.append("avatar",avatar);
    formData.append("description",description);
    formData.append("content",content);
    fetch(`${pathAdmin}/article/edit/${id}`,{
      method: "PATCH",
      body: formData
    })
    .then(res => res.json())
    .then(data =>{
      if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
    })
  })
}
//End ArticleFormEdit

//Button CheckAll
const buttonCheckAll = document.querySelector("#checkAll")
if(buttonCheckAll){
  buttonCheckAll.addEventListener("change", () => {
    const checked = buttonCheckAll.checked;

    const listCheckBox = document.querySelectorAll("[checkbox-item]")
    listCheckBox.forEach((box) =>{
      box.checked = checked
    })
  })
}
//End ButtonCheckAll

// roleCreateForm
const roleCreateForm = document.querySelector("#roleCreateForm")
if(roleCreateForm){
  const  validation = new JustValidate("#roleCreateForm");
  validation.addField("#name", [
    {
      rule: 'required',
      errorMessage: 'Vui lòng nhập tên nhóm quyền'
    }
  ])
  .onSuccess(( event ) => {
    const name = event.target.name.value;
    const permission = getCheckBoxList("permissions")
    const description = event.target.description.value;
    const status = event.target.status.value;

    const formData = new FormData()
    formData.append("name", name);
    formData.append("permissions", JSON.stringify(permission));
    formData.append("status", status);
    formData.append("description", description);

   

    fetch(`${pathAdmin}/role/create`,{
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
      })
  })
}
//End roleCreateForm

//roleEditForm
const roleEditForm = document.querySelector("#roleEditForm")
if(roleEditForm){
  const  validation = new JustValidate("#roleEditForm");
  validation.addField("#name", [
    {
      rule: 'required',
      errorMessage: 'Vui lòng nhập tên nhóm quyền'
    }
  ])
  .onSuccess(( event ) => {
    const name = event.target.name.value;
    const id = event.target.id.value;
    const permission = getCheckBoxList("permissions")
    const description = event.target.description.value;
    const status = event.target.status.value;

    const formData = new FormData()
    formData.append("name", name);
    formData.append("permissions", JSON.stringify(permission));
    formData.append("status", status);
    formData.append("description", description);

   

    fetch(`${pathAdmin}/role/edit/${id}`,{
        method: "PATCH",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if(data.code =="success"){
          drawToast(data.message, data.code);
          window.location.reload();
        }

        if(data.code =="error"){
          showToast(data.message, data.code);
        }
      })
  })
}
//End roleCreateForm

//accountAdminCreateForm
const accountAdminCreateForm = document.querySelector("#accountAdminCreateForm")
if(accountAdminCreateForm){
  const validation = new JustValidate("#accountAdminCreateForm");

  validation
    .addField("#fullName",[
      {
        rule: "required",
        errorMessage:"Vui lòng nhập họ tên!"
      },
      {
        rule:"minLength",
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!'
      },
      {
        rule:"maxLength",
        value: 30,
        errorMessage: 'Họ tên không được vượt quá 30 ký tự!'
      }
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email của bạn!',
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField("#password",[
      {
        rule: "required",
        errorMessage: 'Vui lòng nhập mật khẩu!'
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự'
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!'
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in thường!'
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      }
    ])
    .onSuccess((event) =>{
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      const status = event.target.status.value;
      const avatar = event.target.avatar.value;
      const roles = getCheckBoxList("roles");

      // Tạo FormData
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("roles", JSON.stringify(roles));
      
      fetch(`${pathAdmin}/account-admin/create`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code =="success"){
            drawToast(data.message, data.code);
            window.location.reload();
          }

          if(data.code =="error"){
            showToast(data.message, data.code);
          }
        })
    })
}
//End accountAdminCreateForm