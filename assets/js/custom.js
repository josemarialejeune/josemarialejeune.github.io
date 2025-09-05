/** otros metodos */
 let hidden = "w3-hide";
 /** appAddToBuild -- Compone un element del array a procesar por appBuild */
 function appAddToBuild(type,source,name){ 
    let data = new Object();
    /** elementos obligatorios type y source */
    if(type === null || typeof(type) !== "string" ) type ="view";
    data.type = type;
    if(source === null || typeof(source) !== "string" ) source="";
    data[data.type] = btoa(source);
    /** elementos opcionales name */
    if(name !== null || typeof(name) === "string" ) data.name = name;
    /* devolvemos el objeto creado en formato json string */
    return JSON.stringify(data);
 }
 /** appGetYear -- devuelve el año actual */
 function appGetYear(){
    return new Date().getFullYear();
 }
 /** appSetCopyright */
 function appSetCopyright(_where,_prev,_post){
    /** comprobamos existencia del nodo */
    if(_where !== null && typeof(_where) === "string" ) app.nodeLoad(_where);
    else return false;
    let space = " ";
    let content = ""
    /** contenido previo al año */
    if(_prev !== null && typeof(_prev) === "string" ) content += _prev;
    /** año */
    content += space + appGetYear() + space;
     /** contenido posterior al año */
    if(_post !== null && typeof(_post) === "string" ) content += _post;
    /** sustitucion del contenido en el nodo */
    return app.nodeReplace(content);
  }
  /** appToggleContent - conmuta visibilidad de contenidos principales content y bottom */
  function appToggleContent(){
   app.dom.id('app-main-content').classList.toggle('w3-hide');
   app.dom.id('app-main-bottom').classList.toggle('w3-hide');
  }
  /** appToggleAccessPassword - conmuta visibilidad formularios de acceso y recuperar password */
  function appToggleAccessPassword(){
   app.dom.id('app-main-signin').classList.toggle('w3-hide');
   app.dom.id('app-main-forgot-password').classList.toggle('w3-hide');
  }
  /** appToggleAccessRegister - conmuta visibilidad formularios de acceso y registro */
  function appToggleAccessRegister(){
   app.dom.id('app-main-signin').classList.toggle('w3-hide');
   app.dom.id('app-main-signup').classList.toggle('w3-hide');
  }
  /** Fin codigo */
