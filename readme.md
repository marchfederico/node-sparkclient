Node Cisco Spark Client
===========================================

[node-sparkclient](https://github.com/marchfederico/node-sparkclient) is node Cisco Spark module. It provides a simple way to work with the Cisco Spark APIs

## Installation

`npm install node-sparkclient`

## Usage

This module assumes you have received an access token from the Cisco Spark Oauth2 service.

## The  Cisco Spark Client Library Functions

### Pagination
All list api function calls support pagination. To get the next page of results, simply call the specific list function with 'next' as the first parameter.  Examples below.

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
        if (!err) {
            for (i=0;i<rooms.items.length;i++) {
                console.log(rooms.items[i].id)
                console.log(rooms.items[i].title)
                console.log(rooms.items[i].created)
                console.log(rooms.items[i].lastActivity)
            }
            //get the next 10 rooms
            sparkClient.listRooms("next", function(err, rooms) {
                //do something else here
                for (i=0;i<rooms.items.length;i++) {
                    console.log(rooms.items[i].id)
                    console.log(rooms.items[i].title)
                    console.log(rooms.items[i].created)
                    console.log(rooms.items[i].lastActivity)
                }
            })
        }
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
                //If Spark message contains files, messages.items[i].files will be an array of URLs to the document(s) in that message
                //Like in the Spark client, a user can only access file URLs for documents in rooms they are a member of
                if (messages.items[i].files) {
                    for (x=0;x<messages.items[i].files.length;x++) {
                        fileURL = messages.items[i].files[x]
                        console.log(fileURL)
                    }
                }
            }
             //support for pagination
             sparkClient.listMessages("next",function(err,messages){
                // do something here
             })
    })
