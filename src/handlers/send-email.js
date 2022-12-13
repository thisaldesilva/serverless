// import required libraries
const emailHandler = require("emailHandler")
const HTTPHandler = require("HTTPHandler")
const config = require('../../configuration.json')

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS
const DEFAULT_CURRENCY = config.DEFAULT_CURRENCY

exports.sendEmailHandler = async(event) => {
    console.log("*************************** EXCECUTING sendEmailHandler ************************************")

    const eventData = event.Records[0].dynamodb
    let data = await getPrice(eventData.NewImage.cryptocurrency.S)

    let promise
    if(data != null){
        promise = emailHandler.sendEmail(`Requested ${eventData.NewImage.cryptocurrency.S} Data`, 
            `Hi, \n\nThank you for requesting crypto currency data from our service. Details are given below.\n\n
            ${JSON.stringify(data.data[eventData.NewImage.cryptocurrency.S])} \n\nThank you & Regards,\nThisal De Silva.`,
            eventData.NewImage.email.S, 
            FROM_EMAIL_ADDRESS
        )
    }

    console.log("*************************** FINISHING sendEmailHandler ************************************")
    return promise
}

async function getPrice(cryptocurrency) {

    try{
        const res = await HTTPHandler.getRequest(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrency}&vs_currencies=${DEFAULT_CURRENCY}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=true`)
        //sanitize the data
        let received = {}
        received.data = res.data
        return received
    }
    catch(error){
        return null
    }

}