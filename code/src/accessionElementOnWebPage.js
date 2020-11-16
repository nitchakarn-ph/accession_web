// set local reference to lodash and jquery
const { _, $ } = Cypress
import promisify from 'cypress-promise'
import selectDataOfElement from '../src/selectDataOfElement'
import selectHideContent from '../src/selectHideContent'
import accessionStandardElement from '../src/accessContentWithArrow'

module.exports = async function accessionElementOnWebPage (firstEl , lastEl) {
    console.log("accession element on web page" , firstEl , lastEl)

    let preElem = null
    let dupElem = false
    let containContent = []

    do {

        const currentElem = await promisify(cy.tab())
        beFocused(currentElem)

        // if(currentElem[0] == preElem){
        //     dupElem = true
        // }

        if (currentElem[0] == firstEl && preElem == lastEl || preElem == currentElem[0]) {
            console.log("dupicated element !!!")
            dupElem = true
        } else {
            preElem = currentElem[0]
            containContent.push(preElem)
        }

    } while (!dupElem)

    // get element เพื่อตรวจสอบว่าสามารถเข้าถึงด้วย key อื่นได้หรือไม่
    getContentElement(containContent)

    // เขียนข้อมูล element ของปุ่ม tab ที่สามารถเข้าถึงได้
    selectDataOfElement(containContent)
}

async function getContentElement(containContent) {
    console.log("get content element")
    let arrItem = []
    let el = []
    for (let i = 0; i < containContent.length; i++) {
         el = checkElementUsingAriaAttr(containContent[i])
    }

    
    const value = await promisify (cy.get(el))
    console.log(value[0])
    
    
    value[0].then(function(v) {

        console.log("#########################################################" , v)
        if(v != null) {
            if(v.length != 0 ){
                v.forEach((item) => {
                    arrItem.push(item)
                })
    
                console.log(arrItem)
                selectHideContent(arrItem)
            }
        }
       
    })
   
    // console.log(arrItem[0])
    // selectHideContent(arrItem)
}

