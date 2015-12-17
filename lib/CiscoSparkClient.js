
var request = require('request')

function CiscoSparkClient(accessToken, apiURL) {
    this.accessToken = accessToken
    if (apiURL)
        this.apiURL = apiURL
    else
        this.apiURL = 'https://api.ciscospark.com/v1/'

    this.paginationLinks ={}
    this.paginationLinks['rooms']={}
    this.paginationLinks['people']={}
    this.paginationLinks['messages']={}
    this.paginationLinks['memberships']={}
    this.paginationLinks['webhooks']={}




}

///////////////////
//Helper functions
///////////////////

CiscoSparkClient.prototype._decodeBase64 = function (base64) {
    // Add removed at end '='
    base64 += Array(5 - base64.length % 4).join('=');
    base64 = base64
        .replace(/\-/g, '+') // Convert '-' to '+'
        .replace(/\_/g, '/'); // Convert '_' to '/'
    return new Buffer(base64, 'base64');
};

CiscoSparkClient.prototype._encodeBase64 = function (messageBuffer) {
    // Add removed at end '='
    var message = messageBuffer.toString('base64')
    message = message
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/\=/g, '');

    return message;
};

CiscoSparkClient.prototype._parseLinkHeader = function (linkHeader) {

    var self = this

    if (linkHeader && typeof(linkHeader) == 'string') {
        var linkMatch = /^<(http.+)>; rel="(.+)".*/i
        var linkUrl = linkHeader.match(linkMatch)
        var apiMatch = /.+api\/v1\/(.+)\?.+/i
        var api = linkHeader.match(apiMatch)
        if (api && api[1] && linkUrl && linkUrl[1] && linkUrl[2])
            self.paginationLinks[api[1]][linkUrl[2]] = linkUrl[1]

    }
};

CiscoSparkClient.prototype._post = function(url,data, callback)
{
    var self = this
    var stringData = {}
    try {
        stringData= JSON.stringify(data);

        request(
            {
                method: 'POST'
                , headers: {'content-type': 'application/json;charset=UTF-8'}
                , uri: url
                , body : stringData
                , 'auth': {'bearer': self.accessToken}
            }
            , function (error, response, body) {
                if(error)
                    callback(error)
                else if (response.statusCode == 200)
                    callback(null,JSON.parse(body))
                else
                    callback(JSON.parse(body))
            }
        )
    }
    catch (e)
    {
        callback(e)
    }

}

CiscoSparkClient.prototype._put = function(url,data, callback)
{
    var self = this
    var stringData = {}
    try {
        stringData= JSON.stringify(data);

        request(
            {
                method: 'PUT'
                , headers: {'content-type': 'application/json;charset=UTF-8'}
                , uri: url
                , body : stringData
                , 'auth': {'bearer': self.accessToken}
            }
            , function (error, response, body) {
                if(error)
                    callback(error)
                else if (response.statusCode == 200)
                    callback(null,JSON.parse(body))
                else
                    callback(JSON.parse(body))
            }
        )
    }
    catch (e)
    {
        callback(e)
    }

}

CiscoSparkClient.prototype._get = function(url,qs,callback)
{
    var self = this

    request(
        {
            method: 'GET'
            , headers: {'content-type': 'application/json;charset=UTF-8'}
            , uri: url
            , qs : qs ? qs : {}
            , 'auth': {'bearer': self.accessToken}
        }
        , function (error, response, body) {
            if(error) {
                callback(error)
            }
            else if (response.statusCode == 200) {
                try {
                    self._parseLinkHeader(response.headers.link)
                    callback(null,JSON.parse(body))
                }
                catch (e)
                {
                    callback(e)
                }
            } else {
                try {
                    callback(JSON.parse(body))
                }
                catch(e)
                {
                    callback(e)
                }
            }

        }
    )
}

