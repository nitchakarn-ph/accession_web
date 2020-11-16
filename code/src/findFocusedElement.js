// set local reference to lodash and jquery
const { _, $ } = Cypress

import promisify from 'cypress-promise'
import accessionElementOnWebPage from '../src/accessionElementOnWebPage'
import visitedMenuOnRow from '../src/accessionMenu'

module.exports = function visitedFirstElementWithTab() {
    cy.log('visit first element with tab key')
    cy.tab()
        .then(($firstElem) => {
            beFocused($firstElem)

            // check first element have attribute role
            checkElementUsingRole($firstElem)

        })
}

const findLastFocusedElement = ($firstElem) => {
    cy.log('visit last element with shift+tab key')
    cy.get($firstElem)
        .tab({ shift: true })
        .then(($lastElem) => {
            console.log($lastElem , $firstElem)

            accessionElementOnWebPage($firstElem[0], $lastElem[0])
        })
}

async function checkElementUsingRole(el) {
    console.log("check element have role attribute", el[0])

    let role = ""
    let type = ""

    if (el[0].attributes["role"] != null) {
        role = el[0].attributes["role"].value
        console.log("role ", role)
    }

    if (role == "menuitem") {
        console.log("role element ", role)

        const lastItem = await promisify(cy.get(el).type('{leftarrow}'))
        const lastItemActive = lastItem[0].ownerDocument.activeElement
        console.log("last item active ", lastItemActive)

        // ตรวจสอบว่ามีเมนูทางด้านขวาไหม
        if (lastItemActive != el[0]) {
            console.log("have element on the right")

            // เข้าถึงรายการเมนู
            visitedMenuOnRow(el[0], lastItemActive )
        }

    }
    else if (role == "radio") {
        const lastItem = await promisify(cy.get(el).type('{leftarrow}'))
        const lastItemActive = lastItem[0].ownerDocument.activeElement
        console.log("last item active ", lastItemActive)

        // ตรวจสอบว่ามีเมนูทางด้านขวาไหม
        if (lastItemActive != el[0]) {
            console.log("have element on the right")

            // เข้าถึงรายการ radio element
            accessionRadio(el, lastItemActive)
        }
    }
    else if (role == "slider") {

        let min = ""
        let max = ""
        if (el[0].attributes["aria-valuemin"] != null && el[0].attributes["aria-valuemax"] != null) {
            min = parseInt(el[0].attributes["aria-valuemin"].value)
            max = parseInt(el[0].attributes["aria-valuemax"].value)
            accessNumberUseUpArrow(max, min , el)
        }

    }
    else if (role == "spinbutton") {
        console.log("spinbutton")

        const lastItem = await promisify(cy.get(el).tab({ shift: true }))
        const lastItemActive = lastItem[0].ownerDocument.activeElement
        console.log("last item active ", lastItemActive)

        if (lastItemActive != el[0]) {
            console.log("have element on the right")
            accessionSpinbutton(el, lastItemActive)
        } else {
            findLastFocusedElement(el)
        }

    }else if (el[0].attributes["type"] != null) {
             // ตรวจสอบว่า element มีการใช้ type attribute
            type = el[0].attributes["type"].value
            console.log("type element ", type)

            // ตรวจสอบว่า type == "radio"
            if (type == "radio") {
                console.log("radio ", type, el)
                const lastItem = await promisify(cy.get(el).type('{leftarrow}'))
                const lastItemActive = lastItem[0].ownerDocument.activeElement
                console.log("last item active ", lastItemActive)

                // ตรวจสอบว่ามีเมนูทางด้านขวาไหม
                if (lastItemActive != el[0]) {
                    console.log("have element on the right")

                    // เข้าถึงรายการ radio element
                    accessRadioStandard(lastItemActive)
                }
                
            } else {
                findLastFocusedElement(el)
            }

    } else {

            findLastFocusedElement(el)
    }
    
}

async function accessionRadio(first, last) {
    console.log("Row\nfirst radio : ", first, "\nlast radio : ", last)

    /**
     * @type {HTMLCollection}
     */
    let previousRadio = null

    let duplicatedRadio = false
    // // let i = 0

    do {
        const next = await promisify(cy.get('body').type('{rightarrow}'))
        const nextActive = next[0].ownerDocument.activeElement
        beFocusedArrowKey(nextActive)
        // currentRadio = next[0].ownerDocument.activeElement

        if (nextActive == first[0] && previousRadio == last) {
            duplicatedRadio = true
            console.log("duplicated radio : ", duplicatedRadio)
        } else {
            previousRadio = nextActive
            console.log(previousRadio)

        }

        // i++
    } while (!duplicatedRadio)

    console.log(first)
    findLastFocusedElement(first)

}


async function accessRadioStandard (lastRadio) {
    console.log("accession last radio use arrow key : \n" , lastRadio)

    const first = await promisify(cy.get('body').tab())

    let dupRadio = false
    let currRadio = null
    let containContentElement = []

    do{
        const nextRadio = await promisify(cy.get('body').type('{downarrow}'))
        currRadio = nextRadio[0].ownerDocument.activeElement
        beFocusedArrowKey(currRadio)

        if( currRadio == lastRadio){
            dupRadio = true
            console.log("duplicated radio element !!")
        }else{
            containContentElement.push(currRadio)
        }

    }while(!dupRadio)

    findLastFocusedElement(first)
}


async function accessNumberUseUpArrow(max, min , first) {
    let i = min

    // press up arrow
    do {
        const changValue = await promisify(cy.get('body').type('{uparrow}'))
        beFocusedArrowKey(changValue[0].ownerDocument.activeElement)
        console.log("chang value : ", changValue[0].ownerDocument.activeElement)
        i++
    } while (i <= max)

    // press down arrow
    accessNumberUseDownArrow(max, min , first)

    findLastFocusedElement(first)
}

async function accessNumberUseDownArrow(max, min, first) {
    let i = min

    while (i <= max) {
        const changValue = await promisify(cy.get('body').type('{downarrow}'))
        beFocusedArrowKey(changValue[0].ownerDocument.activeElement)
        // console.log("chang value : ", chang_value[0].ownerDocument.activeElement)
        max--
    }

    // findLastFocusedElement(first)
}

async function accessionSpinbutton(firstItem, lastItem) {
    /**
     * @type {HTMLCollection}
     */
    let previousRadio = null
    let duplicatedRadio = false

    let min = ""
    let max = ""

    do {
        const next = await promisify(cy.tab())

        if (next[0] == firstItem[0] && previousRadio == lastItem) {
            duplicatedRadio = true
            console.log("duplicated radio : ", duplicatedRadio)
        } else {
            previousRadio = next[0]
            console.log(previousRadio)

            if (previousRadio.attributes["aria-valuemin"] != null && previousRadio.attributes["aria-valuemax"] != null) {
                min = parseInt(previousRadio.attributes["aria-valuemin"].value)
                max = parseInt(previousRadio.attributes["aria-valuemax"].value)
                console.log(min, max)
                accessNextItem(max, min)
            }

        }

    } while (!duplicatedRadio)

    findLastFocusedElement(firstItem)
}

async function accessNextItem(max, min) {
    let i = min

    // press up arrow
    do {
        const changValue = await promisify(cy.get('body').type('{uparrow}'))
        beFocusedArrowKey(changValue[0].ownerDocument.activeElement)
        console.log("chang value : ", changValue[0].ownerDocument.activeElement)
        i++
    } while (i <= max)

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