async function checkElementUsingAriaAttr (el) {
    console.log(el)

    let role = ""
    let expanded = ""
    let popup = ""
    let id = ""


    if(el.attributes["role"] != null){
        role = el.attributes["role"].value
    }

    // กำหนดค่าเริ่มต้นให้กับ expanded และ popup
    if(el.attributes["aria-expanded"] != null ){
            expanded = el.attributes["aria-expanded"].value
            console.log("expanded : " , el )
    }

    if(el.attributes["aria-haspopup"] != null){
        popup = el.attributes["aria-haspopup"].value
        console.log("expanded : " , el , "popup : " , popup)
    }

        // กรณีมีการซ่อน element ภายใน
    if((popup == "true" && el.tagName == "BUTTON") || (popup == "true" && role == "button")){
            const openItem = await promisify(cy.get(el).type('{enter}'))
            console.log("open item " , openItem[0])

            // ค้นหา focused first element and last element ของ button element
            const firstItem = await promisify(cy.get(openItem).tab())
            beFocused(firstItem)
            const lastItem = await promisify(cy.get(firstItem).tab({shift:true}))
            beFocused(lastItem)

            //ค้นหา id ของ openItem
            if(openItem[0].attributes["id"] != null){
                id = openItem[0].attributes["id"].value
                console.log(id)
            }

            if(firstItem[0] != openItem[0]){
                // เข้าถึง element ที่ถูกซ่อนของ button element
                const item = accessHideItem(firstItem[0] , lastItem[0])
                return item

            }else{
                cy.log("ไม่สามารถขยายเนื้อหาภายใน button element ได้")
            }

            
    }else if(expanded == "false" && el.tagName == "BUTTON"){
            const openItem = await promisify(cy.get(el).type('{enter}'))
            console.log("open item " , openItem[0])

            // ค้นหา focused first element and last element ของ button element
            const firstItem = await promisify(cy.get(openItem).tab())
            beFocused(firstItem)
            const lastItem = await promisify(cy.get(firstItem).tab({shift:true}))
            beFocused(lastItem)

            //ค้นหา id ของ openItem
            if(openItem[0].attributes["id"] != null){
                id = openItem[0].attributes["id"].value
                // console.log(id)
            }

            // เข้าถึง element ที่ถูกซ่อนของ button element
            const item = accessHideItem(firstItem[0] , lastItem[0])
            return item
            // getResult(item)
           

    }else if(expanded == "false" && el.tagName == "INPUT"){
            // ค้นหา focused last element ของ button element
            const lastItem = await promisify(cy.get(el).type('{uparrow}'))
            const lastItemActive = lastItem[0].ownerDocument.activeElement
            console.log("last item active " , lastItemActive)

                // เข้าถึง element ที่ถูกซ่อนของ button element
                const item = accessHideItemInputElem(lastItemActive)
                return item

    }else if(expanded == "false" && el.tagName == "DIV"){
            
            if(el.attributes["aria-haspopup"] != null && el.attributes["aria-haspopup"].value == "listbox"){
                // ค้นหา focused last element ของ button element
                const lastItem = await promisify(cy.get(el).type('{uparrow}'))
                const lastItemActive = lastItem[0].ownerDocument.activeElement
                console.log("last item active " , lastItemActive)

                // เข้าถึง element ที่ถูกซ่อนของ button element
                const item = accessHideItemInputElem(lastItemActive)
                return item

            }
            
    }else if(el.attributes["aria-haspopup"] != null && el.attributes["aria-haspopup"].value == "listbox"){
                // ค้นหา focused last element ของ button element
                const lastItem = await promisify(cy.get(el).type('{uparrow}'))
                const lastItemActive = lastItem[0].ownerDocument.activeElement
                console.log("last item active " , lastItemActive)

                // เข้าถึง element ที่ถูกซ่อนของ button element
                const item = accessHideItemInputElem(lastItemActive)
                return item

                // }else if(el.attributes["aria-haspopup"].value == "true"){
                //     console.log("open " , el)
                //     const openItem = await promisify(cy.get(el).type('{enter}'))
                //     console.log("open item " , openItem[0])

                //     accessHideItemInputElem(openItem[0].ownerDocument.activeElement)

    }else if(role == "tab"){
            console.log("tab element" , el)
            const openItem = await promisify(cy.get(el).type('{enter}'))
            console.log("open item " , openItem[0])

            const lastItem = await promisify(cy.get(el).type('{leftarrow}'))
            const lastItemActive = lastItem[0].ownerDocument.activeElement
            console.log("last item active " , lastItemActive)

            // ตรวจสอบว่ามีเมนูทางด้านขวาไหม
            if(lastItemActive != el[0]){
                console.log("have element on the right")

                const tabpanel = accessionTabs(el , lastItemActive)
                return tabpanel
            }

    }else if(role == "radio"){
            const lastItem = await promisify(cy.get(el).type('{leftarrow}'))
            const lastItemActive = lastItem[0].ownerDocument.activeElement
            console.log("last item active " , lastItemActive)

            // ตรวจสอบว่ามีเมนูทางด้านขวาไหม
            if(lastItemActive != el[0]){
                console.log("have element on the right")

                // เข้าถึงรายการ radio element
                const radio = accessionRadio(el , lastItemActive)
                return radio
            }

    }else if(role == "slider"){

            let min = ""
            let max = ""
            if(el.attributes["aria-valuemin"] != null && el.attributes["aria-valuemax"] != null){
                min = parseInt(el.attributes["aria-valuemin"].value)
                max = parseInt(el.attributes["aria-valuemax"].value)
                

                const slider = accessNumberUseUpArrow(max , min)
                return slider
            }

    }else if(role == "spinbutton"){
            console.log("spinbutton")

            const lastItem = await promisify(cy.get(el).tab({shift:true}))
            const lastItemActive = lastItem[0].ownerDocument.activeElement
            console.log("last item active " , lastItemActive)

            if(lastItemActive != el){
                console.log("spinbutton have element on the right")
                console.log(el , "\n" , lastItemActive)
                const spinItem = accessionSpinbutton(el , lastItemActive)
                return spinItem
            }

    }else if(el.attributes["onclick"] != null && el.tagName == "BUTTON"){
                console.log("modal element" , el)
                const openModal = await promisify(cy.get(el).type('{enter}'))
                console.log("open modal " , openModal[0])

                // ค้นหา focused first element and last element ของ button element
                const firstItem = await promisify(cy.tab())
                beFocused(firstItem)
                const lastItem = await promisify(cy.get(firstItem).tab({shift:true}))
                beFocused(lastItem)

                if(firstItem[0] == el){
                    console.log("cann't open modal")
                }else{
                    const item = accessHideItemOfMOdal(firstItem[0] , lastItem[0])
                    return item
                }

    }else{
        console.log("standard element" , el)
        accessionStandardElement(el)
    }

}