CiscoSparkClient.prototype._delete = function(url,callback)
{
    var self = this

    request(
        {
            method: 'DELETE'
            , headers: {'content-type': 'application/json;charset=UTF-8'}
            , uri: url
            , 'auth': {'bearer': self.accessToken}
        }
        , function (error, response, body) {
            if(error)
                callback(error)
            else if (response.statusCode == 204)
                callback(null,{message: 'Deleted'})
            else {
                try {

                    callback(JSON.parse(body))
                }
                catch(e)
                {
                    callback(e)
                }
            }

        }
    )
}

////////////////////
//Rooms Functions
////////////////////

CiscoSparkClient.prototype.listRooms = function(maxRooms, callback){
    var self = this
    var url = this.apiURL+"rooms"
    var qs = {}

    if (typeof(maxRooms) == 'function')
        callback  = maxRooms
    else {
        if (typeof(maxRooms) == 'string') {
            if (maxRooms.toLowerCase() == 'next') {
                if (self.paginationLinks.rooms.next != null) {
                    url = self.paginationLinks.rooms.next
                    // erase it since we used it.
                    self.paginationLinks.rooms.next=null
                }else
                {
                    // no link...return an empty list
                    callback(null,{items:[]})
                    return
                }
            }
            else if (maxRooms.toLowerCase() == 'prev') {
                if (self.paginationLinks.rooms.next != null) {
                    url = self.paginationLinks.rooms.prev
                    // erase it since we used it.
                    self.paginationLinks.rooms.prev = null
                }
                else
                {
                    // no link...return an empty list
                    callback(null,{items:[]})
                    return
                }
            }
            else {
                callback({message: 'Invalid parameters'})
                return
            }
        }
        else
            qs.max = maxRooms
    }
    if (callback)
        self._get(url,qs,callback)


}

