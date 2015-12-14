var CiscoSparkClient = require('../index')
var accessToken = process.env.SPARK_ACCESS_TOKEN

var sparkClient = new CiscoSparkClient(accessToken)

sparkClient.createRoom('My New Room',function(err,room){
    if (!err)
    {
        console.log("Room Created")
        sparkClient.createMessage(room.id,"my first message",function(err,message){
            if (!err)
                console.log("Message Posted")
            else
                console.log("Error Posting Message ("+err.message+")")
        })

    }
    else
    {
        console.log("Error Creating Room ("+err.message+")")
    }
})