async function accessHideItem (firstItem , lastItem){
    console.log("accessHideItem" , firstItem , lastItem)

    let preElem = null
    let dupElem = false
    let containContent = []

    do {

        const currentElem = await promisify(cy.tab())
        beFocused(currentElem)

        if (currentElem[0] == firstItem && preElem == lastItem) {
            console.log("dupicated element !!!")
            dupElem = true

            const closePopup = await promisify (cy.get(currentElem).type('{esc}' , {paresSpecialCharSequences: true}))

        } else {
            preElem = currentElem[0]
            
            // เลือกเก็บข้อมูล โดยจะเก็บเพียงข้อมูลของเนื้อหาที่ถูกซ่อน สำหรับ accordion
            // if(preElem.attributes["id"] != null){
            //     idItem = preElem.attributes["id"].value

            //     //if(idItem.search(id) == -1){
            //         console.log("-------> push" , preElem)
            //         containContent.push(preElem)
            //     //}

            // }else{
            //     console.log("-------> push")
            //     containContent.push(preElem)
            // }

            if(preElem.tagName == firstItem.tagName){
                console.log("-------> push" , preElem)
                containContent.push(preElem)
            }else{
                containContent.push(preElem)
            }
        }

    } while (!dupElem)

    console.log("accessHideItem => contain content" , containContent)

    // selectDataOfElement(containContent)
    return containContent

}

async function accessHideItemInputElem (lastItem) {
    
    let currElem = null
    let prevElem = null
    let dupElem = false
    let containContent = []

    let idPreElem = ""
    let idCurrentElem = ""
    let idLastItem = ""

    if(lastItem.attributes["aria-activedescendant"] != null){
        idLastItem = lastItem.attributes["aria-activedescendant"].value
    }

    do {

        const currentElem = await promisify(cy.get('body').type('{downarrow}'))
        currElem = currentElem[0].ownerDocument.activeElement

        beFocusedArrowKey(currElem)

        if(currElem.attributes["aria-activedescendant"] != null){
            idCurrentElem = currElem.attributes["aria-activedescendant"].value

            if(idPreElem == idLastItem || idPreElem == idCurrentElem){
                dupElem = true
                const closePopup = await promisify (cy.get(currElem).type('{esc}' , {paresSpecialCharSequences: true}))
                console.log("duplicated item !!!")
            }else{
                idPreElem = idCurrentElem
                containContent.push(currElem)
            }

        }else{

            if(prevElem == lastItem){
                dupElem = true
                console.log("duplicated item !!!")
            }else{
                prevElem = currElem
                // console.log("prev element" , prevElem)
                containContent.push(currElem)
            }
        }

        // console.log("current element " , currElem)

    } while (!dupElem)

    console.log("accessHideItemInputElem" , containContent)

    return containContent
}

async function accessionTabs(firstItem , lastElem) {

    console.log(firstItem , lastElem)

    /**
    * @type {HTMLCollection}
    */
   let prevEl = null

   let dupEl = false
   let select = ""
   let containHide = []

   do {
       const next = await promisify(cy.get('body').type('{rightarrow}'))
       const nextActive = next[0].ownerDocument.activeElement
       beFocusedArrowKey(nextActive)

        if (nextActive == firstItem && prevEl == lastElem) {
            dupEl = true
            console.log("duplicated ")
        } else {
            prevEl = nextActive
            console.log("prev element " , prevEl)
            containHide.push(prevEl)

            if(nextActive.attributes["aria-selected"] != null){
                select = nextActive.attributes["aria-selected"].value
    
                // เข้าถึง tabpanel ด้วยการกดปุ่ม tab
                if(select == "true"){
                    const tabpanel = await promisify(cy.get(nextActive).tab())
                    beFocused(tabpanel)

                    containHide.push(tabpanel[0])
                   
                    // ย้าย focused ของปุ่ม tab กลับไปยัง Tabs element
                    const tabs = await promisify(cy.get(tabpanel).tab({shift:true}))
                    beFocused(tabs)
                    // nextActive = tabs[0]
                }
               
            }
        }

   } while (!dupEl)

   console.log(containHide)
   

   return containHide
}

