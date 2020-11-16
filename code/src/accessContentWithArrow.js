// set local reference to lodash and jquery
const { _, $ } = Cypress
import promisify from 'cypress-promise'
import selectHideContent from '../src/selectHideContent'

module.exports = async function checkArrtElement (el) {

    if(el.attributes["list"] != null){
        // find first item using down arrow key
        console.log("list attr on element : " , el)
        const first = await promisify(cy.get(el).type('{uparrow}'))
        let firstItem = first[0].ownerDocument.activeElement


        if(firstItem != el){
            // find current item using arrow key
            accessionList(firstItem)

        }else{

            throw new Error( `Subject is can't focused on the element
          `)

        }

        console.log(containItem)

    } else if(el.attributes["type"] != null && el.tagName == "INPUT"){

        console.log("type element is : " , el)
        checkTypeInputElement(el)

    } else if(el.tagName == "SELECT"){

        const visitedLast = await promisify(cy.get(el).type('{uparrow}'))
        let lastItem = visitedLast[0].ownerDocument.activeElement
        accessElementUseDownKey(lastItem)
        
    }else{
        
        checkPosition(el)
    }
}

const checkTypeInputElement = (el) =>  {

    let typeValue = ""

    if(el.attributes["type"] != null){
        typeValue = el.attributes["type"].value
    }

        switch (typeValue) {
            case "radio" :
                checkPosition(el)
                break
            case "date":
                checkPosition (el)
                break
            case "week":
                checkPosition (el)
                break
            case "month":
                checkPosition (el)
                break
            case "time":
                checkPosition (el)
                break
            case "datetime-local":
                checkPosition (el)
                break
            case "number":

                if(el.attributes["max"] != null && el.attributes["min"] != null){
                    accessNumberUseUpArrow(el.attributes["max"].value , el.attributes["min"].value)
                }

                break
            case "range":

                if(el.attributes["max"] != null && el.attributes["min"] != null){
                    accessRangeUseArrowKey(el.attributes["max"].value , el.attributes["min"].value)
                }

                break
            case "text":
                checkPosition(el)
                break
            case "color":
                checkPosition(el)
                break
            case "search":
                checkPosition(el)
                break
            case "tel":
                checkPosition(el)
                break
            case "url":
                checkPosition(el)
                break
            case "email":
                checkPosition(el)
                break
            case "password":
                checkPosition(el)
                break
            case "file":
                checkPosition(el)
                break
            case "submit":
                checkPosition(el)
                break
            case "image":
                checkPosition(el)
                break
            case "reset":
                checkPosition(el)
                break
            case "button":
                checkPosition(el)
                break
        }

}

async function accessionList (firstItem) {
    let currItem = null
    let prevItem = null
    let dup = false
    let containItem = []

    do{
        const current = await promisify(cy.get('body').type('{downarrow}'))
        currItem = current[0].ownerDocument.activeElement

        if(prevItem == firstItem){
            dup = true
            console.log("duplicated item list !!")
        }else{
            prevItem = currItem
            containItem.push(prevItem)
        }

    }while(!dup)

    selectHideContent(containItem)
}

async function checkPosition (el) {

    console.log("check position" , el)

    const visitedlastVerti = await promisify(cy.get(el).type('{leftarrow}'))
    const lastVertiActive = visitedlastVerti[0].ownerDocument.activeElement
    console.log(lastVertiActive)
    focusedElementActiveFromArrow(lastVertiActive)

    // เข้าถึง element ในแนวตั้ง เลื่อนลงด้านล่าง
    if(lastVertiActive == el){
        
        const visitedlastHorizon = await promisify(cy.get(el).type('{uparrow}'))
        const lastHorizonActive = visitedlastHorizon[0].ownerDocument.activeElement
        console.log(lastHorizonActive)
        focusedElementActiveFromArrow(lastHorizonActive)

        if(lastHorizonActive == el){
            console.log("don't have list element")
            
        }else{
            accessElementUseDownKey(lastHorizonActive)
        }
        // 
        
    }else{

         // เข้าถึง element ในแนวนอน เลื่อนลงด้านล่าง
        console.log("press arrow key")
        accessElementUseRightKey(lastVertiActive)
    }
}

async function accessElementUseRightKey (lastRadio) {
    console.log("accession last radio use arrow key : \n" , lastRadio)
    let dupRadio = false
    let currRadio = null
    let containContentElement = []

    do{
        const nextRadio = await promisify(cy.get('body').type('{rightarrow}'))
        currRadio = nextRadio[0].ownerDocument.activeElement
        focusedElementActiveFromArrow(currRadio)

        if( currRadio == lastRadio){
            dupRadio = true
            console.log("duplicated radio element !!")
        }else{
            containContentElement.push(currRadio)
        }

    }while(!dupRadio)

   selectHideContent(containContentElement)
}

async function accessElementUseDownKey (lastRadio) {
    console.log("accession last radio use arrow key : \n" , lastRadio)
    let dupRadio = false
    let currRadio = null
    let containContentElement = []

    do{
        const nextRadio = await promisify(cy.get('body').type('{downarrow}'))
        currRadio = nextRadio[0].ownerDocument.activeElement
        focusedElementActiveFromArrow(currRadio)

        if( currRadio == lastRadio){
            dupRadio = true
            console.log("duplicated radio element !!")
        }else{
            containContentElement.push(currRadio)
        }

    }while(!dupRadio)

    selectHideContent(containContentElement)
}

async function accessNumberUseUpArrow(max, min) {
    let i = min
    let containContentElement = []
    let valueActive = null

    // press up arrow
    do{
        const changValue = await promisify(cy.get('body').type('{uparrow}'))
        valueActive = changValue[0].ownerDocument.activeElement

        containContentElement.push(valueActive)

        focusedElementActiveFromArrow(valueActive)
        console.log("chang value : ", changValue[0].ownerDocument.activeElement)
        
        i++
    }while (i <= max) 

    // press down arrow
    accessNumberUseDownArrow(max , min)

    // select data element
    selectHideContent(containContentElement)
}

async function accessNumberUseDownArrow(max, min) {
    let i = min

    while (i <= max) {
        const changValue = await promisify(cy.get('body').type('{downarrow}'))
        focusedElementActiveFromArrow(changValue[0].ownerDocument.activeElement)
        // console.log("chang value : ", chang_value[0].ownerDocument.activeElement)
        max--
    }
}

async function accessRangeUseArrowKey (max , min) {
    console.log(max ,min)

    let i = min

    let containContentElement = []
    let valueActive = null

    // press up arrow
    do{
        const changValue = await promisify(cy.get('body').type('{uparrow}'))
        valueActive = changValue[0].ownerDocument.activeElement

        containContentElement.push(valueActive)

        focusedElementActiveFromArrow(valueActive)
        console.log("chang value : ", changValue[0].ownerDocument.activeElement)
        
        i++
    }while (i <= max) 

     // press down arrow
     accessNumberUseDownArrow(max , min)

      // select data element
    selectHideContent(containContentElement)
}

const focusedElementActiveFromArrow = (el) => {
    const current_element = el
    const active_element = cy.state('document').activeElement
    expect(current_element, 'active_element').to.equals(active_element)
}