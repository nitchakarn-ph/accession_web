// set local reference to lodash and jquery
const { _, $ } = Cypress

module.exports = function writeContentElementOnFile (obj){
    if(obj != null){
        cy.writeFile( 'data/elementHide.json' , `[${obj}\n]` , (err) => {
            if(err){
                throw err
            }else{
                console.log('save data element success!!')
            }
        })
        
    }

    // console.log("write file" ,  obj)
    
}