```

#### CiscoSparkClient.createMessage(personOrRoomId, messageText, \[messageParams\], callback)
If creating a message is successful, a response object will be returned containing the message parameters returned above for listMessages
```javascript
    messageParams = {}  // Message Parameters are optional
    messageParams.file = 'https://web.ciscospark.com/images/logo_spark_256px.png'  // The file to attach to the message.  

    //You can also directly upload a file by passing in a file buffer, in which case the returned Spark response will include the file ID. When directly uploading a file you must specify a filename.

    var data = fs.readFileSync('document.xlsx');
    messageParams.file = data
    messageParams.filename = 'My uploaded file.xlsx'

    //To set the type of your messageText to HTML or Markdown set messageParams.html messageParams.markdown to true.  If both are set, message will be sent as markdown.
    //messageParams.html = true

    // for a direct 1:1 message just use the users email address as the first parameter or person id
    sparkClient.createMessage('marfeder@cisco.com', 'Hello!', messageParams, function(err, response) {
        if (!err)
            console.dir(response.id)
    })

    // or send to a room by using the room id as the first parameter
    sparkClient.createMessage('Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2', 'Hello!', messageParams, function(err, response) {
            if (!err)
                console.dir(response.id)
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
            //If Spark message contains files, message.files will be an array of URLs to the document(s) in that message
            //Like in the Spark client, a user can only access file URLs for documents in rooms they are a member of
            if (message.files) {
                for (x=0;x<messages.files.length;x++) {
                    fileURL = messages.files[x]
                    console.log(fileURL)
                }
            }
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

#### CiscoSparkClient.getFile(fileURL, callback)
```javascript
    // Get fileInfo and fileData from a file URL returned by the getMessage function.  fileInfo is a JSON object containing the fileName, contentType, and contentLength in bits.  fileData is a buffer object containing the unencoded binary data.
	sparkClient.getFile("https://api.ciscospark.com/v1/contents/Y2lzY29zcGFyazovL3VzL0NPTlRFTlQvMDVmOGMwNDAtNDFiNy0xMmY1LTc0NDctOWM3ZTQ5M2U2MzJiLzA", function (err, fileInfo, fileData) {
    	if (!err) {
            console.log(fileInfo.fileName)
            console.log(fileInfo.contentType)
            console.log(fileInfo.contentLength)
            path = './'+fileInfo.fileName
            fs.writeFile(path,filedata, function(err){
                if (err) throw err;
                console.log('Saved file to '+path)
            })
        }
    })
```

#### CiscoSparkClient.getFileInfo(fileURL, callback)
```javascript
    // To save bandwidth and performance, get information about a file without actually retrieving the file.  Requires a file URL returned by the getMessage function or from an inbound Webhook.  JSON object containing the fileName, contentType, and contentLength in bits.
    sparkClient.getFileInfo("https://api.ciscospark.com/v1/contents/Y2lzY29zcGFyazovL3VzL0NPTlRFTlQvMDVmOGMwNDAtNDFiNy0xMmY1LTc0NDctOWM3ZTQ5M2U2MzJiLzA", function (err, filename) 
    {
    	if (!err) {
    		console.log(fileInfo.fileName)
            console.log(fileInfo.contentType)
            console.log(fileInfo.contentLength)
    	}
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
Memberships represent a person's relationship to a room. Use this API to list members of any room that you're in or create memberships to invite someone to a room. Memberships can also be updated to make someone a moderator or deleted to remove them from the room.
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
### Team Functions
Teams are groups of people with a set of rooms that are visible to all members of that team. This API is used to manage the teams themselves. Teams are created and deleted with this API. You can also update a team to change its team, for example.  Teams are by design "moderated" and the user creating a Team is automatically a moderator.  To administer a team through this API you must be a moderator of that team. 

To manage people in a team, see the Team Membership API functions.  To manage team rooms, see the Room API functions.
#### CiscoSparkClient.listTeams(maxTeams, callback)
```javascript
    sparkClient.listTeams(5, function(err, teams) {
        if (!err) {
            for (i=0;i<teams.items.length;i++) {
                console.log(teams.items[i].id)
                console.log(teams.items[i].name)
                console.log(teams.items[i].created)
            }
            //get the next 5 teams
            sparkClient.listTeams("next", function(err, teams) {
                //do something else here
                for (i=0;i<teams.items.length;i++) {
                    console.log(teams.items[i].id)
                    console.log(teams.items[i].name)
                    console.log(teams.items[i].created)
                }
            })
        }
    })
```

#### CiscoSparkClient.createTeam(name, callback)
```javascript
    sparkClient.createTeam("My New Team", function(err, team) {
        if (!err)
            console.log(team.id)
            console.log(team.name)
            console.log(team.created)
    })
```

#### CiscoSparkClient.updateTeam(teamId,name, callback)
```javascript
    sparkClient.updateTeam("Y2lzY29zcGFyazovL3VzL1RFQU0vMTIyY2dkYTEtNDMyOC0xMmU2LTlmYTgtNjE2NWNhMmNhNDU5", "New Team Name", function(err, team) {
        if (!err)
            console.log(team.id)
            console.log(team.name)
            console.log(team.created)
    })
```

#### CiscoSparkClient.getTeam(teamId, callback)
```javascript
    sparkClient.getTeam("Y2lzY29zcGFyazovL3VzL1RFQU0vMTIyY2dkYTEtNDMyOC0xMmU2LTlmYTgtNjE2NWNhMmNhNDU5", function(err, team) {
        if (!err)
            console.log(team.id)
            console.log(team.name)
            console.log(team.created)
    })
```

#### CiscoSparkClient.deleteTeam(teamId, callback)
```javascript
    sparkClient.deleteTeam("Y2lzY29zcGFyazovL3VzL1RFQU0vMTIyY2dkYTEtNDMyOC0xMmU2LTlmYTgtNjE2NWNhMmNhNDU5", function(err, response) {
        if (!err)
            console.log(response.message)
    })
```

---
### Team Membership Functions
Similarly to how room memberships function, users can also be members of a team. Use this API to list members of any team that you're in, or create memberships to add someone to a team. Memberships can also be updated to make someone a moderator or deleted to remove them from the team.

Just like in the Spark app, you must be a member of the team in order to list its memberships or invite people.

#### CiscoSparkClient.listTeamMemberships(teamId, \[queryParams\], callback)
```javascript

// Query Parameters are optional to refine the search or set max results
// queryParams.max = 10

queryParams = {}  
queryParams.max = 5

sparkClient.listTeamMemberships("Y2lzY29zcGFyazovL3VzL1RFQU0vMTIyY2dkYTEtNDMyOC0xMmU2LTlmYTgtNjE2NWNhMmNhNDU5",queryParams, function(err, teamMemberships) {
    if (!err)
        for (i=0;i<teamMemberships.items.length;i++) {
            console.log(teamMemberships.items[i].id)
            console.log(teamMemberships.items[i].teamId)
            console.log(teamMemberships.items[i].personId)
            console.log(teamMemberships.items[i].personEmail)
            console.log(teamMemberships.items[i].personDisplayName)
            console.log(teamMemberships.items[i].isModerator)
            console.log(teamMemberships.items[i].created)
        }
        //support for pagination
        sparkClient.listTeamMemberships("next",function(err,teamMemberships){
            //Do something with next results
            if (!err) {
                for (i=0;i<teamMemberships.items.length;i++) {
                    
                    console.log(teamMemberships.items[i].id)
                    console.log(teamMemberships.items[i].personDisplayName)
                }
            }
           
        })

})
```
#### CiscoSparkClient.createTeamMembership(roomId, emailOrId, isModerator, callback)
```javascript

//You can add a person to a team with only their email address
sparkClient.createTeamMembership("Y2lzY29zcGFyazovL3VzL1RFQU0vZWE3MjdmMTAtNTQ1ZS0xMWU2LTljMjAtZjc2N2Y3ZTY3ZGE1","marfeder@ciscospark.com", true, function(err, response) {
    if (!err)
        console.log(response.id)
        console.log(response.teamId)
        console.log(response.personId)
        console.log(response.personEmail)
        console.log(response.personDisplayName)
        console.log(response.isModerator)
        console.log(response.created)
})

// or you can add a person to a room with their id
sparkClient.createTeamMembership("Y2lzY29zcGFyazovL3VzL1JPT00vZjcwZjQ0ODAtYTA1Ny0xMWU1LTg4MTktODNkODA5ZDZlZjc2", "Y2lzY29zcGFyazovL3VzL1BFT1BMRS83M2YwNThiZS01MTRjLTQ5OTAtYTkyZi00MWNlY2M4NWFiMzc", false, function(err, response) {
     if (!err)
        console.dir(response.message)
})

```
#### CiscoSparkClient.getTeamMembership(membershipId, callback)
```javascript
//Get a specific Team Membership
sparkClient.getTeamMembership("Y2lzY29zcGFyazovL3VzL1RFQU1fTUVNQkVSU0hJUC9kOTMyNGE3MS00MmQ3LTQyYjUtOGI3Zi03MWM1MTY3NTY2ZWY6ZWE3MjdmMTAtNTQ1ZS0xMWU2LTljMjAtZjc2N2Y3ZTY3ZGE1", function(err, membership) {
    if (!err) {
        console.log(membership.id)
        console.log(membership.teamId)
        console.log(membership.personId)
        console.log(membership.personEmail)
        console.log(membership.personDisplayName)
        console.log(membership.isModerator)
        console.log(membership.created)
    }
})
```
#### CiscoSparkClient.updateTeamMembership(membershipId, isModerator, callback)
```javascript
//Update a users team membership to set and/or remove moderator privileges
sparkClient.updateTeamMembership("Y2lzY29zcGFyazovL3VzL1RFQU1fTUVNQkVSU0hJUC9kOTMyNGE3MS00MmQ3LTQyYjUtOGI3Zi03MWM1MTY3NTY2ZWY6ZWE3MjdmMTAtNTQ1ZS0xMWU2LTljMjAtZjc2N2Y3ZTY3ZGE1", false, function (err, membership) {
    if (!err) {
        console.log(membership.id)
        console.log(membership.teamId)
        console.log(membership.personId)
        console.log(membership.personEmail)
        console.log(membership.personDisplayName)
        console.log(membership.isModerator)
        console.log(membership.created)
    }
})
```
#### CiscoSparkClient.deleteTeamMembership(membershipId, callback)
```javascript
//Remove a user from a team
sparkClient.deleteTeamMembership("Y2lzY29zcGFyazovL3VzL1RFQU1fTUVNQkVSU0hJUC9kOTMyNGE3MS00MmQ3LTQyYjUtOGI3Zi03MWM1MTY3NTY2ZWY6ZWE3MjdmMTAtNTQ1ZS0xMWU2LTljMjAtZjc2N2Y3ZTY3ZGE1", function(err, response) {
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
sparkClient.updateWebhook("Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNDY3ODBhMTUtNTg1Yy00OWQ1LTkyOGYtZWRhMDEwZDIwNzcx","NewName","https://www.tpcall.me/newpost", function(err, webhook) {
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
