Node Cisco Spark
===========================================

[node-ciscospark](https://github.com/marchfederico/node-ciscospark) is node Cisco Spark module. It provides a simple way to work with the Cisco Spark APIs

## Installation

`npm install node-ciscospark`

## Usage

This module assumes you have received an access token from the Cisco Spark Oauth2 service.

## The  Cisco Spark Client Library Functions

### Pagination
All list api function calls support pagination. To get the next page of results, simply call the list specific list function with 'next' as the first parameter.  Examples below.

### Create the Spark Client object

#### CiscoSparkClient(accessToken)
```javascript
    var sparkClient = new CiscoSparkClient('Kjc0YTA5MWUtZTJlYi00NzNhLWI2NGQtYzAxOGJkZjat27ZlMzZkY2U2OWQtNTdi')
```
---

### Room Functions
Rooms are virtual meeting place where people post messages and collaborate to get work done. This API is used to manage the rooms themselves.
#### CiscoSparkClient.listRooms(maxRooms, callback)
```javascript
    sparkClient.listRooms(10, function(err, rooms) {
        if (!err)
            for (i=0;i<rooms.items.length;i++) {
                console.log(rooms.items[i].id)
                console.log(rooms.items[i].title)
                console.log(rooms.items[i].created)
                console.log(rooms.items[i].lastActivity)
            }
            //get the next 5 rooms
            sparkClient.listRoom("next", function(err, rooms) {
              /... do domething here
            })
    })
```

#### CiscoSparkClient.createRoom(title, callback)
```javascript
    sparkClient.createRoom("My New Room", function(err, room) {
        if (!err)
            console.log(room.id)
            console.log(room.title)
            console.log(room.created)
    })
```

#### CiscoSparkClient.updateRoom(roomId,title, callback)
```javascript
    sparkClient.updateRoom("Y2lzY29zcGFyazovL3VzL1JPT00vY2ZjNmY5NzAtYTAzNi0xMWU1LWJlOGYtODVmMTM2MmM4YWZk", "New Title", function(err, room) {
        if (!err)
            console.log(room.id)
            console.log(room.title)
            console.log(room.created)
    })
```

#### CiscoSparkClient.getRoom(roomId, callback)
```javascript
    sparkClient.getRoom("Y2lzY29zcGFyazovL3VzL1JPT00vNDAyNjRhZjAtOWVlYy0xMWU1LTkwOGEtODUyZTZhOGJlMTBh", function(err, room) {
        if (!err)
            console.log(room.id)
            console.log(room.title)
            console.log(room.created)
            console.log(room.lastActivity)
    })
```

#### CiscoSparkClient.deleteRoom(roomId, callback)
```javascript
    sparkClient.deleteRoom("Y2lzY29zcGFyazovL3VzL1JPT00vNDAyNjRhZjAtOWVlYy0xMWU1LTkwOGEtODUyZTZhOGJlMTBh", function(err, response) {
        if (!err)
            console.log(response.message)
    })
```
---
### Message Functions
Messages are how we communicate in a room. In Spark, each message is displayed on its own line along with a timestamp and sender information. Use this API to list, create, and delete messages.
#### CiscoSparkClient.listMessages(roomId, \[queryParams\], callback)
```javascript
    queryParams = {}  // Query Parameters are optional
    queryParams.before = '2015-12-11T22:44:10.511Z'
    queryParams.beforeMessage = 'Y2lzY29zcGFyazovL3VzL01FU1NBR0UvYjFjYjExZjAtYTA1OC0xMWU1LThjYTUtZjc1OTUwNjk2NzZk'
    queryParams.max = 10

    sparkClient.listMessages("Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2", queryParams, function(err, messages) {
        if (!err)
            for (i=0;i<messages.items.length;i++) {
                console.log(messages.items[i].id)
                console.log(messages.items[i].roomId)
                console.log(messages.items[i].personId)
                console.log(messages.items[i].personEmail)
                console.log(messages.items[i].created)
                console.log(messages.items[i].text)
            }
             //support for pagination
             sparkClient.listMessages("next",function(err,messages){
                // do something here
             })
    })
```

#### CiscoSparkClient.createMessage(personOrRoomId, messageText, \[messageParams\], callback)
```javascript
    messageParams = {}  // Message Parameters are optional
    messageParams.file = 'https://web.ciscospark.com/images/logo_spark_256px.png'  // The file to attach to the message

    // for a direct 1:1 message just use the users email address as the first parameter or person id
    sparkClient.createMessage('marfeder@cisco.com', 'Hello!', messageParams, function(err, response) {
        if (!err)
            console.dir(response.message)
    })

    // or send to a room by using the room id as the first parameter
    sparkClient.createMessage('Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2', 'Hello!', messageParams, function(err, response) {
            if (!err)
                console.dir(response.message)
        })

```

#### CiscoSparkClient.getMessage(messageId, callback)
```javascript
    sparkClient.getMessage("Y2lzY29zcGFyazovL3VzL01FU1NBR0UvYjEzN2Y5YjAtYTA1OC0xMWU1LThjYTUtZjc1OTUwNjk2NzZk", function(err, message) {
        if (!err) {
            console.log(message.id)
            console.log(message.roomId)
            console.log(message.personId)
            console.log(message.personEmail)
            console.log(message.created)
            console.log(message.text)
        }
   })
```

#### CiscoSparkClient.deleteMessage(messageId, callback)
```javascript
    sparkClient.deleteMessage("Y2lzY29zcGFyazovL3VzL01FU1NBR0UvYjEzN2Y5YjAtYTA1OC0xMWU1LThjYTUtZjc1OTUwNjk2NzZk", function(err, response) {
        if (!err)
            console.log(response.message)
    })
```

---
### People Functions
People are registered users of the Spark application. Currently, people can only be searched with this API.
#### CiscoSparkClient.listPeople(emailOrName, \[maxResults\], callback)
```javascript
sparkClient.listPeople("marcello",2,function(err,people){
     if (!err)
          for (i=0;i<people.items.length;i++) {
            console.log(people.items[i].id)
            console.log(people.items[i].emails)
            console.log(people.items[i].displayName)
            console.log(people.items[i].avatar)
            console.log(people.items[i].created)

          }

        //support for pagination
        sparkClient.listPeople("next",function(err,people){
           // do something here
        })

})
```
#### CiscoSparkClient.getPerson(personId, callback)
```javascript
sparkClient.getPerson("Y2lzY29zcGFyazovL3VzL1BFT1BMRS83M2YwNThiZS01MTRjLTQ5OTAtYTkyZi00MWNlY2M4NWFiMzc", function(err, person) {
    if (!err) {
         console.log(person.id)
         console.log(person.emails)
         console.log(person.displayName)
         console.log(person.avatar)
         console.log(person.created)
    }
})
```
#### CiscoSparkClient.getMe(callback)
```javascript
sparkClient.getMe(function(err, me) {
    if (!err) {
         console.log(me.id)
         console.log(me.emails)
         console.log(me.displayName)
         console.log(me.avatar)
         console.log(me.created)
    }
})
```

---
### Membership Functions
Memberships represent a person's relationship to a room. Use this API to list members of any room that you're in or create memberships to invite someone to a room. Memberships can also be updated to make someome a moderator or deleted to remove them from the room.
Just like in the Spark app, you must be a member of the room in order to list its memberships or invite people.
#### CiscoSparkClient.listMemberships(roomId, \[queryParams\], callback)
```javascript
queryParams = {}  // Query Parameters are optional
queryParams.max = 10

// refine the search by personId or personEmail
// queryParams.personId = 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS83M2YwNThiZS01MTRjLTQ5OTAtYTkyZi00MWNlY2M4NWFiMzc'
// queryParams.personEmail = 'marfeder@cisco.com'

sparkClient.listMemberships("Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2", queryParams, function(err, memberships) {
    if (!err)
        for (i=0;i<memberships.items.length;i++) {
            console.log(memberships.items[i].id)
            console.log(memberships.items[i].personId)
            console.log(memberships.items[i].personEmail)
            console.log(memberships.items[i].roomId)
            console.log(memberships.items[i].isModerator)
            console.log(memberships.items[i].isMonitor)
            console.log(memberships.items[i].created)
        }
        //support for pagination
        sparkClient.listMemberships("next",function(err,memberships){
           // do something here
        })

})
```
#### CiscoSparkClient.createMembership(roomId, emailOrId, isModerator, callback)
```javascript

// You can add a person to a room with only their email address
sparkClient.createMessage(Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2,'marfeder@cisco.com', false, function(err, response) {
    if (!err)
        console.dir(response.message)
})

// or you can add a person to a room with their id
sparkClient.createMessage('Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2', 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS83M2YwNThiZS01MTRjLTQ5OTAtYTkyZi00MWNlY2M4NWFiMzc', false, function(err, response) {
     if (!err)
        console.dir(response.message)
})

```
#### CiscoSparkClient.getMembership(membershipId, callback)
```javascript

sparkClient.getMembership("Y2lzY29zcGFyazovL3VzL01FTUJFUlNISVAvNzNmMDU4YmUtNTE0Yy00OTkwLWE5MmYtNDFjZWNjODVhYjM3OmY3MGY0NDgwLWEwNTctMTFlNS04ODE5LTgzZDgwOWQ2ZWY3Ng", function(err, membership) {
    if (!err) {
         console.log(membership.id)
         console.log(membership.personId)
         console.log(membership.personEmail)
         console.log(membership.roomId)
         console.log(membership.isModerator)
         console.log(membership.isMonitor)
         console.log(membership.created)
    }

})
```
#### CiscoSparkClient.updateMembership(membershipId, isModerator, callback)
```javascript
sparkClient.updateMembership("Y2lzY29zcGFyazovL3VzL01FTUJFUlNISVAvNzNmMDU4YmUtNTE0Yy00OTkwLWE5MmYtNDFjZWNjODVhYjM3OmY3MGY0NDgwLWEwNTctMTFlNS04ODE5LTgzZDgwOWQ2ZWY3Ng", true, function(err, membership) {
    if (!err)
         console.log(membership.id)
         console.log(membership.personId)
         console.log(membership.personEmail)
         console.log(membership.roomId)
         console.log(membership.isModerator)
         console.log(membership.isMonitor)
         console.log(membership.created)
})
```
#### CiscoSparkClient.deleteMembership(membershipId, callback)
```javascript
sparkClient.deleteRoom("Y2lzY29zcGFyazovL3VzL01FTUJFUlNISVAvNzNmMDU4YmUtNTE0Yy00OTkwLWE5MmYtNDFjZWNjODVhYjM3OmY3MGY0NDgwLWEwNTctMTFlNS04ODE5LTgzZDgwOWQ2ZWY3Ng", function(err, response) {
    if (!err)
        console.log(response.message)
})
```
---
### Webhook Functions
Webhooks allow your app to be notified via HTTP when a specific event occurs on Spark. For example, your app can register a webhook to be notified when a new message is posted into a specific room.
Events trigger in near real-time allowing your app and backend IT systems to stay in sync with new content and room activity.
#### CiscoSparkClient.listWebhooks(max, callback)
```javascript
sparkClient.listWebhooks(5, function(err, webhooks) {
    if (!err)
        for (i=0;i<webhooks.items.length;i++) {
            console.log(webhooks.items[i].id)
            console.log(webhooks.items[i].name)
            console.log(webhooks.items[i].resource)
            console.log(webhooks.items[i].event)
            console.log(webhooks.items[i].targetUrl)
            console.log(webhooks.items[i].filter)
        }
        //support for pagination
        sparkClient.listWebhooks("next",function(err,webhooks){
           // do something here
        })


})
```

#### CiscoSparkClient.createWebhook(name, target, roomId, \[webhookParams\], callback)
```javascript
sparkClient.createWebhook("MyNewWebhook", "https://www.tpcal.me/post", "Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2", function(err,webhook){
       if (!err) {
           console.log(webhook.id)
           console.log(webhook.name)
           console.log(webhook.resource)
           console.log(webhook.event)
           console.log(webhook.targetUrl)
           console.log(webhook.filter)
       }
})
```
#### CiscoSparkClient.getWebhook(webhookId, callback)
```javascript
sparkClient.getWebhook("Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNDY3ODBhMTUtNTg1Yy00OWQ1LTkyOGYtZWRhMDEwZDIwNzcx", function(err, webhook) {
       if (!err) {
           console.log(webhook.id)
           console.log(webhook.name)
           console.log(webhook.resource)
           console.log(webhook.event)
           console.log(webhook.targetUrl)
           console.log(webhook.filter)
       }
})
```
#### CiscoSparkClient.updateWebhookfunction(webhookId, name, target, callback)
```javascript
sparkClient.getWebhook("Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNDY3ODBhMTUtNTg1Yy00OWQ1LTkyOGYtZWRhMDEwZDIwNzcx","NewName","https://www.tpcall.me/newpost", function(err, webhook) {
       if (!err) {
           console.log(webhook.id)
           console.log(webhook.name)
           console.log(webhook.resource)
           console.log(webhook.event)
           console.log(webhook.targetUrl)
           console.log(webhook.filter)
       }
})
```
#### CiscoSparkClient.deleteWebhook(webhookId, callback)
```javascript
sparkClient.deleteWebhook("Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNDY3ODBhMTUtNTg1Yy00OWQ1LTkyOGYtZWRhMDEwZDIwNzcx", function(err, response) {
    if (!err)
        console.log(response.message)
})
```