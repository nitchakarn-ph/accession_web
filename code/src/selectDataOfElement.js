import writeFile from './writeFile'

// select attribute on the element 
module.exports = function selectDataOfElement (arrElement) {
    // let arrElement = arrElement;
    // let containObject = []
    let index = 0
    let objectData = null
    let arrObjectData = []  

    for(let i=0 ; i<arrElement.length ; i++){
        index+=1
        index.toString()

        //เลือกข้อมูลที่ต้องใน element แล้วนำมาเก็บไว้ใน array
        if(arrElement[i] != null){
            objectData = getDataParentElementToObj(arrElement[i] , index)
            arrObjectData.push(objectData)
        }
    }

    // console.log(arrObjectData)
    writeFile(arrObjectData)
}

// 1. เลือกข้อมูลที่ต้องการจาก element มาเก็บไว้ใน parent obj
// 2. ตรวจสอบว่า element มีลูกไหม? ถ้ามีให้เพิ่มข้อมูลของ child ลงใน parent obj
// 3. ตรวจสอบข้อมูลภายใน parent obj (body) มีข้อมูลตัวไหนมีค่าเท่ากับ null หรือ "" ไหม? ถ้ามีให้ทำการ delete ข้อมูลตัวนั้น
// 3. จัดรูป parent obj ให้อยู่ในรูป String
// 4. return parent obj
const getDataParentElementToObj = function(element , index){
    // console.log(element , index)

    const tagName = element.tagName
    const title = element.title
    const textContent = element.textContent.trim()
    const href = element.href
    const placeholder = element.placeholder
    const alt = element.alt
    const name = element.name
    const value = element.value

    let getDataParentElementToObj = {}
    const lengthChild = element.children.length

    // check parent element have childrent , append data child element to parent obj
    if(lengthChild > 0){
        const child = getDataChildrenElementFromParent(element , lengthChild)
        
        getDataParentElementToObj = {
            key: "TAB",
            id: index,
            tagName : tagName,
            title: title,
            content: textContent,
            alt: alt,
            placeholder : placeholder,
            href: href,
            name: name,
            value: value,
            children : child
        }

    }else{

        getDataParentElementToObj = {
            key: "TAB",
            id: index,
            tagName : tagName,
            title: title,
            content: textContent,
            alt: alt,
            placeholder : placeholder,
            href: href,
            name: name,
            value: value,
        }

    }

    
    //check data element not eqaul null , expect obj element not equal null
    const dataElement = deleteDataElementIsNull(getDataParentElementToObj)

    const objDataParentElement = JSON.stringify(dataElement , null , 2);
    // console.log(objDataParentElement)

    return objDataParentElement

}

const getDataChildrenElementFromParent = function(element , lengthChild) {
   
   let objChild = {}
   let index = 0
   let lengthChildOfObjChild = 0
   let arrContainObj = []

   let newObjChild = {}
   
    for(let i=0; i<lengthChild; i++){

        index++
        index.toString()
        
        objChild = {
            id: index,
            tagName: element.children[i].tagName,
            title: element.children[i].title,
            content: element.children[i].textContent.trim(),
            alt: element.children[i].alt,
            placeholder: element.children[i].placeholder,
            href: element.children[i].href,
            name: element.children[i].name,
            value: element.children[i].value,
        }

        //if ข้อมูลภายในของ objChild == null แล้วให้ทำการ ลบข้อมูล นั้น , expect ข้อมูลไม่มีค่าว่าง
        newObjChild = deleteDataElementIsNull(objChild)
        arrContainObj.push(newObjChild)


        // get data children into objChild (or children level 2)
        if(newObjChild.tagName == "SPAN"){
            lengthChildOfObjChild = element.children[i].children.length
            arrContainObj = getDataChildLevel2(lengthChildOfObjChild , element.children[i])
        }

        
    }
   
    return arrContainObj

}

const getDataChildLevel2 = function(lengthChildOfObjChild , element){
    let index = 0
    let objChild = {}
    let arrContainObj = []
    let newObjChild = {}

    if(lengthChildOfObjChild > 0){
        for(let i=0; i<lengthChildOfObjChild; i++){
  
          index+=1
          index.toString()

          objChild = {
              id: index,
              tagName: element.children[i].tagName,
              title: element.children[i].title,
              content: element.children[i].textContent.trim(),
              alt: element.children[i].alt,
              placeholder: element.children[i].placeholder,
              href: element.children[i].href,
              name: element.children[i].name,
              value: element.children[i].value,
          }
  
          //if ข้อมูลภายในของ objChild == null แล้วให้ทำการ ลบข้อมูล นั้น , expect ข้อมูลไม่มีค่าว่าง
          newObjChild = deleteDataElementIsNull(objChild)

          // if tagName child != tagName parent then push objChild to array
          if(newObjChild.tagName != element.tagName){
            arrContainObj.push(newObjChild)
          }
         
        }
  
    }

    return arrContainObj

}


const deleteDataElementIsNull = function(getDataParentElementToObj){
    let data;
    // console.log(getDataParentElementToObj)
    for(data in getDataParentElementToObj){
        // console.log(getDataParentElementToObj[data])
        if(getDataParentElementToObj[data] == "" || getDataParentElementToObj[data] == null){
            delete getDataParentElementToObj[data];
        }

    }

    return getDataParentElementToObj
}



