const { _, $ } = Cypress
import promisify from 'cypress-promise'
import selectHideContent from '../src/selectHideContent'
import accessionContent from '../src/accessionElementOnWebPage'

module.exports = async function visitedMenuOnRow(firstItem, lastItem) {
    console.log("header menu item , fist menu :", firstItem, "\nlast menu : ", lastItem)

    const lastElement = await promisify(cy.get('body').tab({ shift: true }))
    console.log(lastElement[0])


    /**
     * @type {HTMLCollection}
     */
    let previous = null
    let current = null
    let containMenu = []
    let duplicated = false

    do {
        const currentMenuHead = await promisify(cy.get('body').type('{rightarrow}'))
        current = currentMenuHead[0].ownerDocument.activeElement
        beFocusedArrowKey(current)

        if (current == null) {
            duplicated = true
        }

        if (current == firstItem && previous == lastItem) {
            duplicated = true
            console.log("duplicated header menu item" , duplicated)
        } else {
            previous = current
            // console.log("update previous \n" , previous)

            containMenu.push(previous)

            // check head menu item have submenu or not
            if (current.attributes["aria-expanded"] != undefined) {
                if(current.attributes["aria-expanded"].value == "false"){
                    const submenu = accessionMenuColumn(previous)

                    submenu.then(function (v) {
                        console.log(v)

                        v.forEach((item) => {
                            containMenu.push(item)
                        })
                    })
                }
                
            }
        }

    } while (!duplicated)


    console.log("contain menu : " , containMenu)
    selectHideContent(containMenu)

    accessionContent(firstItem , lastElement[0])

}

async function accessionMenuColumn(el) {

    console.log("visited Menu On Col --------> " , el)

    /**
   * @type {HTMLCollection}
   */
    let previous = null

    const doc = el.ownerDocument
    let ariaPopup = null
    let duplicated = false

    // console.log("select menu item drop ")
    const firstList = await promisify(cy.get(el).type('{downarrow}'))
    const activeFirst = firstList[0].ownerDocument.activeElement
    console.log(activeFirst)

    const lastList = await promisify(cy.get(activeFirst).type('{uparrow}'))
    const activeLast = lastList[0].ownerDocument.activeElement
    console.log(activeLast)

    const contain = []

    if (activeFirst != activeLast) {
        do {
            const nextList = await promisify(cy.get('body').type('{downarrow}'))
            beFocusedArrowKey(nextList[0].ownerDocument.activeElement)

            ariaPopup = nextList[0].ownerDocument.activeElement.attributes["aria-haspopup"]

            if (nextList[0] == null) {
                duplicated = true
            }

            if (nextList[0].ownerDocument.activeElement == activeFirst && previous == activeLast) {
                duplicated = true
                console.log("duplicated menu item on the col, Please press esc ")

                cy.get(nextList)
                    .type('{esc}', { parseSpecialCharSequences: true })

            } else {
                previous = nextList[0].ownerDocument.activeElement
                // console.log("previous : " , previous)

                contain.push(previous)
               
                if (ariaPopup != undefined && nextList[0].ownerDocument.activeElement.attributes["aria-haspopup"].value == "true") {
                    // select sub menu
                    console.log(ariaPopup , "\nDOM : " , previous)
                    const submenu = visitSubMenu(nextList)

                    submenu.then(function(v) {
                        v.forEach((item) => {
                            contain.push(item)
                        })
                    })
                }
                
            }

        } while (!duplicated)
    }

    console.log("visited -------->" , contain)

    return contain
}

async function visitSubMenu(el) {

    const firstSub = await promisify(cy.get(el).type('{rightarrow}'))
    const firstSubActive = firstSub[0].ownerDocument.activeElement
    beFocusedArrowKey(firstSubActive)

    const lastSub = await promisify(cy.get(firstSub).type('{uparrow}'))
    const lastSubActive = lastSub[0].ownerDocument.activeElement
    beFocusedArrowKey(lastSubActive)

    let previousSub = null
    let duplicated = false

    const contain = []

    do {
        const currentSub = await promisify(cy.get('body').type('{downarrow}'))
        beFocusedArrowKey(currentSub[0].ownerDocument.activeElement)
        // console.log(currentSub[0].ownerDocument.activeElement)

        if (currentSub[0].ownerDocument.activeElement == firstSubActive && previousSub == lastSubActive) {
            duplicated = true
            console.log("duplicated submenu, Please press esc")
            cy.get(currentSub).type('{esc}', { parseSpecialCharSequences: true })

        } else {
            previousSub = currentSub[0].ownerDocument.activeElement
            // console.log("update previous sub menu")
            contain.push(previousSub)
        }

    } while (!duplicated)

    return contain
}

const beFocusedArrowKey = (el) => {
    const current_element = el
    const active_element = cy.state('document').activeElement
    expect(current_element, 'active_element').to.equals(active_element)
}
