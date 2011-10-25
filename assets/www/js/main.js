var contactOb;
var positionOb;
var beaconURL;

function init() {
    document.addEventListener("deviceready", phoneReady, false);
}

function phoneReady() {
    //first step is to get GPS
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {maximumAge:0, enableHighAccurage:true});

    //generic error handler.
    function displayError(str) {
        x$("#errorDiv").html(str);
    }
    
    function geoSuccess(position) {
        //copy it over
        positionOb = position;

        //before we tell the user anything - we need to register our location for a beacon id
        x$("#currentStatus").xhr("http://192.168.1.105/beacon/service/remote.cfc?method=registerBeacon&returnFormat=plain&longitude="+position.coords.longitude+"&latitude="+position.coords.latitude, {
                async:false,
                method:"get",
                callback:function() {
                    beaconURL = this.responseText;
                }
            });

        x$("#currentStatus").html("after","Sweet! Got your location, now I need you to pick a contact.");
        x$("#contactButtonBlock").attr("style","");
    }
    
    function geoError() {
        displayError("Sorry - an error with GPS was thrown and I can't do anything else.");
    }
    
    x$("#pickContactButton").touchstart(function() {
        window.plugins.contactView.show(
            function(contact) {
                if(typeof contact.phone === "undefined" && typeof contact.email === "undefined") {
                    alert("Sorry, but this contact doesn't have\na phone number or an email address.");
                } else {
                    
                    //copy to global var
                    contactOb = contact;
                    
                    var s = "<p>You will be sending "+contact.name +" information on how to reach you.</p>";
                    if(typeof contact.phone === "undefined") {
                        s+= "<button disabled='true'>Send SMS</button>";
                    } else {
                        s+= "<button id='sendSMSButton'>Send SMS</button>";
                    }
                    if(typeof contact.email === "undefined") {
                        s+= "<button disabled='true'>Send Email</button>";
                    } else {
                        s+= "<button id='sendEmailButton'>Send Email</button>";
                    }
                    x$("#contactChosen").html(s);

                    x$("#sendSMSButton").touchstart(function() {
                       var body = "Find me by cliking here: "+beaconURL;
                       var theUrl = "sms:"+contactOb.phone+"?body="+escape(body);
                       window.location.href=theUrl;
                   });
                   

                }
            },
            function(fail) {
                alert("We were unable to get the contact you selected."+fail.toString());
            }
        );
        
    });
    

}