async function accessHideItemOfMOdal (firstItem , lastItem){
    let preElem = null
    let dupElem = false
    let containContent = []

    do {

        const currentElem = await promisify(cy.tab())
        console.log(currentElem[0])
        beFocused(currentElem)

        if(currentElem[0] == firstItem && preElem == lastItem){
            console.log("stop")
            dupElem = true
        }else{
            preElem = currentElem[0]
            containContent.push(preElem)
        }

    } while (!dupElem)

    return containContent
}

async function accessionRadio (first, last) {
    console.log("Row\nfirst radio : ", first, "\nlast radio : ", last)

    /**
     * @type {HTMLCollection}
     */
    let previousRadio = null

    let duplicatedRadio = false
    let containItem = []

    do {
        const next = await promisify(cy.get('body').type('{rightarrow}'))
        const nextActive = next[0].ownerDocument.activeElement

        // currentRadio = next[0].ownerDocument.activeElement

        if (nextActive == first && previousRadio == last) {
            duplicatedRadio = true
            console.log("duplicated radio : ", duplicatedRadio)
        } else {
            previousRadio = nextActive
            containItem.push(previousRadio)
            // console.log(previousRadio)

        }

        // i++
    } while (!duplicatedRadio)

    console.log("radio : " , containItem)

    return containItem
}

async function accessNumberUseUpArrow(max, min) {
    let i = min
    let value = null
    let arrItem = []

    // press up arrow
    do{
        const changValue = await promisify(cy.get('body').type('{uparrow}'))
        beFocusedArrowKey(changValue[0].ownerDocument.activeElement)
        value = changValue[0].ownerDocument.activeElement
        arrItem.push(value)

        i++
    }while (i <= max) 

    console.log(arrItem)

    // press down arrow
    accessNumberUseDownArrow(max , min)
    return arrItem
}

async function accessNumberUseDownArrow(max, min) {
    let i = min
    let value = null
    let arrItem = []

    while (i <= max) {
        const changValue = await promisify(cy.get('body').type('{downarrow}'))
        beFocusedArrowKey(changValue[0].ownerDocument.activeElement)
        value = changValue[0].ownerDocument.activeElement
        // console.log("chang value : ", chang_value[0].ownerDocument.activeElement)

        arrItem.push(value)

        max--
    }

    console.log(arrItem)
   
}

async function accessionSpinbutton (firstItem , lastItem) {
    /**
     * @type {HTMLCollection}
     */
    let previous = null
    let duplicated = false
    
    let min = ""
    let max = ""

    let arrItem = []

    do {
        const next = await promisify(cy.tab())

        if (next[0] == firstItem && previous == lastItem) {
            duplicated = true
            console.log("duplicated radio : ", duplicated)
        } else {
            previous = next[0]
            arrItem.push(previous)

            if(previous.attributes["aria-valuemin"] != null && previous.attributes["aria-valuemax"] != null){
                min = parseInt(previous.attributes["aria-valuemin"].value)
                max = parseInt(previous.attributes["aria-valuemax"].value)
                console.log(min , max)
                const item = accessNextItem(max , min)
                item.then(function (v) {
                    console.log(v)

                    v.forEach((item) => {
                        arrItem.push(item)
                    })
                })
            }

        }

    } while (!duplicated)

    console.log(arrItem)

    return arrItem

}

async function accessNextItem(max, min) {
    let i = min
    let value = null
    let arrItem = []
    // press up arrow
    do {
        const changValue = await promisify(cy.get('body').type('{uparrow}'))
        beFocusedArrowKey(changValue[0].ownerDocument.activeElement)
        value = changValue[0].ownerDocument.activeElement

        arrItem.push(value)

        i++
    } while (i <= max)

    return arrItem
}


const beFocused = (el) => {
    const current_element = el[0]
    const active_element = cy.state('document').activeElement
    expect(current_element, 'active_element').to.equals(active_element)
}

const beFocusedArrowKey = (el) => {
    const current_element = el
    const active_element = cy.state('document').activeElement
    expect(current_element, 'active_element').to.equals(active_element)
}

// async function getResult  (el)  {
//     console.log("result: " , el)
//     let arrItem = []
//     el.then(function(v) {
//         if(v.length != 0){
//             v.forEach((item) => {
//                 arrItem.push(item)
//                 console.log(arrItem)

//                 selectHideContent(arrItem)
//             })
//         }
//     })

    
// }