CiscoSparkClient.prototype.createRoom = function(title, callback){
    var self = this
    var postData={}
    var url = this.apiURL+"rooms"

    if(title && callback){
        postData.title = title
        self._post(url,postData,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.updateRoom = function(roomId,title, callback){
    var self = this
    var postData={}
    var url = this.apiURL+"rooms/"+roomId

    if(title && callback){
        postData.title = title
        self._put(url,postData,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.getRoom = function(roomId, callback){
    var self = this
    var url = this.apiURL+"rooms/"+roomId

    if(roomId && callback){
        self._get(url,{},callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.deleteRoom = function(roomId, callback){
    var self = this
    var url = this.apiURL+"rooms/"+roomId

    if(roomId && callback){
        self._delete(url,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

///////////////////////
// Message functions
///////////////////////

CiscoSparkClient.prototype.listMessages = function(roomId, queryParams, callback){
    var self = this
    var url = this.apiURL+"messages"

    if (typeof(queryParams) == 'function')
    {
        callback = queryParams
        queryParams={}

    }

    if(roomId && callback){
        if (roomId.toLowerCase() == 'next')
        {
            if (self.paginationLinks.messages.next != null) {
                url = self.paginationLinks.messages.next
                // erase it since we used it.
                self.paginationLinks.messages.next=null
            }else
            {
                // no link...return an empty list
                callback(null,{items:[]})
                return
            }
        }
        else if (roomId.toLowerCase() == 'prev')
        {
            if (self.paginationLinks.messages.next != null) {
                url = self.paginationLinks.messages.prev
                // erase it since we used it.
                self.paginationLinks.messages.prev = null
            }
            else
            {
                // no link...return an empty list
                callback(null,{items:[]})
                return
            }

        }
        else {
            queryParams.roomId = roomId
        }
        self._get(url, queryParams, callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.createMessage = function(roomId, messageText, messageParams, callback){
    var self = this
    var url = this.apiURL+"messages"

    try {


        if (typeof(messageParams) == 'function')
        {
            callback = messageParams
            messageParams={}

        }

        if (roomId.indexOf('@') > -1)
        {
            messageParams.toPersonEmail=roomId

        }
        else
        {
            decodedId = self._decodeBase64(roomId)
            if (decodedId.indexOf("PEOPLE") > -1)
                messageParams.toPersonId = roomId
            else if (decodedId.indexOf("ROOM") > -1)
                messageParams.roomId = roomId
            else
                throw({message:'Invalid room or person id'})
        }

        if(roomId && (messageText || messageParams.file || messageParams.files) && callback){
            self._post(url,messageParams,callback)
        }
        else
        {
            if (callback)
                callback({error: 'Invalid parameters'})
        }

    }
    catch(e)
    {
        if (callback)
            callback(e)
    }
}

CiscoSparkClient.prototype.getMessage = function(messageId, callback){
    var self = this
    var url = this.apiURL+"messages/"+messageId

    if(messageId && callback){
        self._get(url,{},callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.deleteMessage = function(messageId, callback){
    var self = this
    var url = this.apiURL+"messages/"+messageId

    if(messageId && callback){
        self._delete(url,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

////////////////////////////
// People Functions
////////////////////////////
CiscoSparkClient.prototype.listPeople = function(emailOrName, maxResults, callback){
    var self = this
    var url = this.apiURL+"people"
    var queryParams={}

    if (typeof(maxResults) == 'function')
    {
        callback = maxResults

    }
    else
    {
        queryParams.max = maxResults
    }

    if(emailOrName.toLowerCase() == 'next')
    {
        if (self.paginationLinks.people.next != null) {
            url = self.paginationLinks.people.next
            // erase it since we used it.
            self.paginationLinks.people.next=null
        }else
        {
            // no link...return an empty list
            callback(null,{items:[]})
            return
        }
    }
    else if (emailOrName.toLowerCase() == 'prev')
    {
        if (self.paginationLinks.people.next != null) {
            url = self.paginationLinks.people.next
            // erase it since we used it.
            self.paginationLinks.people.next=null
        }else
        {
            // no link...return an empty list
            callback(null,{items:[]})
            return
        }
    }
    else if (emailOrName.indexOf('@') > -1)
    {
        queryParams.email = emailOrName
    }
    else
    {
        queryParams.displayName = emailOrName
    }
    if(emailOrName && callback){
        self._get(url,queryParams,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.getPerson = function(personId, callback){
    var self = this
    var url = this.apiURL+"people/"+personId


    if(personId && callback){
        self._get(url,{},callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}


CiscoSparkClient.prototype.getMe = function(callback){
    var self = this
    var url = this.apiURL+"people/me"


    if(callback){
        self._get(url,{},callback)
    }

}

// Memberships

CiscoSparkClient.prototype.listMemberships = function(roomId, queryParams, callback){
    var self = this
    var url = this.apiURL+"memberships"

    if (typeof(queryParams) == 'function')
    {
        callback = queryParams
        queryParams={}

    }
    if (typeof(roomId) == 'function')
    {
        callback = roomId
        queryParams={}
    }

    else if(roomId.toLowerCase() == 'next')
    {

        if (self.paginationLinks.memberships.next != null) {
            url = self.paginationLinks.memberships.next
            // erase it since we used it.
            self.paginationLinks.memberships.next=null
            queryParams={}
        }else
        {
            // no link...return an empty list
            callback(null,{items:[]})
            return
        }
    }
    else if (roomId.toLowerCase() == 'prev')
    {
        if (self.paginationLinks.memberships.next != null) {
            url = self.paginationLinks.memberships.next
            // erase it since we used it.
            self.paginationLinks.memberships.next=null
            queryParams={}
        }else
        {
            // no link...return an empty list
            callback(null,{items:[]})
            return
        }
    }
    else
    {
        queryParams.roomId=roomId
    }

    if(callback){
        self._get(url,queryParams,callback)
    }

}

CiscoSparkClient.prototype.createMembership = function(roomId, emailOrName, isModerator, callback){
    var self = this
    var url = this.apiURL+"memberships"
    var membershipParams ={}
    try {

        membershipParams.roomId = roomId

        if (typeof(isModerator) == 'function')
        {
            callback = isModerator

        }
        else
        {
            membershipParams.isModerator = isModerator
        }

        if (emailOrName.indexOf('@') > -1)
        {
            membershipParams.personEmail=emailOrName

        }
        else
        {
            decodedPersonId = self._decodeBase64(emailOrName)
            if (decodedPersonId.indexOf("PEOPLE") > -1)
                membershipParams.personId = emailOrName
            else
                throw({message:'Invalid person id'})
        }

        if(roomId && emailOrName && callback){
            self._post(url,membershipParams,callback)
        }
        else
        {
            if (callback)
                callback({error: 'Invalid parameters'})
        }
    }
    catch(e)
    {
        if (callback)
            callback(e)
    }
}

CiscoSparkClient.prototype.getMembership = function(membershipId, callback){
    var self = this
    var url = this.apiURL+"memberships/"+membershipId


    if(membershipId && callback){
        self._get(url,{},callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.updateMembership = function(membershipId, isModerator, callback){
    var self = this
    var url = this.apiURL+"memberships/"+membershipId
    var membershipParams={}

    membershipParams.isModerator = isModerator

    if(membershipId && isModerator && callback){
        self._put(url,membershipParams,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.deleteMembership = function(membershipId, callback){
    var self = this
    var url = this.apiURL+"memberships/"+membershipId


    if(membershipId && callback){
        self._delete(url,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

///////////////////
// Webhooks
//////////////////


CiscoSparkClient.prototype.listWebhooks = function(max, callback){
    var self = this
    var url = this.apiURL+"webhooks"
    var queryParams={}

    if (typeof(max) == 'function')
    {
        callback = max
    }
    else {
        if (typeof(max) == 'string') {
            if (max.toLowerCase() == 'next') {
                if (self.paginationLinks.webhooks.next != null) {
                    url = self.paginationLinks.webhooks.next
                    // erase it since we used it.
                    self.paginationLinks.webhooks.next=null
                }else
                {
                    // no link...return an empty list
                    callback(null,{items:[]})
                    return
                }
            }
            else if (max.toLowerCase() == 'prev') {
                if (self.paginationLinks.webhooks.next != null) {
                    url = self.paginationLinks.webhooks.prev
                    // erase it since we used it.
                    self.paginationLinks.webhooks.prev = null
                }
                else
                {
                    // no link...return an empty list
                    callback(null,{items:[]})
                    return
                }
            }
            else {
                callback({message: 'Invalid parameters'})
                return
            }
        }
        else
            queryParams.max = max
    }


    if(callback){
        self._get(url,queryParams,callback)
    }

}

CiscoSparkClient.prototype.createWebhook = function(name, target, roomId, webhookParams, callback){
    var self = this
    var url = this.apiURL+"webhooks"

    try {

        if (typeof(webhookParams) == 'function')
        {
            callback = webhookParams
            webhookParams={}
            webhookParams.resource='messages'
            webhookParams.event = 'created'
        }

        webhookParams.name = name
        webhookParams.targetUrl = target
        webhookParams.filter = 'roomId='+roomId

        if(roomId && name && target && callback){
            self._post(url,webhookParams,callback)
        }
        else
        {
            if (callback)
                callback({error: 'Invalid parameters'})
        }
    }
    catch(e)
    {
        if (callback)
            callback(e)
    }
}

CiscoSparkClient.prototype.getWebhook = function(webhookId, callback){
    var self = this
    var url = this.apiURL+"webhooks/"+webhookId

    if(webhookId && callback){
        self._get(url,{},callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.updateWebhook = function(webhookId, name, target, callback){
    var self = this
    var url = this.apiURL+"webhooks/"+webhookId
    var webhookParams ={}

    if (typeof(target) == 'function')
    {
        callback = target
        callback({error: 'Invalid parameters'})
        return
    }
    else
    {
        webhookParams.name = name
        webhookParams.targetUrl = target

    }

    if(webhookId && name && target && callback){
        self._put(url,webhookParams,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

CiscoSparkClient.prototype.deleteWebhook = function(webhookId, callback){
    var self = this
    var url = this.apiURL+"webhooks/"+webhookId


    if(webhookId && callback){
        self._delete(url,callback)
    }
    else
    {
        if (callback)
            callback({error: 'Invalid parameters'})
    }
}

// export the class
module.exports = CiscoSparkClient;
